const path = require('path');
module.exports = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  "typescript": {
    "reactDocgen": false, // Disable docgen processing
  },
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      images: path.resolve(__dirname, "../src/images"), // Add your alias
      app: path.resolve(__dirname, "../src"), // Add your alias
      "images": path.resolve(__dirname, "../src/images"), // Add your alias
      "design-library": path.resolve(__dirname, "../src/components/design-library"), // Add your alias
      "@material-ui/core": "@mui/material", // map MUI v4 import to MUI v5 if present
    };
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      "stream": false 
    }
    return config;
  },
}