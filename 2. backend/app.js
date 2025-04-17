const express = require("express");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const app = express();

require("dotenv").config({ path: "./config/config.env" });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    credentials: true,
  })
);

app.use(mongoSanitize());
app.use(helmet())

app.use("/api", require("./routes/index"));
app.use("/api", require("./routes/api/taskApi"));
app.use("/api", require("./routes/api/userApi"));
app.use("/api", require("./routes/api/contactApi"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
