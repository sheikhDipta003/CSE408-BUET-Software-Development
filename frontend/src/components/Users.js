import React from 'react';
import { useState, useEffect } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';

const Users = () => {
    const axiosPrivate = useAxiosPrivate();
    const [users, setUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axiosPrivate.get("/admin/users");
          setUsers(response.data.users);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
  
      fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        try {
            await axiosPrivate.get(`admin/users/${userId}/delete`);
            setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Function to handle deleting all selected vouchers
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

    const filteredUsers = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(user.registrationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <div>
            <input
              type="text"
              placeholder="Search by username, email, or registration date"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-3/4 p-2 mb-4 border border-gray-300 rounded"
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
                            <th className="border border-gray-200 px-4 py-2">User Name</th>
                            <th className="border border-gray-200 px-4 py-2">Email</th>
                            <th className="border border-gray-200 px-4 py-2">Registration Date</th>
                            <th className="border border-gray-200 px-4 py-2">User Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0
                        ? <div className='px-4 text-red-500 font-bold'>No users to display</div>
                        : filteredUsers.map((user) => (
                            <tr key={user.userId}>
                                <td className="border border-gray-200 px-4 py-2">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-blue-500"
                                        checked={user.isSelected || false}
                                        onChange={() => handleCheckboxChange(user.userId)}
                                    />
                                </td>
                                <td className="border border-gray-200 px-4 py-2">{user.username}</td>
                                <td className="border border-gray-200 px-4 py-2">{user.email}</td>
                                <td className="border border-gray-200 px-4 py-2">{new Date(user.registrationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                                <td className='border border-gray-200 px-4 py-2'>{user.roles}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Users
