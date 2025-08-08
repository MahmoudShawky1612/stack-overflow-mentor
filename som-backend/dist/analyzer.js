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
exports.analyzeQuestion = analyzeQuestion;
const natural = require("natural");
const stackoverflow_1 = require("./stackoverflow");
const classifier = new natural.BayesClassifier();
// Train classifier with examples
classifier.addDocument('it doesn\'t work', 'vague');
classifier.addDocument('help me fix this', 'vague');
classifier.addDocument('getting error 404', 'specific');
classifier.train();
function analyzeQuestion(body, title) {
    return __awaiter(this, void 0, void 0, function* () {
        const suggestions = [];
        // 1. Vague language detection (more robust)
        const vaguePhrases = ["doesn't work", "not working", "something wrong", "help me"];
        const isVague = vaguePhrases.some(phrase => body.toLowerCase().includes(phrase));
        if (isVague) {
            suggestions.push('Try to be more specific about the problem');
        }
        // 2. Code detection (more reliable)
        const hasCode = body.includes('```') ||
            /<code>/.test(body) ||
            /function\s+\w+\(/.test(body) ||
            /def\s+\w+\(/.test(body);
        if (!hasCode) {
            suggestions.push('Consider adding a code example');
        }
        // 3. Body length check
        if (body.length < 50) {
            suggestions.push('Add more details about what you\'ve tried');
        }
        // 4. Stack Overflow duplicates
        const duplicates = yield (0, stackoverflow_1.findDuplicates)(title);
        return {
            suggestions,
            qualityScore: calculateQualityScore(body, suggestions.length),
            duplicates
        };
    });
}
function calculateQualityScore(body, issueCount) {
    const baseScore = 80;
    const bodyScore = Math.min(body.length / 50, 20); // max 20 points
    return baseScore + bodyScore - (issueCount * 5);
}
