import axios from "axios";
import { createClient } from "redis";

const redisUrl = process.env.REDIS_API_URL;
if (!redisUrl) {
  throw new Error("REDIS_API_URL environment variable is not set");
}
const redis = createClient({
  url: redisUrl,
});
redis.connect();

export async function findDuplicates(title: string) {
  const cacheKey = `duplicates:${title}`;

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  try {
    const response = await axios.get(
      "https://api.stackexchange.com/2.3/similar",
      {
        params: {
          order: "desc",
          sort: "relevance",
          title: title,
          site: "stackoverflow",
          key: process.env.STACKOVERFLOW_API_URL,
        },
      }
    );

    const duplicates = response.data.items.slice(0, 3);

    await redis.set(cacheKey, JSON.stringify(duplicates), {
      EX: 86400,
    });

    return duplicates;
  } catch (error) {
    console.error("Stack Overflow API error:", error);
    return [];
  }
}
