const express = require("express");
const knex = require("knex");
const knexFile = require("./knexfile").development;
const db = knex(knexFile);
const cors = require('cors');

const app = express();
const bodyParser = require("body-parser");
const port = 7000;

const auth = require("./routes/authRoute");
const user = require("./routes/userRoute");
const project = require("./routes/projectRoute");
const run = require("./routes/runRoute");
const sdk = require("./routes/sdkRoute");
const hpo = require("./routes/hpoRoute");

const jwtMiddleWare = require("./applications/auth/authorizationMW");

//db.migrate.latest();
//db.seed.run();
//db.migrate.down();

app.use(cors());

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
app.use(express.static("swagger"));

app.use("/auth", auth);

app.use(jwtMiddleWare); // 토큰 검증 미들웨어.

app.use("/admin", user);

app.use("/admin", project);

app.use("/admin", run);

app.use("/admin", sdk);

app.use("/admin", hpo);

app.listen(port, () => {
  console.log("Express listening on port", port);
});
