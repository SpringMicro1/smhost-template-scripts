const puppeteer = require("puppeteer");
const fs = require("fs");
const {
  replaceUnicodeSpaces,
  replaceWikiCitations,
  replaceWikiMath,
} = require("./lib/replacers");

// https://intoli.com/blog/not-possible-to-block-chrome-headless/
const preparePageForTests = async (page) => {
  // pass the user-agent test to scrape wikipedia
  const userAgent =
    "Mozilla/5.0 (X11; Linux x86_64)" +
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36";
  await page.setUserAgent(userAgent);
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await preparePageForTests(page);
  await page.goto("https://en.wikipedia.org/wiki/Glossary_of_computer_science");

  const dictionary = await page.evaluate(() => {
    const dictionary = [];
    let entry = {};
    const glossaryArr = Array.from(
      document.querySelectorAll(".glossary:not(dl):not(dfn)")
    );
    glossaryArr.forEach((el, i) => {
      if (el.nodeName === "DT" && i !== 0) {
        dictionary.push(entry);
        // start new entry
        entry = {};
      }

      const val = el.textContent;

      if (el.nodeName === "DD") {
        if (Object.keys(entry).includes("definitions")) {
          entry["definitions"].push(val);
        } else {
          entry["definitions"] = [val];
        }
      } else {
        entry["term"] = val;
      }

      if (i === glossaryArr.length - 1) {
        // last object, push to dictionary
        dictionary.push(entry);
      }
    });

    return dictionary;
  });

  // have to do the string replacing here because puppeteer has a hard time
  // using imported functions
  // https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pageevaluatepagefunction-args
  // after replacing, filter out any null terms/definitions
  const json = JSON.stringify(
    dictionary
      .map((entry) => ({
        ...entry,
        definitions: entry.definitions.map((def) =>
          replaceWikiMath(replaceUnicodeSpaces(replaceWikiCitations(def)))
        ),
      }))
      .filter((entry) => !!entry.term && !!entry.definitions[0])
  );

  // write to file
  fs.writeFileSync("./src/cs-wiki.json", json);
  await browser.close();
})();
