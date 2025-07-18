import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

const Search = ({ children }) => {
    const [auth, setAuth] = useState({
        keyword:"",
        results:[],
    });

    return (
        <SearchContext.Provider value={[auth, setAuth]}>
            {children}
        </SearchContext.Provider>
    );
};

const useSearch = () => useContext(SearchContext);

export { Search, useSearch };
