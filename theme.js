const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');

const savedTheme = localStorage.getItem('siteTheme');
document.documentElement.dataset.theme = savedTheme === 'light' ? 'light' : 'dark';

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;

    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '⏾' : '✸';
    }

    if (themeToggle) {
        themeToggle.setAttribute(
            'aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
        );
    }

    localStorage.setItem('siteTheme', theme);
}

setTheme(savedTheme === 'light' ? 'light' : 'dark');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.dataset.theme;
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

        setTheme(nextTheme);
    });
}
