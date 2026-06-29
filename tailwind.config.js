/** @type {import('tailwindcss').Config} */
function withAlpha(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}) / ${opacityValue})`
  }
}

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: withAlpha('--color-ink'),
        card: withAlpha('--color-card'),
        'card-border': withAlpha('--color-card-border'),
        plum: withAlpha('--color-plum'),
        earth: withAlpha('--color-earth'),
        paper: withAlpha('--color-paper'),
        'paper-dim': withAlpha('--color-paper-dim'),
        fire: withAlpha('--color-fire'),
        ghost: withAlpha('--color-ghost'),
        shade: withAlpha('--color-shade'),
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', '"Hiragino Sans GB"', 'sans-serif'],
        serif: ['"Noto Serif SC"', '"Songti SC"', '"STSong"', 'serif'],
      },
      borderRadius: {
        btn: '8px 20px 8px 20px',
        input: '8px 16px 8px 16px',
        tag: '4px 12px 4px 12px',
      },
      spacing: {
        18: '4.5rem',
      },
      animation: {
        flame: 'flame-pulse 0.5s ease-in-out infinite alternate',
        fall: 'fall linear infinite',
        float: 'float 20s ease-in-out infinite',
        butterfly: 'butterfly 18s ease-in-out infinite',
        'fade-up': 'fade-up 0.8s ease-out both',
        lantern: 'lantern-float 6s ease-in-out infinite',
      },
      keyframes: {
        'flame-pulse': {
          '0%': { transform: 'scale(1) rotate(-5deg)' },
          '100%': { transform: 'scale(1.2) rotate(5deg)' },
        },
        'glow-slide': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        fall: {
          '0%': { transform: 'translateY(-10vh) translateX(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.8' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(110vh) translateX(30px) rotate(360deg)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.3' },
          '25%': { transform: 'translate(20px, -30px) scale(1.05)', opacity: '0.4' },
          '50%': { transform: 'translate(-10px, -60px) scale(0.95)', opacity: '0.3' },
          '75%': { transform: 'translate(-30px, -30px) scale(1.02)', opacity: '0.35' },
        },
        butterfly: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '20%': { transform: 'translate(30px, -20px) rotate(10deg)' },
          '40%': { transform: 'translate(-20px, -40px) rotate(-15deg)' },
          '60%': { transform: 'translate(40px, -10px) rotate(20deg)' },
          '80%': { transform: 'translate(-30px, -30px) rotate(-10deg)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'lantern-float': {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.15' },
          '50%': { transform: 'translateY(-20px) scale(1.05)', opacity: '0.25' },
        },
      },
    },
  },
  plugins: [],
}
