import fs from "fs";
const NUMBER_OF_ARGS = 4;
const OPTIONS = ["--enable", "--disable"];

if (
  process.argv.length !== NUMBER_OF_ARGS ||
  !OPTIONS.includes(process.argv[NUMBER_OF_ARGS - 2])
) {
  console.log("USAGE: node enable-page.js --enable|--disable page");
  process.exit(1);
}

const enable = process.argv[NUMBER_OF_ARGS - 2] === "--enable";
const page = process.argv[NUMBER_OF_ARGS - 1];
const BASE_PATH = "../../src/pages";
const disabled = new Set();

// prefixing pages or directories with "_" disables them.
// https://docs.astro.build/en/core-concepts/routing/#excluding-pages
fs.readdir(BASE_PATH, function (err, files) {
  files.forEach((file) => {
    if (!enable && (file === `${page}.astro` || file === page)) {
      fs.rename(`${BASE_PATH}/${file}`, `${BASE_PATH}/_${file}`, (err) => {
        if (err) console.log("rename error", err);
      });
      disabled.add("/" + file.replace(".astro", ""));
    }
    if (enable && (file === `_${page}.astro` || file === "_" + page)) {
      if (enable) {
        fs.rename(
          `${BASE_PATH}/${file}`,
          `${BASE_PATH}/${file.replace("_", "")}`,
          (err) => {
            if (err) console.log("rename error", err);
          }
        );
      }
    } else if (file.indexOf("_") === 0) {
      disabled.add(file.replace(".astro", "").replace("_", "/"));
    }
  });

  // write disabled pages here
  fs.writeFile(
    `../../src/disabled.json`,
    JSON.stringify(Array.from(disabled)),
    (err) => {
      if (err) console.log(err);
    }
  );
});
