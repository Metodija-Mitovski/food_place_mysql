import React, { useState, useEffect, useContext } from 'react';
import config from '../../config/config';
import axios from 'axios';

const AuthenticationContext = React.createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);
    const [loggedIn, setLoggedIn] = useState(false);
    const [pending, setPending] = useState(true);

    const getUser = () => {
        axios
            .get(`${config.api.auth}`)
            .then((res) => {
                setUser(res.data);
                setLoggedIn(true);
                setPending(false);
            })
            .catch((err) => {
                setPending(false);
            });
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <AuthenticationContext.Provider value={{ loggedIn, pending, user, setLoggedIn, setUser, getUser }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

export const useAuthContext = () => {
    return useContext(AuthenticationContext);
};
