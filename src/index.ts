"use strict";
//const fs = require("fs");
import json from "./cs-wiki.json";
const { getRandomIndexTodaySeed } = require("./lib/random");

export type WikiEntry = {
  term: string;
  definitions: string[];
};

export const csWiki = json as Array<WikiEntry>; //JSON.parse(
//fs.readFileSync("cs-wiki.json")
//) as Array<WikiEntry>;
export const getCSWordOfDay = (): WikiEntry =>
  csWiki[getRandomIndexTodaySeed(csWiki.length)];
export const getWikiEntryByTerm = (term: string): WikiEntry | undefined =>
  csWiki.find((entry) => entry.term.toLowerCase() === term.toLowerCase());
