# technical documentation

```javascript
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A practical JavaScript/TypeScript project setup using Vite, Vitest, ESLint, and Prettier",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "vite",                      // Starts the Vite development server
    "build": "vite build",              // Builds the production version
    "preview": "vite preview",          // Previews the production build
    "test": "vitest",                   // Runs Vitest in watch mode
    "test:coverage": "vitest run --coverage", // Runs tests and generates a coverage report
    "lint": "eslint --fix .",           // Lints and fixes code using ESLint
    "format": "prettier --write .",     // Formats code using Prettier
    "type-check": "tsc --noEmit"        // Checks types using TypeScript
  },
  "dependencies": {
    "vue": "^3.2.0"                     // Example dependency: Vue.js, adjust based on your framework
  },
  "devDependencies": {
    "vite": "^4.0.0",                   // Vite for bundling and development server
    "vitest": "^0.30.0",                // Vitest for unit testing
    "@vitejs/plugin-vue": "^4.0.0",     // Vite plugin for Vue (if you're using Vue.js)
    "eslint": "^8.0.0",                 // ESLint for linting
    "eslint-plugin-vue": "^9.0.0",      // ESLint plugin for Vue (if you're using Vue.js)
    "typescript": "^5.0.0",             // TypeScript (if you're using TypeScript)
    "prettier": "^3.0.0",               // Prettier for code formatting
    "eslint-config-prettier": "^9.0.0", // Disables ESLint rules that conflict with Prettier
    "jsdom": "^21.0.0"                  // jsdom for DOM testing in Vitest
  },
  "eslintConfig": {
    "env": {
      "browser": true,                  // Allows browser global variables like `window` and `document`
      "es2021": true                    // Enables ES2021 syntax
    },
    "extends": [
      "eslint:recommended",             // ESLint recommended rules
      "plugin:vue/vue3-recommended",    // ESLint Vue plugin (if using Vue.js)
      "plugin:@typescript-eslint/recommended", // TypeScript recommended rules (if using TypeScript)
      "prettier"                        // Prettier config to disable conflicting rules
    ],
    "parserOptions": {
      "ecmaVersion": 12,                // Allows ECMAScript 2021 syntax
      "sourceType": "module"            // Allows the use of imports
    },
    "rules": {
      "no-console": "warn",             // Warn when using console.log
      "no-unused-vars": "warn"          // Warn on unused variables
    }
  },
  "prettier": {
    "semi": true,                       // Use semicolons
    "singleQuote": true,                // Use single quotes
    "trailingComma": "none"             // No trailing commas
  },
  "engines": {
    "node": ">=16.0.0"                  // Specify the required Node.js version
  }
}

In Vs Code setting
"json.schemaDownload.enable": false

```

install the jsdom
`npm install --save-dev jsdom`

Build Services: `docker-compose build`
Start the services: `docker-compose up`
Stop Services: `docker-compose down`
Check the logs: `docker-compose logs`

or compiled

```shell
sudo docker-compose down
sudo docker-compose build
sudo docker-compose up -d
```

check the files:
`sudo docker ps`

`sudo docker exec groupie-tracker-backend-services-1 ls -la /root/.env`
