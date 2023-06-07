import fs from "fs";
import gitconfig from "gitconfiglocal";

const NUMBER_OF_ARGS = 2;

if (
  process.argv.length !== NUMBER_OF_ARGS
) {
  console.log("USAGE: node check-standards.js");
  process.exit(1);
}

const BASE_PATH = "../../";

// This script checks which standards the project meets
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
  repositoryName: "❓ Unchecked",
  configFile: "❓ Unchecked",
  blog: "❓ Unchecked",
  tailwind: "❓ Unchecked",
  astroSEO: "❓ Unchecked",
  accessibility: "❓ Unchecked",
  RWD: "❓ Unchecked",
  robotsTxt: "❓ Unchecked",
  enableDisablePages: "❓ Unchecked"
}
await checkRepositoryName()
await checkConfigFile()
// await checkBlog()
await checkTailwind()
await checkAstroSEO()
// await checkAccessibility()
// await checkRWD()
await checkRobotsTxt()
await checkEnableDisablePages()
logResults()


async function checkRepositoryName() {
  await getGitHubRepoName()
  .then(repoName => {
    if (/smhost-template(-[a-z]+)+/.test(repoName)) {
      standards.repositoryName = "✅ Met"
    } else if (repoName === null) {
      standards.repositoryName = "❌ Unmet (can't find repository name)"
    } else {
      standards.repositoryName = "❌ Unmet (invalid name)"
    }
  })
}

async function getGitHubRepoName() {
  return new Promise((resolve, reject) => {
    gitconfig(BASE_PATH, function(err, config) {
      if (err) {
        reject(err);
        return;
      }

      if (config && config.remote && config.remote.origin) {
        const url = new URL(config.remote.origin.url);
        const pathParts = url.pathname.split('/').filter(part => part.length > 0);

        if (pathParts.length === 2) {
          const owner = pathParts[1].split('.')[0];
          resolve(owner);
          return;
        }
      }

      resolve(null); // GitHub repository not found
    });
  });
}

async function checkConfigFile() {
  const filePath = BASE_PATH+'src/config.ts';
  const searchString = 'export const BASE';

  try {
    const data = await new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            reject(new Error('File does not exist'));
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
      standards.configFile = "✅ Met";
    } else {
      standards.configFile = "❌ Unmet (file does not contain 'export const BASE')";
    }
  } catch (err) {
    if (err.message === 'File does not exist') {
      standards.configFile = "❌ Unmet (config file does not exist)";
    } else {
      standards.configFile = "❌ Unmet (error reading config file)";
    }
  }
}

async function checkTailwind () {
  const directory = BASE_PATH;
  const fileNamePrefix = 'tailwind.config';

  await new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      const matchingFiles = files.filter(file => file.startsWith(fileNamePrefix));
      resolve(matchingFiles.length > 0);
    });
  }).then(result=>{
    if (result) {
      standards.tailwind = "✅ Met";
    } else {
      standards.tailwind = "❌ Unmet (file does not exist)";
    }
  });
}

async function checkAstroSEO () {
  const filePath = BASE_PATH+'src/layouts/Layout.astro';

  await new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(false); // File does not exist
        } else {
          reject(err); // Other error
        }
        return;
      }

      resolve(true); // File exists
    });
  }).then(result=>{
    if (result) {
      standards.astroSEO = "✅ Met";
    } else {
      standards.astroSEO = "❌ Unmet (file does not exist)";
    }
  });
}

async function checkRobotsTxt () {
  const filePath = BASE_PATH+'public/robots.txt';

  await new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(false); // File does not exist
        } else {
          reject(err); // Other error
        }
        return;
      }

      resolve(true); // File exists
    });
  }).then(result=>{
    if (result) {
      standards.robotsTxt = "✅ Met";
    } else {
      standards.robotsTxt = "❌ Unmet (file does not exist)";
    }
  });
}

async function checkEnableDisablePages() {
  const filePath = BASE_PATH+'package.json';
  const searchString = '"enable":';

  try {
    const data = await new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            reject(new Error('File does not exist'));
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
      standards.enableDisablePages = "❌ Unmet (file does not contain '\"enable\":')";
    }
  } catch (err) {
    if (err.message === 'File does not exist') {
      standards.enableDisablePages = "❌ Unmet (package file does not exist)";
    } else {
      standards.enableDisablePages = "❌ Unmet (error reading package file)";
    }
  }
}

function logResults() {
  console.log(`Local SpringMicro Host Template Standards Test Results:
${Object.keys(standards).map(key=>(
    camelCaseToTitleCase(key) + " - " + standards[key]
  )).join(`
`)}`)
}

function camelCaseToTitleCase(str) {
  // Replace all capital letters preceded by a lowercase letter with a space and the capital letter
  const titleCaseStr = str.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  // Capitalize the first character of each word
  const words = titleCaseStr.split(' ');
  const capitalizedWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  
  // Join the words back together
  return capitalizedWords.join(' ');
}