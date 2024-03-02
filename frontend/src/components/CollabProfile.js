import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const CollabProfile = ({ collabId }) => {
    const navigate =useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const location=useLocation();
    const [collab, setCollab] = useState({
        username: "",
        website: "",
        email: "",
        registrationDate: "",
    });

    useEffect(() => {
        const getCollab = async () => {
            try {
                const response = await axiosPrivate.get(`collab/${collabId}/profile`);
                console.log("from collab profile: ", response.data);
                setCollab({
                    username: response.data.username,
                    website: response.data.website,
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
                <p>Role: Collaborator</p>
                <p>Name: {collab.username}</p>
                <p>Website: {collab.website}</p>
                <p>Email: {collab.email}</p>
                <p>Registration Date: {new Date(collab.registrationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
        </div>
    )
    
}

export default CollabProfile;