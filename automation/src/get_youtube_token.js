require('dotenv').config();
const { google } = require('googleapis');
const readline = require('readline');

// Configurar cliente de OAuth2 con las credenciales de tu .env
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

// Aquí definimos LOS NUEVOS SCOPES que incluyen leer analíticas y subir videos
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',     // Para subir videos (lo que ya tenías)
  'https://www.googleapis.com/auth/youtube.readonly'    // Para poder leer analíticas y estadísticas (NUEVO)
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent', // Forzamos a que nos vuelva a entregar un Refresh Token
  scope: SCOPES,
});

console.log('=== PASO 1 ===');
console.log('Abre la siguiente URL en tu navegador y autoriza la aplicación:\n');
console.log(authUrl);
console.log('\n================');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Una vez que hayas autorizado, pega aquí el CÓDIGO que te aparece en la URL: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('\n=== ¡ÉXITO! AQUÍ TIENES TU NUEVO TOKEN ===\n');
    console.log('Copia el siguiente REFRESH_TOKEN y pégalo en tu archivo .env reemplazando el anterior:');
    console.log('\nYOUTUBE_REFRESH_TOKEN=' + tokens.refresh_token + '\n');
    console.log('=============================================\n');
    
  } catch (error) {
    console.error('Error al obtener el token:', error.message);
    if(error.response) console.error(error.response.data);
  } finally {
    rl.close();
  }
});
