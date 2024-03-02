import React from 'react';
import { useState, useEffect } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheckSquare, faSquare, faSort, faSortUp, faSortDown, faArrowRight, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import AdminReview from './AdminReview';
import UserVoucher from './UserVoucher';
import Wishlist from './Wishlist';

const Users = () => {
    const axiosPrivate = useAxiosPrivate();
    const [users, setUsers] = useState([]);
    const [collabs, setCollabs] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [showUserDetails, setShowUserDetails] = useState(false);

    const [openSections, setOpenSections] = useState({
        vouchers: false,
        wishlist: false,
    });
    
    const toggleAccordion = (section) => {
        setOpenSections(prevState => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    useEffect(() => {
        console.log(showUserDetails);
    }, [showUserDetails]);
    
    const handleViewDetails = (userId) => {
        console.log("show details of user = ", userId);
        setShowUserDetails(true);
    }
    const closeSidebar = () => setShowUserDetails(false);

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axiosPrivate.get("/admin/users");
          setUsers(response.data.users);
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      const fetchCollabs = async () => {
        try {
            const response = await axiosPrivate.get("/admin/collabs");
            setCollabs(response.data.collabs);
            console.log(response.data);
          } catch (error) {
            console.error('Error fetching collabs:', error);
          }
      }
  
      fetchUsers();
      fetchCollabs();
    }, []);

    const handleSort = (field) => {
        if (field === sortBy) {
          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
          setSortBy(field);
          setSortOrder('asc');
        }
    };

    const handleDelete = async (userId) => {
        try {
            await axiosPrivate.get(`admin/users/${userId}/delete`);
            setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleDeleteSelected = async () => {
        const selectedVouchers = users.filter(user => user.isSelected);
        try {
            await Promise.all(selectedVouchers.map(user => handleDelete(user.userId)));
        } catch (error) {
            console.error('Error deleting selected Users:', error);
        }
    };

    const handleCheckboxChange = (userId) => {
        const updatedVouchers = users.map(user => {
            if (user.userId === userId) {
                return { ...user, isSelected: !user.isSelected };
            }
            return user;
        });
        setUsers(updatedVouchers);
    };

    const toggleSelectAll = () => {
        const updatedVouchers = users.map(user => ({ ...user, isSelected: !selectAll }));
        setUsers(updatedVouchers);
        setSelectAll(!selectAll);
    };

    const sortedUsers = users.sort((a, b) => {
        if (sortBy) {
            const valueA = a[sortBy];
            const valueB = b[sortBy];

            if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filteredUsers = sortedUsers.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(user.registrationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.roles.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getWebsiteForUserId = (userId) => {
        const collabsIndex = collabs.findIndex(collab => collab.userId === userId);
        console.log(collabsIndex);
        return collabsIndex !== -1 ? collabs[collabsIndex].Website.name : null;
      };
    
    return (
        <div>
            <input
              type="text"
              placeholder="Search by username, email, registration date or role"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-3/4 p-4 mb-4 border border-gray-300 rounded"
            />
            
            <div className="flex justify-between items-center mb-4">
                <div>
                    <button onClick={toggleSelectAll} className="text-blue-700 hover:text-blue-800 mr-4 bg-teal-100" disabled={users.length === 0}>
                        {selectAll ? (
                            <FontAwesomeIcon icon={faCheckSquare} />
                        ) : (
                            <FontAwesomeIcon icon={faSquare} />
                        )}
                        <span className="ml-2">Select All</span>
                    </button>
                    <button onClick={handleDeleteSelected} className="text-red-700 hover:text-red-800 bg-teal-100" disabled={users.filter(user => user.isSelected).length === 0}>
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
                            <th onClick={() => handleSort('username')} className="border border-gray-200 px-4 py-2 cursor-pointer">
                                Username
                                {sortBy === 'username' && sortOrder === 'asc' && <FontAwesomeIcon icon={faSortUp} className="ml-2 text-black" />}
                                {sortBy === 'username' && sortOrder === 'desc' && <FontAwesomeIcon icon={faSortDown} className="ml-2 text-black" />}
                                {sortBy !== 'username' && <FontAwesomeIcon icon={faSort} className="ml-2 text-black" />}
                            </th>
                            <th onClick={() => handleSort('email')} className="border border-gray-200 px-4 py-2 cursor-pointer">
                                Email
                                {sortBy === 'email' && sortOrder === 'asc' && <FontAwesomeIcon icon={faSortUp} className="ml-2 text-black" />}
                                {sortBy === 'email' && sortOrder === 'desc' && <FontAwesomeIcon icon={faSortDown} className="ml-2 text-black" />}
                                {sortBy !== 'email' && <FontAwesomeIcon icon={faSort} className="ml-2 text-black" />}
                            </th>
                            <th onClick={() => handleSort('registrationDate')} className="border border-gray-200 px-4 py-2 cursor-pointer">
                                Registration Date
                                {sortBy === 'registrationDate' && sortOrder === 'asc' && <FontAwesomeIcon icon={faSortUp} className="ml-2 text-black" />}
                                {sortBy === 'registrationDate' && sortOrder === 'desc' && <FontAwesomeIcon icon={faSortDown} className="ml-2 text-black" />}
                                {sortBy !== 'registrationDate' && <FontAwesomeIcon icon={faSort} className="ml-2 text-black" />}
                            </th>
                            <th onClick={() => handleSort('userRole')} className="border border-gray-200 px-4 py-2 cursor-pointer">
                                User Role
                                {sortBy === 'userRole' && sortOrder === 'asc' && <FontAwesomeIcon icon={faSortUp} className="ml-2 text-black" />}
                                {sortBy === 'userRole' && sortOrder === 'desc' && <FontAwesomeIcon icon={faSortDown} className="ml-2 text-black" />}
                                {sortBy !== 'userRole' && <FontAwesomeIcon icon={faSort} className="ml-2 text-black" />}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0
                        ? <tr className='px-4 text-red-500 font-bold'><td>No users to display</td></tr>
                        : filteredUsers.map((user) => (
                            <>
                                <tr key={user.userId}>
                                    <td className="border border-gray-200 px-4 py-2">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-blue-500"
                                            checked={user.isSelected || false}
                                            onChange={() => handleCheckboxChange(user.userId)}
                                        />
                                    </td>
                                    <td className="border border-gray-200 px-4 py-2 relative flex items-center">
                                        <span className="flex-grow items-center">{user.username}</span>
                                        <button className="ml-4 bg-stone-200 mt-0 mb-0" onClick={() => handleViewDetails(user.userId)}>
                                            <FontAwesomeIcon icon={faArrowRight} className="text-blue-500 hover:text-red-700" />
                                        </button>
                                    </td>
                                    <td className="border border-gray-200 px-4 py-2">{user.email}</td>
                                    <td className="border border-gray-200 px-4 py-2">{new Date(user.registrationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                                    <td className='border border-gray-200 px-4 py-2'>{user.roles}</td>
                                </tr>
                                {showUserDetails && user.roles === "User" && (
                                    <div
                                        className={`sidebar fixed top-0 right-0 w-2/3 bg-white h-screen overflow-y-auto transform ${showUserDetails ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out h-full shadow-lg z-50`}
                                    >
                                        <div className="sticky top-0 right-0 z-40 sidebar-header flex justify-center bg-violet-300 p-0 m-0">
                                            <button onClick={closeSidebar} className='p-0 bg-transparent'>
                                                <FontAwesomeIcon icon={faTimes} className='text-red-500 mb-2 size-6 hover:text-red-800'/>
                                            </button>
                                        </div>
                                        
                                        <div className="bg-white w-full h-full mt-10 px-4">
                                            <div className="p-2 border-b-4 border-red-400">
                                                <h2 className="text-lg font-semibold inline">Vouchers</h2>
                                                <button
                                                    onClick={() => toggleAccordion('vouchers')}
                                                    className="mt-0 float-right focus:outline-none size-7"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faChevronDown}
                                                        className={`transition-transform transform ${openSections.vouchers ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                            </div>
                                            <div className={`p-4 border-b-4 border-red-400 ${openSections.vouchers ? '' : 'hidden'}`}>
                                                <UserVoucher userId={user.userId}/>
                                            </div>
                
                                            <div className="p-2 border-b-4 border-red-400">
                                                <h2 className="text-lg font-semibold inline">Wishlist</h2>
                                                <button
                                                    onClick={() => toggleAccordion('wishlist')}
                                                    className="mt-0 float-right focus:outline-none size-7"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faChevronDown}
                                                        className={`transition-transform transform ${openSections.wishlist ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                            </div>
                                            <div className={`p-4 border-b-4 border-red-400 ${openSections.wishlist ? '' : 'hidden'}`}>
                                                <Wishlist userId={user.userId}/>
                                            </div>
                
                                        </div>
                                    </div>
                                )}

                                {showUserDetails && user.roles === "Collaborator" && (
                                    <div
                                    className={`sidebar fixed top-0 right-0 w-2/3 bg-white h-screen overflow-y-auto transform ${showUserDetails ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out h-full shadow-lg z-50`}
                                    >
                                        <div className="sticky top-0 right-0 z-40 sidebar-header flex justify-center bg-violet-300 p-0 m-0">
                                            <button onClick={closeSidebar} className='p-0 bg-transparent'>
                                                <FontAwesomeIcon icon={faTimes} className='text-red-500 mb-2 size-6 hover:text-red-800'/>
                                            </button>
                                        </div>
                                        <p className='text-lg font-bold'>Collaborator</p>
                                        <p className='text-lg font-bold'>Website: {getWebsiteForUserId(user.userId)}</p>
                                    </div>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>

            <AdminReview/>
        </div>
    )
}

export default Users