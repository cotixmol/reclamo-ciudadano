module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}", 
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}", 
    "./src/**/*.{html,js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e4047d',
          hover: '#ff4da6',
        },
      },
    },
  },
  plugins: [],
};
