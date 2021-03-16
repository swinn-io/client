import React, {createContext} from "react"

const AuthStore = ({children, user}) => {
    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    )
}

export const AuthContext = createContext();
export default AuthStore;