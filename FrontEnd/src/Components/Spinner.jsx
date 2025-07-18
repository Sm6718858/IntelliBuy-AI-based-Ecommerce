import React, { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Spinner = ({path='login'}) => {
    const [count,setCount] = useState(2)
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(()=>{
        const interval = setInterval(()=>{
            setCount((prevValue) => --prevValue);
        },1000);
        count === 0 && navigate(`/${path}`,{
            state: location.pathname,
        });
        return () => clearInterval(interval);
    },[count,navigate,location,path]);

    return (
        <>
            <div className="d-flex flex-col justify-content-center align-items-center vh-100">
                <h1>Redirecting to you in {count} second</h1>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>

        </>
    );
}

export default Spinner;
