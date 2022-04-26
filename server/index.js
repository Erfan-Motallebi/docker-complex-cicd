const keys = require("./keys");

// Express App Setup
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({}));

// Postgres Client Setup
const { Pool } = require("pg");

const pgClient = new Pool({
  host: keys.pgHost,
  database: keys.pgDatabase,
  port: keys.pgPort,
  user: keys.pgUser,
  password: keys.pgPassword,
});

pgClient.on("connect", (client) => {
  client
    .query(
      "CREATE TABLE IF NOT EXISTS values (value_id SMALLSERIAL PRIMARY KEY,number INT)"
    )
    .catch((err) => console.error(err));
});

// Redis Client Setup
const redis = require("redis");
const redisClient = redis.createClient({
  url: `redis://${keys.redisHost}`,
});

redisClient.connect().then((res) => console.log(res));

redisClient.on("connect", () => {
  console.log("Redis in server is up and running");
});

const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");
  console.log({ rows: values.rows });
  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  redisClient.hGetAll("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hSet("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log("Listening");
});
