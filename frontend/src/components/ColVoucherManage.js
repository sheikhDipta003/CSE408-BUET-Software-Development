import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const VoucherManagement = ({collabId}) => {
    const [vouchers, setVouchers] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await axiosPrivate.get(`/collab/${collabId}/vouchers`);
                setEvents(response.data.vouchers);
            } catch (error) {
                console.error('Error fetching vouchers:', error);
            }
        };

        fetchVouchers();
    }, []);

    const handleDeleteVoucher = async (voucherId) => {
        try {
            await axiosPrivate.delete(`collab/${collabId}/vouchers/${voucherId}/remove`);
            setVouchers(prevVouchers => prevVouchers.filter(Voucher => Voucher.voucherId !== voucherId));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-2 border-b-4 border-blue-500">Voucher Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vouchers.map(voucher => (
                    <div key={voucher.voucherId} className="border-2 rounded p-4 relative border-blue-600">
                        {/* <div className="text-lg font-semibold mb-2 mt-4 border-b-2 border-violet-500">{event.name}</div>
                        <div className="mb-2 border-b-2 border-violet-500">Venue: {event.venue}</div>
                        <div className="mb-2 border-b-2 border-violet-500">Date: {new Date(event.date).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</div>
                        <div className="mb-2">{event.description}</div> */}
                        <div className="mb-2 border-b-2 border-violet-500">Voucher Code: {voucher.voucherCode}</div>
                        <button onClick={() => handleDeleteVoucher(voucher.voucherId)} className="text-red-700 hover:text-red-800 bg-teal-100">
                            <FontAwesomeIcon icon={faTrash} />
                            <span className="ml-2">Delete Voucher</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default VoucherManagement;
