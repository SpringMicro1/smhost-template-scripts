# SpringMicroHost Template Scripts

## Available Scripts

```bash
# Enable a page in a SpringMicro astro project.
npm run enable <page>
# Disable a page in a SpringMicro astro project.
npm run disable <page>
# Prep: on first deploy, disable pages behind a paywall (default "blog" and "contact").
npm run prep
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
