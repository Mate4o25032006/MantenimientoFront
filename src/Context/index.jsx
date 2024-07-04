// MantenContext.js
import { createContext, useState, useEffect } from 'react';

export const MantenContext = createContext();

export function MantenContextProvider({ children }) {
    const [inputs, setInputs] = useState({});
    const [loader, setLoader] = useState(true);
    const [admin, setAdmin] = useState(false);
    const [tokenSession, setTokenSessionState] = useState(localStorage.getItem('authToken'));

    const setTokenSession = (token) => {
        setTokenSessionState(token);
        localStorage.setItem('authToken', token);
    };

    useEffect(() => {
        setLoader(false);
    }, []);

    return (
        <MantenContext.Provider
            value={{
                inputs,
                setInputs,
                loader,
                setLoader,
                admin,
                setAdmin,
                tokenSession,
                setTokenSession,
            }}
        >
            {children}
        </MantenContext.Provider>
    );
}
