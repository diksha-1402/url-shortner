import constants from "./constants.js";
import redis from "redis";
export default async function redisConnect() {
  // Redis client setup
  const redisClient = redis.createClient({
    host: constants.CONST_REDIS_HOST,
    port: constants.CONST_REDIS_PORT,
  });
  redisClient.on("error", (err) => console.error("Redis Client Error:", err));
  (async () => {
    try {
      await redisClient.connect();
      console.log("Redis client connected");
    } catch (err) {
      console.error("Failed to connect Redis client:", err);
    }
  })();
}
