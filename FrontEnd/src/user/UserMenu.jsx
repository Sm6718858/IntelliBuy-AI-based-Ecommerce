import React from 'react';
import { NavLink } from 'react-router-dom';

const UserMenu = () => {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">User Panel</h3>
            <ul className="list-group space-y-2">
                <NavLink
                    to='/dashboard/user/profile'
                    style={{ textDecoration: 'none' }}
                    className="block"
                >
                    <li className="list-group-item p-2 rounded hover:bg-blue-100 transition">
                       Update Profile
                    </li>
                </NavLink>

                <NavLink
                    to='/dashboard/user/orders'
                    style={{ textDecoration: 'none' }}
                    className="block"
                >
                    <li className="list-group-item p-2 rounded hover:bg-blue-100 transition">
                        Orders
                    </li>
                </NavLink>
            </ul>
        </div>
    );
};

export default UserMenu;
