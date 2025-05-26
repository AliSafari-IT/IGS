// src/utils/logger.ts
const devMode = process.env.NODE_ENV !== 'production';
export const logger = {
  log: (...args: any[]) => {
    if (devMode) {
      console.log(...args);
    }
  },
  info: (...args: any[]) => {
    if (devMode) {
      console.info(...args);
    }
  },
  warn: (...args: any[]) => {
    if (devMode) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    console.error(...args);
  },
  debug: (...args: any[]) => {
    if (devMode) {
      console.debug(...args);
    }
  }
};

