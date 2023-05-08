import fs from "fs";
import { chromium } from "playwright";

const NUMBER_OF_ARGS = 3;
if (process.argv.length !== NUMBER_OF_ARGS) {
  console.log("USAGE: node screenshot.js <project-directory>");
  process.exit(1);
}

const projectDir = process.argv[2];

if (projectDir.indexOf("../../") !== 0) {
  console.log("Invalid project directory.");
  process.exit(1);
}

if (!fs.existsSync(projectDir)) {
  console.log(`Project directory ${projectDir} does not exist.`);
  process.exit(1);
}

const siteUrl = "http://localhost:8080";

async function takeScreenshot() {
  let browser = await chromium.launch();
  let page = await browser.newPage();
  await page.setViewportSize({ width: 16 * 80, height: 9 * 80 });
  try {
    await page.goto(siteUrl);
  } catch (e) {
    console.log(`Could not open ${siteUrl}.`);
    process.exit(1);
  }
  const path = `${projectDir}/opengraph.jpg`;
  await page.screenshot({ path });
  console.log(`Screenshot stored in ${path}`);
}

takeScreenshot().finally(() => {
  process.exit(0);
});
