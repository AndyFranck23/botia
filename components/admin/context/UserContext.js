// contexts/UserContext.js
'use client'; // Nécessaire pour que ce context soit utilisable côté client

import { createContext, useContext } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children, user }) {
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser doit être utilisé dans un UserProvider');
    }
    return context;
}
