const { z } = require('zod');

const scheduleFacebookSchema = z.object({
  message: z.string().min(1, 'El mensaje es requerido'),
  type: z.enum(['text', 'image', 'video'], {
    errorMap: () => ({ message: 'El campo type debe ser "text", "image" o "video"' }),
  }),
  scheduled_time: z.string().optional(),
});

module.exports = {
  scheduleFacebookSchema,
};
