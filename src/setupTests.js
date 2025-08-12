// Deshabilitar logs de React DevTools
const originalConsoleLog = console.log;
console.log = (...args) => {
  // Filtrar mensajes de React DevTools
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Download the React DevTools')) {
    return;
  }
  originalConsoleLog.apply(console, args);
};

// Deshabilitar logs de desarrollo de React
if (process.env.NODE_ENV === 'development') {
  console.log = (...args) => {
    // Filtrar mensajes específicos de desarrollo
    if (args[0] && typeof args[0] === 'string') {
      if (args[0].includes('Download the React DevTools')) return;
      if (args[0].includes('React DevTools')) return;
    }
    originalConsoleLog.apply(console, args);
  };
}
