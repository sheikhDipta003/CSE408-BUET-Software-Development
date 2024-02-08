import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Wishlist from './Wishlist';
import UserVoucher from "./UserVoucher";
import Notifications from "./Notifications";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function UserProfile() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
    registrationDate: "",
  });
  const [formData, setFormData] = useState({
    content: "",
    rating:5
  });
  const [activeMenuItem, setActiveMenuItem] = useState("Profile");
  const [activeTab, setActiveTab] = useState("NewReview");
  const { userId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [reviews, setReviews] = useState([]);

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

  const handleReviewSubmit = async (e) => {
    try {
      const newReview = {content: formData.content, rating: formData.rating};
      await axiosPrivate.post(`/users/${userId}/reviews`, newReview);
      setFormData({content:'', rating:5});
    } catch (err) {
      console.error(err);
    }

    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);

    setActiveTab("ManageReviews");
  }

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleMenuClick = (menu) => {
    setActiveMenuItem(menu);
  };

  useEffect(() => {
    const getReviews = async () => {
      try {
        const response = await axiosPrivate.get(`/users/${userId}/reviews`);
        setReviews(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getReviews();
  }, [reviews]);
  
  const handleFormChange = (e) => {    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (reviewId) => {
    console.log('Editing review:', reviewId);
  };

  const handleDelete = async (reviewId) => {
    console.log('Deleting review:', reviewId);
    try {
        await axiosPrivate.get(`users/${userId}/reviews/${reviewId}/delete`);
        const revList = reviews.filter(review => review.reviewId !== reviewId);
        setReviews(revList);
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
  };

  return (
    <div className="flex">
      {/* Left Section - Menu */}
      <div className="min-w-32 p-4 border-r-4 border-red-500 mt-4 mb-4">
        <ul className="grid gap-4 grid-cols-1 grid-rows-4">
          <li
            className={`menu-item ${activeMenuItem === "Profile" ? "active" : ""}`}
            onClick={() => handleMenuClick("Profile")}
          >
            Profile
          </li>

          <li
            className={`menu-item ${activeMenuItem === "Vouchers" ? "active" : ""}`}
            onClick={() => handleMenuClick("Vouchers")}
          >
            Vouchers
          </li>

          <li
            className={`menu-item ${activeMenuItem === "Wishlist" ? "active" : ""}`}
            onClick={() => handleMenuClick("Wishlist")}
          >
            Wishlist
          </li>

          <li
            className={`menu-item ${activeMenuItem === "Reviews" ? "active" : ""}`}
            onClick={() => handleMenuClick("Reviews")}
          >
            Reviews
          </li>

          <li
            className={`menu-item ${activeMenuItem === "Notifs" ? "active" : ""}`}
            onClick={() => handleMenuClick("Notifs")}
          >
            Notifications
          </li>

        </ul>
      </div>

      {/* Right Section - Content */}
      <div className="min-w-60 p-4">
        
        {activeMenuItem === "Profile" && (
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
              <p>{user.username}</p>
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
              <p>{"*".repeat(user.password.length)}</p>
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
              <p>{user.email}</p>
            )}

            <label>Registration Date:</label>
            <p>{user.registrationDate}</p>

            <button onClick={isEditing ? handleSubmit : toggleEdit}>
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
        )}

        {activeMenuItem === "Vouchers" && (
          <UserVoucher userId={userId}/>
        )}

        {activeMenuItem === "Wishlist" && (
          <Wishlist/>
        )}

        {activeMenuItem === "Reviews" && (
          <div>
            {/* Navbar for reviews options */}
            <nav className="flex mb-4">
              <button
                className={`mr-4 px-4 py-2 bg-gray-500 hover:bg-gray-800 rounded ${
                  activeTab === "NewReview" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => setActiveTab("NewReview")}
              >
                New Review
              </button>
              <button
                className={`px-4 py-2 bg-gray-500 hover:bg-gray-800 rounded ${
                  activeTab === "ManageReviews" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => setActiveTab("ManageReviews")}
              >
                Manage Reviews
              </button>
            </nav>
        
            {/* Content based on active tab */}
            {activeTab === "NewReview" && (
              <div>
                <h3 className="mb-4 text-xl font-bold">Create a New Review</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block mb-1 font-semibold" htmlFor="content">
                      Your Message:
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      rows="4"
                      cols="50"
                      className="border rounded-md w-full p-2 focus:outline-none focus:border-blue-500"
                      value={formData.content}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 font-semibold" htmlFor="rating">
                      Rating (0 - 5):
                    </label>
                    <input
                      type="number"
                      id="rating"
                      name="rating"
                      min="0"
                      max="5"
                      className="border rounded-md w-full p-2 focus:outline-none focus:border-blue-500"
                      value={formData.rating}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                    onClick={handleReviewSubmit}
                  >
                    Submit
                  </button>
                </form>

                {showPopup && (
                  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <p className="text-center">Thank you for your review!</p>
                    </div>
                  </div>
                )}
                
              </div>
            )}
        
            {activeTab === "ManageReviews" && (
              <div>
                <h3 className="mb-4 text-xl font-bold">Manage Reviews</h3>

                {reviews.map((review) => (
                  <div key={review.reviewId} className="bg-teal-200 rounded-lg shadow-md p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-normal mb-4">{review.content}</p>
                        <p className="text-purple-800">Rating: {review.rating}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(review.reviewId)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => handleDelete(review.reviewId)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              )}
          </div>
        )}

        {activeMenuItem === "Notifs" && (
          <Notifications userId={userId}/>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
