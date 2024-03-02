import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const AdminProfile = ({ adminId }) => {
    const navigate =useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const location=useLocation();
    const [admin, setAdmin] = useState({
        username: "",
        email: "",
        registrationDate: "",
    });

    useEffect(() => {
        const getCollab = async () => {
            try {
                const response = await axiosPrivate.get(`admin/${adminId}/profile`);
                console.log("from admin profile: ", response.data);
                setAdmin({
                    username: response.data.username,
                    email: response.data.email,
                    registrationDate: response.data.registrationDate,
                })
            } catch (error) {
                console.log("Error retrieving collab info");
                navigate("/login", { state: { from: location }, replace: true });
            }
        };
        getCollab();
    }, [])

    return (
        <div className="flex">
            <div className="user-info">
                <p>Role: Admin</p>
                <p>Name: {admin.username}</p>
                <p>Email: {admin.email}</p>
                <p>Registration Date: {new Date(admin.registrationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
        </div>
    )
    
}

export default AdminProfile;