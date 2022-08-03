/* Import modules. */
const colors = require('tailwindcss/colors')

module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                cyan: colors.cyan,
                rose: colors.rose,
                sky: colors.sky,
                teal: colors.teal,
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/forms'),
        // require('@tailwindcss/typography'),
    ],
}
