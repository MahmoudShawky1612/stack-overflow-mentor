"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDuplicates = findDuplicates;
const axios_1 = require("axios");
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
function findDuplicates(title) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheKey = `duplicates:${title}`;
        // Check cache first
        const cached = yield redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        try {
            const response = yield axios_1.default.get('https://api.stackexchange.com/2.3/similar', {
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
            yield redis.set(cacheKey, JSON.stringify(duplicates), {
                EX: 86400 // 24 hours
            });
            return duplicates;
        }
        catch (error) {
            console.error('Stack Overflow API error:', error);
            return [];
        }
    });
}
