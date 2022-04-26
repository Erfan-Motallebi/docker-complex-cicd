const redis = require("redis");
const connKeys = require("./constants/keys");

const client = redis.createClient({
  url: `redis://${connKeys.redisHost}`,
});

client.connect().then((res) => console.log(res));

client.on("err", () => {
  console.error("Failed to connect to the Redis Server");
});

client.on("connect", () => {
  console.log("Redis in Worker-node is now established");
});

const sub = client.duplicate();

async function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.subscribe("insert");

sub.on("message", (channel, message) => {
  client.hSet("values", message, fib(parseInt(message)));
});
