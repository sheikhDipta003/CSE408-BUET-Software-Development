import React, { useState, useEffect } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faSearch } from '@fortawesome/free-solid-svg-icons';

const UserVoucher = ({ userId }) => {
  const axiosPrivate = useAxiosPrivate();
  const [userVouchers, setUserVouchers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: '' });

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
  }, [userId, axiosPrivate]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


const handleSort = (key) => {
  let direction = 'asc';
  if (sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'desc';
  }
  setSortConfig({ key, direction });
};

const sortedVouchers = () => {
  let sorted = [...userVouchers];
  if (sortConfig.key !== null) {
    sorted = sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  return sorted;
};

const filteredVouchers = () => {
  return sortedVouchers().filter(voucher =>
    voucher.websiteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.voucherCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.endDate.includes(searchTerm)
  );
};

return (
  <div>
    <div className="flex items-center mb-4">
      <div className="flex items-center w-3/4">
        <input
          type="text"
          placeholder="Search vouchers by website name, voucher code, or end date..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 px-4 py-2 cursor-pointer" onClick={() => handleSort('websiteName')}>
              Website Name
              <FontAwesomeIcon
                icon={sortConfig.key === 'websiteName' ? (sortConfig.direction === 'asc' ? faSortUp : faSortDown) : faSort}
                className="ml-2"
              />
            </th>
            <th className="border border-gray-200 px-4 py-2 cursor-pointer" onClick={() => handleSort('voucherCode')}>
              Voucher Code
              <FontAwesomeIcon
                icon={sortConfig.key === 'voucherCode' ? (sortConfig.direction === 'asc' ? faSortUp : faSortDown) : faSort}
                className="ml-2"
              />
            </th>
            <th className="border border-gray-200 px-4 py-2 cursor-pointer" onClick={() => handleSort('discountPercentage')}>
              Discount Percentage
              <FontAwesomeIcon
                icon={sortConfig.key === 'discountPercentage' ? (sortConfig.direction === 'asc' ? faSortUp : faSortDown) : faSort}
                className="ml-2"
              />
            </th>
            <th className="border border-gray-200 px-4 py-2 cursor-pointer" onClick={() => handleSort('endDate')}>
              End Date
              <FontAwesomeIcon
                icon={sortConfig.key === 'endDate' ? (sortConfig.direction === 'asc' ? faSortUp : faSortDown) : faSort}
                className="ml-2"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredVouchers().length === 0 ? (
            <tr className='px-4 text-red-500 font-bold'>
              <td colSpan="4">No vouchers to display</td>
            </tr>
          ) : (
            filteredVouchers().map((voucher) => (
              <tr key={voucher.voucherId}>
                <td className="border border-gray-200 px-4 py-2">{voucher.websiteName}</td>
                <td className="border border-gray-200 px-4 py-2">{voucher.voucherCode}</td>
                <td className="border border-gray-200 px-4 py-2">{voucher.discountPercentage}</td>
                <td className="border border-gray-200 px-4 py-2">{new Date(voucher.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default UserVoucher;
