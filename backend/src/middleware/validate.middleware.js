import AppError from "../errors/AppError.js";

const validate = (
  schema,
  source = "body"
) => {

  return (req, res, next) => {

    // ========================================
    // GET DATA
    // ========================================

    const data =
      req[source];


    // ========================================
    // VALIDATE
    // ========================================

    const result =
      schema.safeParse(data);


    // ========================================
    // VALIDATION FAILED
    // ========================================

    if (!result.success) {

      const errors =
        result.error.issues.map(
          (issue) => ({
            field:
              issue.path.join("."),
            message:
              issue.message,
          })
        );


      throw new AppError(
        "Validation failed",
        400,
        errors
      );

    }


    // ========================================
    // STORE VALIDATED DATA
    // ========================================

    if (source === "query") {

      req.validatedQuery =
        result.data;

    } else if (source === "params") {

      req.validatedParams =
        result.data;

    } else {

      req.validatedBody =
        result.data;

    }


    next();

  };

};

export default validate;