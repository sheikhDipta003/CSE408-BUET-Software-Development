import React from 'react';
import { useState, useEffect } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheckSquare, faSquare, faSort, faSortUp, faSortDown, faArrowRight, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const Wishlist = ({userId}) => {
    const axiosPrivate = useAxiosPrivate();
    const [wishlist, setWishlist] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
      const fetchWishlist = async () => {
        try {
          const response = await axiosPrivate.get(`/users/${userId}/wishlist`);
          console.log(response.data.wishlistItems);
          setWishlist(response.data.wishlistItems);
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      };
  
      fetchWishlist();
    }, []);

    const handleDelete = async (userId, wishlistId) => {
        try {
            await axiosPrivate.get(`users/${userId}/wishlist/${wishlistId}/delete`);
            setWishlist(prevWishlist => prevWishlist.filter(wishlist => wishlist.wishlistId !== wishlistId));
        } catch (error) {
            console.error('Error deleting wishlist:', error);
        }
    };

    const handleDeleteSelected = async () => {
        const selectedWishlist = wishlist.filter(wishlist => wishlist.isSelected);
        try {
            await Promise.all(selectedWishlist.map(wishlist => handleDelete(userId, wishlist.wishlistId)));
        } catch (error) {
            console.error('Error deleting selected Wishlist:', error);
        }
    };

    const handleCheckboxChange = (wishlistId) => {
        const updatedWishlist = wishlist.map(wishlist => {
            if (wishlist.wishlistId === wishlistId) {
                return { ...wishlist, isSelected: !wishlist.isSelected };
            }
            return wishlist;
        });
        setWishlist(updatedWishlist);
    };

    const handleSort = (field) => {
      if (field === sortBy) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(field);
        setSortOrder('asc');
      }
    };

    const sortedWishlist = wishlist.sort((a, b) => {
      if (sortBy) {
          const valueA = a[sortBy];
          const valueB = b[sortBy];

          if (sortBy.toLowerCase() === 'price') return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
          if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
          if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    const toggleSelectAll = () => {
        const updatedWishlist = wishlist.map(wishlist => ({ ...wishlist, isSelected: !selectAll }));
        setWishlist(updatedWishlist);
        setSelectAll(!selectAll);
    };

    const filteredWishlist = sortedWishlist.filter(w =>
      w.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.websiteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(w.dateAdded).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <div>
            <input
              type="text"
              placeholder="Search by product name, website name or date"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-3/4 p-4 mb-4 border border-gray-300 rounded"
            />
            
            <div className="flex justify-between items-center mb-4">
                <div>
                    <button onClick={toggleSelectAll} className="text-blue-700 hover:text-blue-800 mr-4 bg-teal-100" disabled={wishlist.length === 0}>
                        {selectAll ? (
                            <FontAwesomeIcon icon={faCheckSquare} />
                        ) : (
                            <FontAwesomeIcon icon={faSquare} />
                        )}
                        <span className="ml-2">Select All</span>
                    </button>
                    <button onClick={handleDeleteSelected} className="text-red-700 hover:text-red-800 bg-teal-100" disabled={wishlist.filter(wishlist => wishlist.isSelected).length === 0}>
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
                            <th onClick={() => handleSort('productName')} className="border border-gray-200 px-4 py-2 cursor-pointer">
                                Product Name
                                {sortBy === 'productName' && sortOrder === 'asc' && <FontAwesomeIcon icon={faSortUp} className="ml-2 text-black" />}
                                {sortBy === 'productName' && sortOrder === 'desc' && <FontAwesomeIcon icon={faSortDown} className="ml-2 text-black" />}
                                {sortBy !== 'productName' && <FontAwesomeIcon icon={faSort} className="ml-2 text-black" />}
                            </th>
                            <th onClick={() => handleSort('websiteName')} className="border border-gray-200 px-4 py-2 cursor-pointer">
                                Website Name
                                {sortBy === 'websiteName' && sortOrder === 'asc' && <FontAwesomeIcon icon={faSortUp} className="ml-2 text-black" />}
                                {sortBy === 'websiteName' && sortOrder === 'desc' && <FontAwesomeIcon icon={faSortDown} className="ml-2 text-black" />}
                                {sortBy !== 'websiteName' && <FontAwesomeIcon icon={faSort} className="ml-2 text-black" />}
                            </th>
                            <th onClick={() => handleSort('price')} className="border border-gray-200 px-4 py-2 cursor-pointer">
                                Current Price
                                {sortBy === 'price' && sortOrder === 'asc' && <FontAwesomeIcon icon={faSortUp} className="ml-2 text-black" />}
                                {sortBy === 'price' && sortOrder === 'desc' && <FontAwesomeIcon icon={faSortDown} className="ml-2 text-black" />}
                                {sortBy !== 'price' && <FontAwesomeIcon icon={faSort} className="ml-2 text-black" />}
                            </th>
                            <th onClick={() => handleSort('dateAdded')} className="border border-gray-200 px-4 py-2 cursor-pointer">
                                Date Added
                                {sortBy === 'dateAdded' && sortOrder === 'asc' && <FontAwesomeIcon icon={faSortUp} className="ml-2 text-black" />}
                                {sortBy === 'dateAdded' && sortOrder === 'desc' && <FontAwesomeIcon icon={faSortDown} className="ml-2 text-black" />}
                                {sortBy !== 'dateAdded' && <FontAwesomeIcon icon={faSort} className="ml-2 text-black" />}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWishlist.length === 0
                        ? <tr className='px-4 text-red-500 font-bold'><td>No wishlist to display</td></tr>
                        : filteredWishlist.map((wishlist) => (
                            <tr key={wishlist.wishlistId}>
                                <td className="border border-gray-200 px-4 py-2">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-blue-500"
                                        checked={wishlist.isSelected || false}
                                        onChange={() => handleCheckboxChange(wishlist.wishlistId)}
                                    />
                                </td>
                                <td className="border border-gray-200 px-4 py-2">{wishlist.productName}</td>
                                <td className="border border-gray-200 px-4 py-2">{wishlist.websiteName}</td>
                                <td className="border border-gray-200 px-4 py-2">{wishlist.price}</td>
                                <td className="border border-gray-200 px-4 py-2">{new Date(wishlist.dateAdded).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
            </div>
        </div>
    )
}

export default Wishlist
