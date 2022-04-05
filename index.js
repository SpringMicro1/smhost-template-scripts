"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWikiEntryByTerm = exports.getCSWordOfDay = exports.csWiki = void 0;
const cs_wiki_json_1 = __importDefault(require("./cs-wiki.json"));
const { getRandomIndexTodaySeed } = require("./lib/random");
exports.csWiki = cs_wiki_json_1.default;
const getCSWordOfDay = () => exports.csWiki[getRandomIndexTodaySeed(exports.csWiki.length)];
exports.getCSWordOfDay = getCSWordOfDay;
const getWikiEntryByTerm = (term) => exports.csWiki.find((entry) => entry.term.toLowerCase() === term.toLowerCase());
exports.getWikiEntryByTerm = getWikiEntryByTerm;
