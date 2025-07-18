import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/Auth';
import Spinner from '../Spinner';
import { Outlet } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = () => {
    const [ok, setOk] = useState(false);
    const [auth, setAuth] = useAuth();

    useEffect(() => {
        const authCheck = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user-auth-protected`);
                if (res.data.ok) {
                    setOk(true);
                } else {
                    setOk(false);
                }
            } catch (error) {
                setOk(false);
            }
        };

        if (auth?.token) {
            authCheck();
        }
    }, [auth?.token]);

    return ok ? <Outlet /> : <Spinner />;
};

export default PrivateRoute;
