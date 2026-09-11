export const responseMiddleware = (req, res, next) => {
  res.success = ({ data = null, message = "Success", statusCode = 200, meta }) => {
    const body = {
      success: true,
      message,
      data,
    };

    if (meta !== undefined) body.meta = meta;

    return res.status(statusCode).json(body);
  };

  next();
};

