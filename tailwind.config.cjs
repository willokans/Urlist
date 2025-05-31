/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/auth-astro/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundColor: {
        DEFAULT: '#ffffff'
      },
      textColor: {
        DEFAULT: '#020817'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
