require("express-async-errors")
const express = require("express");
const database = require("./database/sqlite")
const routes = require("./routes");
const AppError = require("./utils/AppError");

const app = express();

app.use(express.json());

database();

app.use(routes);

app.use((error, request, response, next) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    };

    console.error(error);

    return response.status(500).json({
        status: "error",
        message: "Internal server error."
    });
});

const PORT = 3334;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`))