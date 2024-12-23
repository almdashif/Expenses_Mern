const logger = {
    log: (__DEV__ ? console.log : () => {}),
    warn: (__DEV__ ? console.warn : () => {}),
    error: (__DEV__ ? console.error : () => {}),
  };
  
  export default logger;
  