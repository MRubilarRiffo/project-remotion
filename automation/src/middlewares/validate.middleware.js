const { ZodError } = require('zod');

const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
      // Usamos .parse() que lanzará un error si falla
      // Solo validamos el body por ahora. Se podría extender a query o params.
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formatear los errores de Zod para que sean amigables
        const validationErrors = error.errors || error.issues || [];
        const formattedErrors = validationErrors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          error: 'Error de validación',
          details: formattedErrors,
        });
      }
      next(error);
    }
  };
};

module.exports = {
  validateSchema,
};
