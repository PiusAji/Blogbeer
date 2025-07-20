// postcss.config.js
const config = {
  plugins: {
    tailwindcss: {}, // This tells PostCSS to use the built-in Tailwind CSS v3 plugin
    autoprefixer: {}, // It's good practice to include Autoprefixer as well
  },
};
export default config;
