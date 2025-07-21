/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0d1117', // Fondo principal (muy oscuro)
        panel: '#161b22', // Cards, paneles (más claro que el fondo)
        sidebar: '#181c23', // Sidebar y navbar (ligeramente diferente a paneles)
        border: '#23272f', // Bordes y separadores
        hover: '#22262e', // Hover para paneles/cards
        text: '#f3f4f6', // Texto principal
        'text-secondary': '#a1a1aa', // Texto secundario
        primary: '#3b82f6', // Azul
        success: '#10b981', // Verde
        warning: '#facc15', // Amarillo
        error: '#ef4444', // Rojo
        accent: '#8b5cf6', // Morado
      },
    },
  },
  plugins: [],
};
