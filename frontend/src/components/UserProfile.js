import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation, useParams } from "react-router-dom";

function UserProfile() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
    registrationDate: "",
  });

  const { userId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(`/users/${userId}`);
        console.log("from userprofile = ", response.data);
        isMounted &&
          setUser({
            username: response.data.username,
            password: response.data.password,
            email: response.data.email,
            registrationDate: response.data.registrationDate,
          });
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosPrivate.put(`/users/${userId}/update`, {
        username: user.username,
        password: user.password,
        email: user.email,
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="user-info">
        <label>Name:</label>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={user.username}
            onChange={handleChange}
          />
        ) : (
          <p style={{ color: "black" }}>{user.username}</p>
        )}

        <label>Password:</label>
        {isEditing ? (
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        ) : (
          <p style={{ color: "black" }}>{"*".repeat(user.password.length)}</p>
        )}

        <label>Email:</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        ) : (
          <p style={{ color: "black" }}>{user.email}</p>
        )}

        <label>Registration Date:</label>
        <p style={{ color: "black" }}>{user.registrationDate}</p>

        <button
          id="saveProfileInfo"
          onClick={isEditing ? handleSubmit : toggleEdit}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
