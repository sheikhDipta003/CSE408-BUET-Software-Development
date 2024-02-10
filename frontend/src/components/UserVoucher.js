import React from 'react';
import { useState, useEffect } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';

const UserVoucher = ({userId}) => {
    const axiosPrivate = useAxiosPrivate();
    const [userVouchers, setUserVouchers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const getUserVouchers = async () => {
            try {
                const response = await axiosPrivate.get(`/users/${userId}/vouchers`);
                console.log(response.data);
                isMounted && setUserVouchers(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        getUserVouchers();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleDelete = async (voucherId) => {
        try {
            await axiosPrivate.delete(`users/${userId}/vouchers/${voucherId}/remove`);
            setUserVouchers(prevVouchers => prevVouchers.filter(voucher => voucher.voucherId !== voucherId));
        } catch (error) {
            console.error('Error deleting voucher:', error);
        }
    };

    // Function to handle deleting all selected vouchers
    const handleDeleteSelected = async () => {
        const selectedVouchers = userVouchers.filter(voucher => voucher.isSelected);
        try {
            await Promise.all(selectedVouchers.map(voucher => handleDelete(voucher.voucherId)));
        } catch (error) {
            console.error('Error deleting selected vouchers:', error);
        }
    };

    const handleCheckboxChange = (voucherId) => {
        const updatedVouchers = userVouchers.map(voucher => {
            if (voucher.voucherId === voucherId) {
                return { ...voucher, isSelected: !voucher.isSelected };
            }
            return voucher;
        });
        setUserVouchers(updatedVouchers);
    };

    const toggleSelectAll = () => {
        const updatedVouchers = userVouchers.map(voucher => ({ ...voucher, isSelected: !selectAll }));
        setUserVouchers(updatedVouchers);
        setSelectAll(!selectAll);
    };

    const formattedDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <button onClick={toggleSelectAll} className="text-blue-700 hover:text-blue-800 mr-4 bg-teal-100" disabled={userVouchers.length === 0}>
                        {selectAll ? (
                            <FontAwesomeIcon icon={faCheckSquare} />
                        ) : (
                            <FontAwesomeIcon icon={faSquare} />
                        )}
                        <span className="ml-2">Select All</span>
                    </button>
                    <button onClick={handleDeleteSelected} className="text-red-700 hover:text-red-800 bg-teal-100" disabled={userVouchers.filter(voucher => voucher.isSelected).length === 0}>
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
                            <th className="border border-gray-200 px-4 py-2">Website Name</th>
                            <th className="border border-gray-200 px-4 py-2">Voucher Code</th>
                            <th className="border border-gray-200 px-4 py-2">Discount Percentage</th>
                            <th className="border border-gray-200 px-4 py-2">End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userVouchers.map((voucher) => (
                            <tr key={voucher.voucherId}>
                                <td className="border border-gray-200 px-4 py-2">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-blue-500"
                                        checked={voucher.isSelected || false}
                                        onChange={() => handleCheckboxChange(voucher.voucherId)}
                                    />
                                </td>
                                <td className="border border-gray-200 px-4 py-2">{voucher.websiteName}</td>
                                <td className="border border-gray-200 px-4 py-2">{voucher.voucherCode}</td>
                                <td className="border border-gray-200 px-4 py-2">{voucher.discountPercentage}</td>
                                <td className="border border-gray-200 px-4 py-2">{formattedDate(voucher.endDate)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserVoucher
