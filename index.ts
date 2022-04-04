"use strict";
const fs = require("fs");
const { getRandomIndexTodaySeed } = require("./lib/random");

export type WikiEntry = {
  term: string;
  definitions: string[];
};

export const csWiki = JSON.parse(
  fs.readFileSync("cs-wiki.json")
) as Array<WikiEntry>;
export const getCSWordOfDay = (): WikiEntry =>
  csWiki[getRandomIndexTodaySeed(csWiki.length)];
export const getWikiEntryByTerm = (term: string): WikiEntry | undefined =>
  csWiki.find((entry) => entry.term.toLowerCase() === term.toLowerCase());
