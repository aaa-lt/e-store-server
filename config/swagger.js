import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.3",
    info: {
        title: "E-Commerce Product Management API",
        version: "v1",
        description:
            "This project aims to build a RESTful API for managing an e-commerce product catalog.",
    },
    components: {
        securitySchemes: {
            Authorization: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
