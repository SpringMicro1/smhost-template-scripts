# SpringMicroHost Template Scripts

## Available Scripts

```bash
# Enable a page in a SpringMicro astro project.
npm run enable <page>
# Disable a page in a SpringMicro astro project.
npm run disable <page>
# Prep: on first deploy, disable pages behind a paywall (args is an array of pages to disable, example: "npm run prep blog contact" disables blog and contact pages).
npm run prep <args>
# Build in production: take a screenshot for opengraph and put it in the project's public directory. Uses pm2.
npm run build
# Build locally: take a screenshot for opengraph and put it in the project's dist directory. Uses pm2.
npm run buildlocal
# Stop any dangling pm2 process.
npm run stop
```

## Usage

```bash
npm install --save-dev smhost-template-scripts
```

In your `package.json`, you can use scripts like so:

```json
{
  "scripts": {
    "enable": "npm run enable --prefix node_modules/smhost-template-scripts"
  }
}
```

```bash
# from your project directory
npm run enable blog
```

## Template Code Validation

- Name repos smhost-template-\*
- `src/config.ts` - see format defined below
- Blog (markdown) - disabled until blog feature is built
- Tailwind Config
- Astro SEO in src/layouts/Layout.astro
- Accessibility: tab navigation tab-index, https://www.w3.org/WAI/standards-guidelines/aria/
- RWD
- robots.txt
- npm run enable and npm run disable and disabled.json for turing pages on/off.
