const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();

const BASE_URL = 'https://graph.facebook.com/v25.0';
const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

const uploadVideoResumable = async (pageId, accessToken, mediaFile, message, scheduledTime, thumbnailFile) => {
  // Fase 1: Start (Initialize Reels Session)
  const startPayload = {
    upload_phase: 'start',
    access_token: accessToken
  };
  
  const startRes = await axios.post(`${BASE_URL}/${pageId}/video_reels`, startPayload);
  const { video_id } = startRes.data;

  // Fase 2: Transfer (Upload Binary Data)
  const fileBuffer = fs.readFileSync(mediaFile.path);
  const transferHeaders = {
    'Authorization': `OAuth ${accessToken}`,
    'offset': '0',
    'file_size': mediaFile.size.toString(),
    'Content-Type': 'application/octet-stream',
    'Content-Length': mediaFile.size.toString()
  };

  const ruploadUrl = `https://rupload.facebook.com/video-upload/v25.0/${video_id}`;
  
  await axios.post(ruploadUrl, fileBuffer, {
    headers: transferHeaders,
    maxBodyLength: Infinity,
    maxContentLength: Infinity
  });

  // Fase 3: Finish (Publish Reel)
  const finishPayload = new FormData();
  finishPayload.append('upload_phase', 'finish');
  finishPayload.append('access_token', accessToken);
  finishPayload.append('video_id', video_id);
  
  if (scheduledTime) {
    finishPayload.append('video_state', 'SCHEDULED');
    finishPayload.append('scheduled_publish_time', scheduledTime.toString());
  } else {
    finishPayload.append('video_state', 'PUBLISHED');
  }
  
  if (message) finishPayload.append('description', message);

  if (thumbnailFile && thumbnailFile.path) {
    finishPayload.append('thumb', fs.createReadStream(thumbnailFile.path));
  }

  const finishRes = await axios.post(`${BASE_URL}/${pageId}/video_reels`, finishPayload, {
    headers: { ...finishPayload.getHeaders() }
  });
  return finishRes.data;
};

const scheduleContent = async ({ message, type, mediaFile, thumbnailFile, scheduledTime }) => {
  if (!PAGE_ID || !ACCESS_TOKEN) {
    throw new Error('Faltan credenciales FACEBOOK_PAGE_ID o FACEBOOK_ACCESS_TOKEN en el entorno.');
  }

  if (type === 'video') {
    return await uploadVideoResumable(PAGE_ID, ACCESS_TOKEN, mediaFile, message, scheduledTime, thumbnailFile);
  }

  let endpoint = '';
  let requestConfig = {
    headers: {}
  };
  
  let payload;

  if (type === 'text') {
    endpoint = `/${PAGE_ID}/feed`;
    payload = {
      access_token: ACCESS_TOKEN
    };
    if (scheduledTime) {
      payload.published = false;
      payload.scheduled_publish_time = scheduledTime;
    } else {
      payload.published = true;
    }
    if (message) payload.message = message;
  } else if (type === 'image') {
    endpoint = `/${PAGE_ID}/photos`;
    payload = new FormData();
    if (scheduledTime) {
      payload.append('published', 'false');
      payload.append('scheduled_publish_time', scheduledTime.toString());
    } else {
      payload.append('published', 'true');
    }
    payload.append('access_token', ACCESS_TOKEN);
    
    if (mediaFile) {
      payload.append('source', fs.createReadStream(mediaFile.path), {
        filename: mediaFile.originalname,
        contentType: mediaFile.mimetype,
        knownLength: mediaFile.size
      });
    }
    
    if (message) payload.append('message', message);
    
    requestConfig.headers = {
      ...payload.getHeaders()
    };
    requestConfig.maxBodyLength = Infinity;
    requestConfig.maxContentLength = Infinity;
  } else {
    throw new Error('Tipo de contenido no soportado.');
  }

  const response = await axios.post(`${BASE_URL}${endpoint}`, payload, requestConfig);
  return response.data;
};

const getPageAnalytics = async () => {
  if (!PAGE_ID || !ACCESS_TOKEN) {
    throw new Error('Faltan credenciales FACEBOOK_PAGE_ID o FACEBOOK_ACCESS_TOKEN en el entorno.');
  }

  // Obtenemos información básica de la página como seguidores y likes (fan_count)
  const response = await axios.get(`${BASE_URL}/${PAGE_ID}`, {
    params: {
      fields: 'id,name,followers_count,fan_count',
      access_token: ACCESS_TOKEN
    }
  });
  
  return response.data;
};

const getPostsAnalytics = async (limit = 25) => {
  if (!PAGE_ID || !ACCESS_TOKEN) {
    throw new Error('Faltan credenciales FACEBOOK_PAGE_ID o FACEBOOK_ACCESS_TOKEN en el entorno.');
  }

  // Obtenemos las publicaciones normales (textos, imágenes, posts) sin insights para evitar errores OAuthException
  const postsPromise = axios.get(`${BASE_URL}/${PAGE_ID}/published_posts`, {
    params: {
      fields: 'id,message,created_time,attachments,shares,likes.summary(true),comments.summary(true)',
      limit: limit,
      access_token: ACCESS_TOKEN
    }
  });

  // Obtenemos los Reels/Videos e incluimos sus métricas de visualización (video_insights)
  const reelsPromise = axios.get(`${BASE_URL}/${PAGE_ID}/video_reels`, {
    params: {
      fields: 'id,description,created_time,likes.summary(true),comments.summary(true),video_insights',
      limit: limit,
      access_token: ACCESS_TOKEN
    }
  });

  const [postsResponse, reelsResponse] = await Promise.all([postsPromise, reelsPromise]);

  let allContent = [];

  // Función auxiliar para extraer métricas de insights de manera segura
  const getInsightValue = (insightsData, metricName) => {
    if (!insightsData || !insightsData.data) return 0;
    const metric = insightsData.data.find(m => m.name === metricName);
    return metric?.values?.[0]?.value || 0;
  };

  // Transformar posts
  if (postsResponse.data && postsResponse.data.data) {
    const postsData = postsResponse.data.data.map(post => {
      let type = 'post/image';
      let targetId = post.id;
      
      const attachment = post.attachments?.data?.[0];
      if (attachment) {
        if (attachment.type && attachment.type.includes('video')) {
           type = 'video/reel';
           if (attachment.target && attachment.target.id) {
             targetId = attachment.target.id;
           }
        }
      }

      return {
        id: post.id,
        target_id: targetId,
        message: post.message || '',
        created_time: post.created_time,
        likes: post.likes?.summary?.total_count || 0,
        comments: post.comments?.summary?.total_count || 0,
        shares: post.shares?.count || 0,
        views: getInsightValue(post.insights, 'post_impressions_unique'),
        type: type
      };
    });
    allContent = [...allContent, ...postsData];
  }

  // Transformar reels
  if (reelsResponse.data && reelsResponse.data.data) {
    const reelsData = reelsResponse.data.data.map(reel => {
      const views = getInsightValue(reel.video_insights, 'fb_reels_total_plays') || 0;
      const blue_plays = getInsightValue(reel.video_insights, 'blue_reels_play_count') || views || 1;
      const view_time_ms = getInsightValue(reel.video_insights, 'post_video_view_time') || 0;
      const retention_graph = getInsightValue(reel.video_insights, 'post_video_retention_graph') || {};

      let sum_R = 0;
      for (let key in retention_graph) {
        sum_R += retention_graph[key];
      }

      const T = view_time_ms / 1000;
      let V3 = blue_plays; // base is total plays if nothing else
      
      // Deducción matemática de la retención real (asumiendo 1 segundo de retención promedio para los abandonos rápidos)
      if (sum_R > 1 && T > 0) {
        V3 = (T - blue_plays) / (sum_R - 1);
        if (V3 > blue_plays) V3 = blue_plays;
        if (V3 < 0) V3 = 0;
      }

      const hook_rate = V3 / blue_plays;
      const true_retention_graph = {};

      for (let key in retention_graph) {
        const t = parseInt(key, 10);
        if (t >= 3) {
          true_retention_graph[key] = parseFloat((hook_rate * retention_graph[key]).toFixed(4));
        }
      }
      
      // Aproximación exponencial para los primeros 3 segundos
      if (Object.keys(retention_graph).length > 0) {
        true_retention_graph['0'] = 1.0;
        true_retention_graph['1'] = parseFloat(Math.pow(hook_rate, 1/3).toFixed(4));
        true_retention_graph['2'] = parseFloat(Math.pow(hook_rate, 2/3).toFixed(4));
      }

      return {
        id: reel.id,
        target_id: reel.id,
        message: reel.description || '',
        created_time: reel.created_time,
        likes: reel.likes?.summary?.total_count || 0,
        comments: reel.comments?.summary?.total_count || 0,
        shares: 0,
        views: views,
        hook_rate: parseFloat(hook_rate.toFixed(4)),
        retention_graph: true_retention_graph,
        type: 'video/reel'
      };
    });
    allContent = [...allContent, ...reelsData];
  }

  // Eliminar duplicados priorizando la versión de video/reel pura que tiene más métricas
  const uniqueContentMap = new Map();
  for (const item of allContent) {
    const key = item.target_id || item.id;
    if (uniqueContentMap.has(key)) {
      const existing = uniqueContentMap.get(key);
      if (existing.hook_rate !== undefined && item.hook_rate === undefined) {
        continue;
      }
    }
    uniqueContentMap.set(key, item);
  }
  const uniqueContent = Array.from(uniqueContentMap.values());
  
  // Limpiar campo auxiliar
  uniqueContent.forEach(item => delete item.target_id);

  // Ordenar por fecha de creación (más reciente primero)
  uniqueContent.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));

  // Limitar al número solicitado
  return uniqueContent.slice(0, limit);
};

module.exports = {
  scheduleContent,
  getPageAnalytics,
  getPostsAnalytics
};
