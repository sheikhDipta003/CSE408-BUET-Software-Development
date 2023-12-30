import { createContext, useState, useEffect } from 'react';
import useAxiosFetch from '../hooks/useAxiosFetch';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/products');

    useEffect(() => {
        setProducts(data);
    }, [data]);

    return (
        <DataContext.Provider value={{
            products, setProducts, fetchError, isLoading
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext;