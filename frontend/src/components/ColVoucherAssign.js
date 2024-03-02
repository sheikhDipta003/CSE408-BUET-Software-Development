import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faGift, faCheckSquare, faSquare, faTimes, faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";

const ColVoucherAssign = () => {
  const [clickCounts, setClickCounts] = useState({});
  const [totalclickcounts, setTotalClickCounts] = useState({});
  const [userVouchers, setUserVouchers] = useState({});
  const [uniqueUserIds, setUniqueUserIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vouchers, setVouchers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const axiosPrivate = useAxiosPrivate();
  const { collabId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosPrivate.get(`/collab/${collabId}/clickcounts`);
        setClickCounts(res.data.clickcounts);
        setTotalClickCounts(res.data.totalclickcounts);

        const userIds = Object.keys(res.data.clickcounts).reduce((acc, pwId) => {
          const pwIdUserIds = Object.keys(res.data.clickcounts[pwId]);
          return [...acc, ...pwIdUserIds];
        }, []);

        const uniqueIds = Array.from(new Set(userIds));
        setUniqueUserIds(uniqueIds);

        const userVoucherData = {};
        for (const userId of uniqueIds) {
          const userVouchersResponse = await axiosPrivate.get(`/collab/${collabId}/voucher/count/${userId}`);
          userVoucherData[userId] = userVouchersResponse.data.nVouchers;
        }
        setUserVouchers(userVoucherData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchVouchers = async () => {
      try {
        const response = await axiosPrivate.get(`/collab/${collabId}/vouchers`);
        setVouchers(response.data.vouchers);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchData();
    fetchVouchers();
  }, [collabId, axiosPrivate]);

  const toggleSelectAll = () => {
    if (selectedUserIds.length === uniqueUserIds.length) {
      setSelectedUserIds([]);
      setSelectAll(false);
    } else {
      setSelectedUserIds(uniqueUserIds);
      setSelectAll(true);
    }
  };

  const toggleSelectUser = (userId) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const selectVoucher = (voucherId, voucherCode, websiteName, total) => {
    if (selectedVouchers.some(voucher => voucher.voucherId === voucherId)) {
      setSelectedVouchers(selectedVouchers.filter((voucher) => voucher.voucherId !== voucherId));
    } else {
      setSelectedVouchers([...selectedVouchers, { voucherId, voucherCode, websiteName, total }]);
    }
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const handleAssignVouchers = async () => {
    try {
      for (const voucher of selectedVouchers) {
        for (const userId of selectedUserIds) {
          if(voucher.total < selectedUserIds.length){
            alert(`Operation failed! ${voucher.total} vouchers are left for this offer`);
            break;
          }

          await axiosPrivate.get(`/collab/voucher/assign/${userId}/${voucher.voucherId}`);

          console.log(voucher.voucherId);
          console.log(voucher.websiteName);

          const res2 = await axiosPrivate.get(`/users/${userId}`);
          console.log(res2.data.username);
          const newNotif = {
            title:"Congratulations! You've Been Assigned a Voucher!", 
            message:`Dear ${res2.data.username}, ${voucher.websiteName} is excited to inform you that you have been assigned a voucher for our exclusive offer. This voucher brings you fantastic discounts on our products and services - Voucher Code: ${voucher.voucherCode}.`, 
            isRead: false, 
            userId: userId
          };
          await axiosPrivate.post(`admin/users/${userId}/notify`, newNotif);
          console.log(`Notified user ${userId}!`);
        }
      }
    } catch (error) {
      console.error("Error assigning vouchers:", error);
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedUserIds = [...uniqueUserIds].sort((a, b) => {
    if (sortColumn === 'totalVouchers') {
      const aVouchers = userVouchers[a] || 0;
      const bVouchers = userVouchers[b] || 0;
      return sortDirection === 'asc' ? aVouchers - bVouchers : bVouchers - aVouchers;
    } else if (sortColumn === 'totalClickCounts') {
      const aClickCounts = totalclickcounts[a] || 0;
      const bClickCounts = totalclickcounts[b] || 0;
      return sortDirection === 'asc' ? aClickCounts - bClickCounts : bClickCounts - aClickCounts;
    }
    return 0;
  });

  return (
    <div className="container mx-auto w-full">
      <div className="flex justify-center items-center w-full">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer mr-2"
          onClick={toggleSelectAll}
        >
          <FontAwesomeIcon icon={faCheckSquare} className="mr-1" />
          Select All
        </button>
        <div className="relative">
          <button
            className="bg-transparent text-black font-normal border-2 border-r-0 border-black rounded-md rounded-r-none cursor-pointer"
            onClick={toggleDropdown}
          >
            Select Vouchers
          </button>
          <button
            className="ml-0 pl-1 mr-2 text-gray-600 border-r-2 border-t-2 border-b-2 rounded-md rounded-l-none border-black"
            onClick={closeDropdown}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          {showDropdown && (
            <div className="absolute bg-white border rounded shadow-md mt-2 w-48">
              {vouchers.map((voucher) => (
                <div
                  key={voucher.voucherId}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => selectVoucher(voucher.voucherId, voucher.voucherCode, voucher.websiteName, voucher.total)}
                >
                  {`${voucher.voucherCode}`}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={handleAssignVouchers}
        >
          <FontAwesomeIcon icon={faGift} className="mr-1" />
          Assign Vouchers
        </button>
      </div>

      {selectedVouchers.length > 0 && (
        <div className="w-5/6 py-2 flex justify-end items-center text-red-500 font-semibold">
          <div className="max-w-sm overflow-auto">
            Vouchers Selected: {selectedVouchers.map((voucher) => `${voucher.voucherCode}`).join(", ")}
          </div>
        </div>
      )}

      {loading ? (
        <div className="w-full px-4 py-2 flex justify-center items-center text-red-500 font-semibold">Loading ...</div>
      ) : (
        <div className="flex justify-center items-center mb-4 w-full">
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Select</th>
                <th className="px-4 py-2">User ID</th>
                {Object.keys(clickCounts).map((pwId) => (
                  <th key={pwId} className="px-4 py-2">{`PW ID ${pwId}`}</th>
                ))}
                <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('totalClickCounts')}>
                  Total Click Counts 
                  {sortColumn === 'totalClickCounts' && (
                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faCaretUp : faCaretDown} />
                  )}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('totalVouchers')}>
                  Total Vouchers 
                  {sortColumn === 'totalVouchers' && (
                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faCaretUp : faCaretDown} />
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUserIds.map((userId, index) => (
                <tr key={userId} className={`${index % 2 === 0 ? 'bg-green-100' : 'bg-green-200'} hover:cursor-pointer`} onClick={() => toggleSelectUser(userId)}>
                  <td className="border px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectAll || selectedUserIds.includes(userId)}
                      onChange={() => toggleSelectUser(userId)}
                      className="size-4"
                    />
                  </td>
                  <td className="border px-4 py-2">{userId}</td>
                  {Object.keys(clickCounts).map((pwId) => (
                    <td key={`${pwId}-${userId}`} className="border px-4 py-2">
                      {clickCounts[pwId][userId] || 0}
                    </td>
                  ))}
                  <td className="border px-4 py-2 border-l-black border-l-4">{totalclickcounts[userId] || 0}</td>
                  <td className="border px-4 py-2">{userVouchers[userId]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ColVoucherAssign;
