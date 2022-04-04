# CS Wiki

A JSON representation of terms and definitions from Wikipedia's [Glossary of Computer Science](https://en.wikipedia.org/wiki/Glossary_of_computer_science), which information is available with a [Creative Commons Attribution-ShareAlike 3.0 Unported License](https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License).

## Usage

Here are the objects and types available for import from this module.

```typescript
// Entries scraped from Wikipedia's CS glossary
export type WikiEntry = {
  term: string;
  definitions: string[];
};

// An array of all the entries that have terms and definitions
export const csWiki: Array<WikiEntry>;

// Returns an entry from the csWiki based on a pseudo-random algorithm with today's date as the seed
export function getCSWordOfDay(): WikiEntry;

// Returns an entry if found (case insenstive), else returns undefined
export function getWikiEntryByTerm(term: string): WikiEntry | undefined;
```

## Development

```bash
# Executes main.js which scrapes Wikipedia and stores the glossary in cs-wiki.json
npm run build
# Test functions in ./lib/* and index.ts
npm test
```

Both of the above commands get executed precommit with [husky](./.husky/pre-commit).
