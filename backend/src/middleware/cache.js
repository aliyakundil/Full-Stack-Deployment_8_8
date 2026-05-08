import { redisClient } from "../config/redis.js";

export async function clearTodosCache() {
  const keys = await redisClient.keys("todos:*");

  if (keys.length > 0) {
    await redisClient.del(keys);
  }
}

export function cache(req, res, next) {
  if (!redisClient || !redisClient.isOpen) {
    return next();
  }
  const key = `todos:${JSON.stringify(req.query)}`;

  redisClient.get(key)
    .then((cachedData) => {
      if (cachedData) {
        return res.status(200).json({
          success: true,
          source: "cache",
          data: JSON.parse(cachedData),
        });
      }

      const originalJson = res.json.bind(res);

      res.json = (data) => {
        redisClient.setEx(key, 300, JSON.stringify(data));
        return originalJson(data);
      };

      next();
    })
    .catch((err) => {
      console.error("Redis cache error:", err);
      next();
    });
}