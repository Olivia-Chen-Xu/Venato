module.exports = {
    content: [
        './src/frontend/homepage/**/*.{html,js,jsx,tsx,ts}',
        './src/frontend/reusable/**/*.{html,js,jsx,tsx,ts}',
        './src/frontend/calendar/**/*.{html,js,jsx,tsx,ts}',
        './src/frontend/job/**/*.{html,js,jsx,tsx,ts}',
        './src/frontend/kanban/**/*.{html,js,jsx,tsx,ts}',
        './src/frontend/auth/**/*.{html,js,jsx,tsx,ts}',
        './src/frontend/landing/**/*.{html,js,jsx,tsx,ts}'
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
