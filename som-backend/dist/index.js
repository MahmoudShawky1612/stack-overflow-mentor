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
const express_1 = require("express");
const analyzer_1 = require("./analyzer");
const cors_1 = require("cors"); // Add this
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'Extension-ID']
}));
app.use(express_1.default.json());
app.post('/analyze', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, body } = req.body;
        const analysis = yield (0, analyzer_1.analyzeQuestion)(body, title);
        res.json(analysis);
    }
    catch (error) {
        res.status(500).json({ error: 'Analysis failed' });
    }
}));
app.listen(PORT, () => {
    console.log(`⚡️ Server running at http://localhost:${PORT}`);
});
