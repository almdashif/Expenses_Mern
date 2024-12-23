import React, { createContext, useRef, useContext } from 'react';
import Toast from '../Components/Toast';


const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const toastRef = useRef();

    const showToast = (options) => {
        toastRef.current?.show(options);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast ref={toastRef} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    return useContext(ToastContext);
};
