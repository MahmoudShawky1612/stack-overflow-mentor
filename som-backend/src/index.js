"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analyzer_1 = require("./analyzer");
const cors_1 = __importDefault(require("cors")); // Add this
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'Extension-ID']
}));
app.use(express_1.default.json());
app.post('/analyze', async (req, res) => {
    try {
        const { title, body } = req.body;
        const analysis = await (0, analyzer_1.analyzeQuestion)(body, title);
        res.json(analysis);
    }
    catch (error) {
        res.status(500).json({ error: 'Analysis failed' });
    }
});
app.listen(PORT, () => {
    console.log(`⚡️ Server running at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map