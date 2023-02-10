module.exports = {
    content: [
        './src/renderer/homepage/**/*.{html,js,jsx,tsx,ts}',
        './src/renderer/reusable/**/*.{html,js,jsx,tsx,ts}',
        './src/renderer/calendar/**/*.{html,js,jsx,tsx,ts}',
        './src/renderer/job/**/*.{html,js,jsx,tsx,ts}',
        './src/renderer/kanban/**/*.{html,js,jsx,tsx,ts}',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                sans: ['Open Sans'],
            },
            gridTemplateColumns: {
                '1/5': '1fr 5fr',
            },
        },
    },
    variants: {
        extend: {},
    },
    // plugins: [require('@tailwindcss/forms')],
};
