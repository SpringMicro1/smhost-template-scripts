"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomIndexTodaySeed = void 0;
function getRandomIndexTodaySeed(max, date = new Date()) {
    let day = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) /
        24 /
        60 /
        60 /
        1000;
    let t = (day += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return Math.floor((((t ^ (t >>> 14)) >>> 0) * max) / 4294967296);
}
exports.getRandomIndexTodaySeed = getRandomIndexTodaySeed;
