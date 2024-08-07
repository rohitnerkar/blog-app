const express = require("express");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
dotenv.config();
const connectMongodb = require("./init/mongodb");
const { authRoute, categoryRoute, fileRoute, postRoute } = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const notfound = require("./controller/notfound");
// const path = require('path');

const app = express();

connectMongodb();

app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(bodyparser.urlencoded({ limit: "500mb", extended: true}));
app.use(morgan("dev"));

// app.use(express.static(path.join(__dirname, 'dist'), {
//   setHeaders: (res, filePath) => {
//     if (path.extname(filePath) === '.js') {
//       res.setHeader('Content-Type', 'application/javascript');
//     }
//   }
// }));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/file", fileRoute);
app.use("/api/v1/posts", postRoute);

app.use("*", notfound);
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
//   });

app.use(errorHandler);

module.exports = app;