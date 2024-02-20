import { createContext, useState } from "react";


export const Context = createContext(null);

const ContextProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("access_token") ? true : false);
    const [error, setError] = useState();

    return (
        <Context.Provider value={{isLoading, setIsLoading, isAuthenticated, setIsAuthenticated, error, setError}}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider