import { createContext, useContext, useState } from "react";
import Toast from "../stylenotificacao/toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });

        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const success = (msg) => showToast(msg, "success");
    const error = (msg) => showToast(msg, "error");
    const info = (msg) => showToast(msg, "info");

    return (
        <ToastContext.Provider value={{ success, error, info }}>
            {children}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);