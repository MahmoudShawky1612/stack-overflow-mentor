"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDuplicates = findDuplicates;
const axios_1 = __importDefault(require("axios"));
const redis_1 = require("redis");
// Connect to Redis (free tier)
const redisUrl = process.env.REDIS_API_URL;
if (!redisUrl) {
    throw new Error('REDIS_API_URL environment variable is not set');
}
const redis = (0, redis_1.createClient)({
    url: redisUrl,
});
redis.connect();
async function findDuplicates(title) {
    const cacheKey = `duplicates:${title}`;
    // Check cache first
    const cached = await redis.get(cacheKey);
    if (cached)
        return JSON.parse(cached);
    try {
        const response = await axios_1.default.get('https://api.stackexchange.com/2.3/similar', {
            params: {
                order: 'desc',
                sort: 'relevance',
                title: title,
                site: 'stackoverflow',
                key: process.env.STACKOVERFLOW_API_URL
            }
        });
        const duplicates = response.data.items.slice(0, 3);
        // Cache results for 24 hours
        await redis.set(cacheKey, JSON.stringify(duplicates), {
            EX: 86400 // 24 hours
        });
        return duplicates;
    }
    catch (error) {
        console.error('Stack Overflow API error:', error);
        return [];
    }
}
//# sourceMappingURL=stackoverflow.js.map