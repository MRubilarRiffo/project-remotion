const { z } = require('zod');

const scheduleYoutubeSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(100, 'El título no puede exceder los 100 caracteres'),
  description: z.string().optional(),
  privacy_status: z.enum(['public', 'private', 'unlisted'], {
    errorMap: () => ({ message: 'El estado de privacidad debe ser "public", "private" o "unlisted"' }),
  }).default('private'),
  scheduled_time: z.string().optional(),
});

module.exports = {
  scheduleYoutubeSchema,
};
