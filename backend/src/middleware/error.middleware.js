const errorHandler = (
  err,
  req,
  res,
  next
) => {

  const statusCode =
    err.statusCode || 500;


  const isProduction =
    process.env.NODE_ENV ===
    "production";


  // ========================================
  // LOG ERROR
  // ========================================

  console.error(
    err
  );


  // ========================================
  // PRODUCTION
  // ========================================

  if (isProduction) {

    return res
      .status(statusCode)
      .json({

        success: false,

        status:
          err.status ||
          "error",

        message:
          statusCode === 500
            ? "Internal Server Error"
            : err.message,

      });

  }


  // ========================================
  // DEVELOPMENT
  // ========================================

  return res
    .status(statusCode)
    .json({

      success: false,

      status:
        err.status ||
        "error",

      message:
        err.message ||
        "Internal Server Error",

      stack:
        err.stack,

    });

};

export default errorHandler;