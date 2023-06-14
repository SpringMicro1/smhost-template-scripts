// This script checks which standards the project meets
// It must be run from a node_modules directory, within the project that is being tested
// The url parameter is only used to check the name of the repository - this script does not visit the url

import fs from "fs";
import gitconfig from "gitconfiglocal";
import { chromium } from  "playwright";
import { exec } from "child_process";

const NUMBER_OF_ARGS = 3;

if (process.argv.length !== NUMBER_OF_ARGS) {
  console.log("USAGE: node check-standards.js https://link-to-repo");
  process.exit(1);
}

const gitrepo = process.argv[NUMBER_OF_ARGS - 1];

const BASE_PATH = "../../";

// The standards are those defined at https://employees.springmicrohost.com/docs/springmicrohost/templates
// Name repos smhost-template-*
// src/config.ts - see format defined below
// Blog (markdown) - disabled until blog feature is built
// Tailwind Config
// Astro SEO in src/layouts/Layout.astro
// Accessibility: tab navigation tab-index, https://www.w3.org/WAI/standards-guidelines/aria/
// RWD
// robots.txt
// npm run enable and npm run disable and disabled.json for turing pages on/off.
let standards = {
  repositoryName: "➖ Unchecked",
  configFile: "➖ Unchecked",
  blog: "➖ Unchecked",
  tailwind: "➖ Unchecked",
  astroSEO: "➖ Unchecked",
  accessibility: "➖ Unchecked",
  RWD: "➖ Unchecked",
  robotsTxt: "➖ Unchecked",
  enableDisablePages: "➖ Unchecked",
  contactForm: "➖ Unchecked",
};
await checkRepositoryName();
await checkConfigFile();
// await checkBlog()
await checkTailwind();
await checkAstroSEO();
// await checkAccessibility()
// await checkRWD()
await checkRobotsTxt();
await checkEnableDisablePages();
await checkContactForm();
logResults();

async function checkRepositoryName() {
  await getGitHubRepoName().then((repoName) => {
    if (/smhost-template(-[a-z]+)+/.test(repoName)) {
      standards.repositoryName = "✅ Met";
    } else if (repoName === null) {
      standards.repositoryName = "❌ Unmet (can't find repository name)";
    } else {
      standards.repositoryName = "❌ Unmet (invalid name)";
    }
  });
}

async function getGitHubRepoName() {
  return new Promise((resolve, reject) => {
    gitconfig(BASE_PATH, function (err, config) {
      if (err) {
        reject(err);
        return;
      }

      if (config && config.remote && config.remote.origin) {
        const url = new URL(gitrepo);
        const pathParts = url.pathname
          .split("/")
          .filter((part) => part.length > 0);

        if (pathParts.length === 2) {
          const owner = pathParts[1].split(".")[0];
          resolve(owner);
          return;
        }
      }

      resolve(null); // GitHub repository not found
    });
  });
}

async function checkConfigFile() {
  const filePath = BASE_PATH + "src/config.ts";
  const searchString =
    /^const config\s*=\s*{\s|export const [A-Z_]+\s*=\s*config\.[A-Z_]*;/g;

  try {
    const data = await new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          if (err.code === "ENOENT") {
            reject(new Error("File does not exist"));
          } else {
            reject(err); // Other read error
          }
          return;
        }

        resolve(data);
      });
    });

    const fileContainsString = searchString.test(data);
    if (fileContainsString) {
      standards.configFile = "✅ Met";
    } else {
      standards.configFile =
        "❌ Unmet (config file does not meet valid format, see https://employees.springmicrohost.com/docs/springmicrohost/templates)";
    }
  } catch (err) {
    if (err.message === "File does not exist") {
      standards.configFile = "❌ Unmet (config file does not exist)";
    } else {
      standards.configFile = "❌ Unmet (error reading config file)";
    }
  }
}

async function checkTailwind() {
  const directory = BASE_PATH;
  const fileNamePrefix = "tailwind.config";

  await new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      const matchingFiles = files.filter((file) =>
        file.startsWith(fileNamePrefix)
      );
      resolve(matchingFiles.length > 0);
    });
  }).then((result) => {
    if (result) {
      standards.tailwind = "✅ Met";
    } else {
      standards.tailwind = "❌ Unmet (file does not exist)";
    }
  });
}

async function checkAstroSEO() {
  const filePath = BASE_PATH + "src/layouts/Layout.astro";

  await new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          resolve(false); // File does not exist
        } else {
          reject(err); // Other error
        }
        return;
      }

      resolve(true); // File exists
    });
  }).then((result) => {
    if (result) {
      standards.astroSEO = "✅ Met";
    } else {
      standards.astroSEO = "❌ Unmet (file does not exist)";
    }
  });
}

async function checkRobotsTxt() {
  const filePath = BASE_PATH + "public/robots.txt";

  await new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          resolve(false); // File does not exist
        } else {
          reject(err); // Other error
        }
        return;
      }

      resolve(true); // File exists
    });
  }).then((result) => {
    if (result) {
      standards.robotsTxt = "✅ Met";
    } else {
      standards.robotsTxt = "❌ Unmet (file does not exist)";
    }
  });
}

async function checkEnableDisablePages() {
  const filePath = BASE_PATH + "package.json";
  const searchString = '"enable":';

  try {
    const data = await new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          if (err.code === "ENOENT") {
            reject(new Error("File does not exist"));
          } else {
            reject(err); // Other read error
          }
          return;
        }

        resolve(data);
      });
    });

    const fileContainsString = data.includes(searchString);
    if (fileContainsString) {
      standards.enableDisablePages = "✅ Met";
    } else {
      standards.enableDisablePages =
        "❌ Unmet (file does not contain '\"enable\":')";
    }
  } catch (err) {
    if (err.message === "File does not exist") {
      standards.enableDisablePages = "❌ Unmet (package file does not exist)";
    } else {
      standards.enableDisablePages = "❌ Unmet (error reading package file)";
    }
  }
}

async function checkContactForm () {
  // Run the test
  await runPlaywrightTest()
    .then(result => {
      standards.contactForm = result;
    })
    .catch(err => {
      console.error(err);
      standards.contactForm = "❌ Unmet (error when launching application)";
    });
}

async function runPlaywrightTest() {
  // Start Astro project (assuming the command is "npm start" or "npm run dev")
  const astroProcess = exec('npm start', { cwd: BASE_PATH });

  // Wait for the Astro project to start (adjust the delay if needed)
  console.log("waiting for page load...")
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Launch Playwright browser
  // console.log(`await chromium.launch();`)
  const browser = await chromium.launch();
  // console.log(`await browser.newContext();`)
  const context = await browser.newContext();

  // Set the environment variables for the page
  // console.log(`await context.newPage();`)
  const page = await context.newPage();
  // Expose a custom function to the browser context
  // console.log(`await context.exposeFunction('setEnvVariables', async (envVariables) => {`)
  await context.exposeFunction('setEnvVariables', async (envVariables) => {
    Object.entries(envVariables).forEach(([key, value]) => {
      process.env[key] = value;
    });
  });
  
  try {
    // Navigate to the contact page
    // console.log(`await page.goto('http://localhost:3000/contact', { timeout: 5000 });`)
    console.log("navigating to contact page...")
    await page.goto('http://localhost:3000/contact', { timeout: 5000 });
  
  } catch (e) {
    return "❌ Unmet (error when navigating to contact page)";
  }
  // const innerHTML = await page.evaluate(() => {
  //   return document.body.innerHTML;
  // });
  // // Print the innerHTML
  // console.log(innerHTML);

  // Validate the contact form
  try {
    // console.log(`await page.waitForSelector('form[name="contact"]', { timeout: 5000 });`)
    await page.waitForSelector('form[name="contact"]', { timeout: 5000 });
  } catch (e) {
    result = "❌ Unmet (contact form not found. It needs name=\"contact\")";
  }
  let result
  // Fill in form fields
  try {
    // console.log(`await page.fill('form[name="contact"] input[name="name"]', 'John Doe', { timeout: 5000 });`)
    await page.fill('form[name="contact"] input[name="name"]', 'John Doe', { timeout: 5000 });
    // console.log(`await page.fill('form[name="contact"] input[name="email"]', 'john@example.com', { timeout: 5000 });`)
    await page.fill('form[name="contact"] input[name="email"]', 'john@example.com', { timeout: 5000 });
    // console.log(`await page.fill('form[name="contact"] input[name="message"]', 'Hello, Astro!', { timeout: 5000 });`)
    await page.fill('form[name="contact"] input[name="message"]', 'Hello, Astro!', { timeout: 5000 });
  } catch (e) {
    return "❌ Unmet (one of the form inputs (name, email, message) is missing)";
  }

  try {
    // // listen for the dialog which will appear after submitting the form
    // page.Dialog += (_, dialog) => {
    //   console.log("Dialog message:", dialog.Message)
    //   // dialog.AcceptAsync();
    // }

    // // Submit the form
    // await new Promise(resolve => setTimeout(resolve, 5000));
    // console.log(`await page.click('form[name="contact"] button', { timeout: 5000 });`)
    // await page.click('button.rounded.text-center.transition.ring-offset-2.ring-gray-200.w-full.px-6.py-3.bg-black.text-white.border-2.border-transparent')
    // await new Promise(resolve => setTimeout(resolve, 5000));
    // await page.click('span.font-bold.text-slate-800');
    // await page.getByText('SpringMicroHost').click({ force: true });
    // await new Promise(resolve => setTimeout(resolve, 5000));
    // const title = await page.title()
    // console.log(title)
    
    // await page.getByText('Send Message').dispatchEvent('click');
    // await new Promise(resolve => setTimeout(resolve, 5000));
    // await page.getByText('New Box').click();


    // // Create a promise to capture the dialog message
    // let dialogMessagePromise = new Promise((resolve) => {
    //   page.once('dialog', async (dialog) => {
    //     console.log(`await dialog.accept();`)
    //     await dialog.accept();
    //     resolve(dialog.message());
    //   });
    // });

    // // Wait for the dialog message and print it
    // console.log(`await dialogMessagePromise;`)
    // const dialogMessage = await dialogMessagePromise;
    // console.log(dialogMessage);
  } catch (e) {
    return "❌ Unmet (error on submitting the form)";
  }

  result = "✅ Met";

  // Take a screenshot (optional)
  // await page.screenshot({ path: 'screenshot.png' });

  // Close the browser
  // console.log(`await browser.close();`)
  await browser.close();

  // Stop the Astro project
  astroProcess.kill();

  return result;
}

function logResults() {
  console.log(`Local SpringMicro Host Template Standards Test Results:
${Object.keys(standards).map(
  (key) => camelCaseToTitleCase(key) + ": " + standards[key]
).join(`
`)}`);
}

function camelCaseToTitleCase(str) {
  // Replace all capital letters preceded by a lowercase letter with a space and the capital letter
  const titleCaseStr = str.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Capitalize the first character of each word
  const words = titleCaseStr.split(" ");
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the words back together
  return capitalizedWords.join(" ");
}
