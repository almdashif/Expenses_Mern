export const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        if (timer) {
            clearTimeout(timer); 
        }
        timer = setTimeout(() => {
            func(...args); 
        }, delay);
    };
};
