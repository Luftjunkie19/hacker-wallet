/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html}"],
  darkMode: "media",
  prefix: "plasmo-",
theme:{
  extend:{
    colors:{
      "primary": "#171717",
      "secondary": "#40FF00",
      "accent": "#292323"
    }
  }
}
}
