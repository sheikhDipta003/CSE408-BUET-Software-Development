import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheckSquare, faSquare, faInfoCircle, faEdit } from '@fortawesome/free-solid-svg-icons';

const UserViewPriceDrop = () => {
    const [priceDrops, setPriceDrops] = useState([]);
    const { userId } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get(`/users/${userId}/alerts/pricedrop`);
                console.log("from UserViewPriceDrop = ", response.data);
                isMounted && setPriceDrops(response.data);
            } catch (err) {
                console.error(err);
            } 
        };

        getUsers();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleDelete = async (pwId, productId, websiteId) => {
        try {
            const response = await axiosPrivate.delete(`/users/${userId}/alerts/pricedrop/delete/${productId}/${websiteId}`);
            setPriceDrops(prevPriceDrops => prevPriceDrops.filter(pd => pd.pwId !== pwId));
        } catch (err) {
            console.error('Error deleting user:', err);
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleDeleteSelected = async () => {
        const selectedPD = priceDrops.filter(pd => pd.isSelected);
        try {
            await Promise.all(selectedPD.map(pd => handleDelete(pd.pwId, pd.productId, pd.websiteId)));
            alert("Price Drop Alert removed successfully for selected products");
        } catch (err) {
            console.error('Error deleting selected Price Drops:', err);
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleCheckboxChange = (pwId) => {
        const updatePD = priceDrops.map(pd => {
            if (pd.pwId === pwId) {
                return { ...pd, isSelected: !pd.isSelected };
            }
            return pd;
        });
        setPriceDrops(updatePD);
    };

    const toggleSelectAll = () => {
        const updatePD = priceDrops.map(pd => ({ ...pd, isSelected: !selectAll }));
        setPriceDrops(updatePD);
        setSelectAll(!selectAll);
    };

    const filteredPD = priceDrops.filter(pd =>
      pd.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pd.websiteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(pd.dateAdded).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInfoClick = (productId, websiteId) => {
        navigate(`/products/${productId}/${websiteId}`);
    };

    const handleEditClick = async (productId, websiteId) => {
        const newPriceInput = prompt("Enter the new price:");
    
        if (newPriceInput !== null) {
            // Convert the new price to a number
            const newPriceValue = parseFloat(newPriceInput);
    
            if (!isNaN(newPriceValue)) {
                try {
                    // Send a PUT request to update the price drop
                    const response = await axiosPrivate.put(`/users/${userId}/alerts/pricedrop/update`, {
                        productId: productId,
                        websiteId: websiteId,
                        newPrice: newPriceValue
                    });
    
                    // Update the state to reflect the new price
                    const updatedPriceDrops = priceDrops.map(pd => {
                        if (pd.productId === productId && pd.websiteId === websiteId) {
                            return { ...pd, priceDrop: newPriceValue };
                        }
                        return pd;
                    });
    
                    setPriceDrops(updatedPriceDrops);
                    alert(response.data.message);
                } catch (err) {
                    console.error('Error updating price drop:', err);
                    alert(err.response.data.message);
                }
            } else {
                alert("Invalid input! Please enter a valid number for the new price.");
            }
        }
    };
    

    return (
        <div className="px-4 py-4 mx-4 my-4">
            <input
              type="text"
              placeholder="Search by product name, website name or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-3/4 p-4 mb-4 border border-gray-300 rounded"
            />
            
            <div className="flex justify-between items-center mb-4">
                <div>
                    <button onClick={toggleSelectAll} className="text-blue-700 hover:text-blue-800 mr-4 bg-teal-100" disabled={priceDrops.length === 0}>
                        {selectAll ? (
                            <FontAwesomeIcon icon={faCheckSquare} />
                        ) : (
                            <FontAwesomeIcon icon={faSquare} />
                        )}
                        <span className="ml-2">Select All</span>
                    </button>
                    <button onClick={handleDeleteSelected} className="text-red-700 hover:text-red-800 bg-teal-100" disabled={priceDrops.filter(user => user.isSelected).length === 0}>
                        <FontAwesomeIcon icon={faTrash} />
                        <span className="ml-2">Delete</span>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="border border-gray-200 px-4 py-2"></th>
                            <th className="border border-gray-200 px-4 py-2">productName</th>
                            <th className="border border-gray-200 px-4 py-2">websiteName</th>
                            <th className="border border-gray-200 px-4 py-2">dateAdded</th>
                            <th className="border border-gray-200 px-4 py-2">Current Price</th>
                            <th className="border border-gray-200 px-4 py-2">Price Drop</th>
                            <th className="border border-gray-200 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPD.length === 0 ? (
                            <tr className='px-4 text-red-500 font-bold'>
                            <td colSpan="6">No price-drops to display</td>
                            </tr>
                        ) : (
                            filteredPD.map((pd) => (
                            <tr key={pd.pwId}>
                                <td className="border border-gray-200 px-4 py-2">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-blue-500"
                                    checked={pd.isSelected || false}
                                    onChange={() => handleCheckboxChange(pd.pwId)}
                                />
                                </td>
                                <td className="border border-gray-200 px-4 py-2 relative">{pd.productName}</td>
                                <td className="border border-gray-200 px-4 py-2 relative">{pd.websiteName}</td>
                                <td className="border border-gray-200 px-4 py-2">{new Date(pd.dateAdded).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                                <td className="border border-gray-200 px-4 py-2">{pd.currentPrice}</td>
                                <td className="border border-gray-200 px-4 py-2">{parseInt(pd.priceDrop)}</td>
                                <td>
                                    <span className="flex space-x-2">
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
                                            onClick={() => handleEditClick(pd.productId, pd.websiteId)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-200"
                                            onClick={() => handleInfoClick(pd.productId, pd.websiteId)}
                                        >
                                            <FontAwesomeIcon icon={faInfoCircle} />
                                        </button>
                                    </span>
                                </td>
                            </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserViewPriceDrop;
