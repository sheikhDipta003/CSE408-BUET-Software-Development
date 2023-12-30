import { createContext, useState, useEffect } from 'react';
import useAxiosFetch from '../hooks/useAxiosFetch';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const [users, setUsers] = useState([]);

    const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/users');

    useEffect(() => {
        setUsers(data);
    }, [data])

    return (
        <DataContext.Provider value={{
            users, setUsers, fetchError, isLoading
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext;