import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Wishlist from "./Wishlist";
import UserVoucher from "./UserVoucher";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import UserEvent from './UserEvent';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const UserProfile = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
    matchpassword: "",
    email: "",
    registrationDate: "",
  });
  const [formData, setFormData] = useState({
    content: "",
    rating: 5,
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
  const errRef = useRef();
  const [validName, setValidName] = useState(true);
  const [userFocus, setUserFocus] = useState(false);
  const [validPwd, setValidPwd] = useState(true);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [validMatch, setValidMatch] = useState(true);
  const [matchFocus, setMatchFocus] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [validEmail, setValidEmail] = useState(true);
  const [emailFocus, setEmailFocus] = useState(false);

  useEffect(() => {
    setValidName(USER_REGEX.test(user.username));
  }, [user.username]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(user.password));
    setValidMatch(user.password === user.matchpassword);
  }, [user.password, user.matchpassword]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(user.email));
  }, [user.email]);

  useEffect(() => {
    setErrMsg("");
  }, [user.username, user.password, user.matchpassword]);

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
    setUser({ ...user, [e.target.id]: e.target.value });
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
      console.error(err.response.status);
      console.error(err.response.data.message);
      alert(err.response.data.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    try {
      const newReview = { content: formData.content, rating: formData.rating };
      await axiosPrivate.post(`/users/${userId}/reviews`, newReview);
      setFormData({ content: "", rating: 5 });
    } catch (err) {
      console.error(err);
    }

    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);

    setActiveTab("ManageReviews");
  };

  const handleEditReview = async (reviewId) => {
    const selectedReview = reviews.find(review => review.reviewId === reviewId);
    if (selectedReview) {
      const newContent = prompt("Enter the new content:", selectedReview.content);
      let newRating = prompt("Enter the new rating (0 - 5):", selectedReview.rating);

    if (newContent !== null && newRating !== null) {
        newRating = parseInt(newRating);
        if (!Number.isInteger(newRating) || newRating < 0 || newRating > 5) {
          alert("Please enter a valid rating between 0 and 5.");
          return;
        }
        const updatedReview = {
          ...selectedReview,
          content: newContent,
          rating: parseInt(newRating)
        };

        try {
          const response = await axiosPrivate.put(`/users/${userId}/reviews/${reviewId}/edit`, {
            content: updatedReview.content,
            rating: updatedReview.rating
          });
          alert(response.data.message);
        } catch (err) {
          console.error('Error updating review:', err);
          alert(err.response?.data?.message || err.message);
        }
  
        const updatedReviews = reviews.map(review => {
          if (review.reviewId === reviewId) {
            return updatedReview;
          }
          return review;
        });
  
        setReviews(updatedReviews);
      }
    }
  };

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

  const handleDelete = async (reviewId) => {
    console.log("Deleting review:", reviewId);
    try {
      await axiosPrivate.get(`users/${userId}/reviews/${reviewId}/delete`);
      const revList = reviews.filter((review) => review.reviewId !== reviewId);
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
            className={`menu-item ${activeMenuItem === "Profile" ? "active text-red-600 font-bold bg-yellow-300" : ""} hover:bg-yellow-200 rounded-md`}
            onClick={() => handleMenuClick("Profile")}
          >
            Profile
          </li>

          <li
            className={`menu-item ${activeMenuItem === "Vouchers" ? "active text-red-600 font-bold bg-yellow-300" : ""} hover:bg-yellow-200 rounded-md`}
            onClick={() => handleMenuClick("Vouchers")}
          >
            Vouchers
          </li>

          <li
            className={`menu-item ${activeMenuItem === "Wishlist" ? "active text-red-600 font-bold bg-yellow-300" : ""} hover:bg-yellow-200 rounded-md`}
            onClick={() => handleMenuClick("Wishlist")}
          >
            Wishlist
          </li>

          <li
            className={`menu-item ${activeMenuItem === "Reviews" ? "active text-red-600 font-bold bg-yellow-300" : ""} hover:bg-yellow-200 rounded-md`}
            onClick={() => handleMenuClick("Reviews")}
          >
            Reviews
          </li>

          <li
            className={`menu-item ${activeMenuItem === "Events" ? "active text-red-600 font-bold bg-yellow-300" : ""} hover:bg-yellow-200 rounded-md`}
            onClick={() => handleMenuClick("Events")}
          >
            Events
          </li>
        </ul>
      </div>

      {/* Right Section - Content */}
      <div className="p-4 max-w-3xl">
        {activeMenuItem === "Profile" && (
          <div className="user-info">
            <label>Name:</label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  id="username"
                  autoComplete="off"
                  onChange={handleChange}
                  value={user.username}
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                />
                <p
                  id="uidnote"
                  className={
                    userFocus && user.username && !validName
                      ? "text-xs text-black rounded-md p-1 relative bottom-10"
                      : "absolute left-[-9999px]"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} color="black" />
                  4 to 24 characters.
                  <br />
                  Must begin with a letter.
                  <br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              </>
            ) : (
              <p>{user.username}</p>
            )}

            {isEditing ? (
              <>
                <label>New Password:</label>
                <input
                  type="password"
                  id="password"
                  onChange={handleChange}
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                />
                <p
                  id="pwdnote"
                  className={
                    pwdFocus && !validPwd
                      ? "text-xs text-black rounded-md p-1 relative bottom-10"
                      : "absolute left-[-9999px]"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  8 to 24 characters.
                  <br />
                  Must include uppercase and lowercase letters, a number and a
                  special character.
                  <br />
                  Allowed special characters:{" "}
                  <span aria-label="exclamation mark">!</span>{" "}
                  <span aria-label="at symbol">@</span>{" "}
                  <span aria-label="hashtag">#</span>{" "}
                  <span aria-label="dollar sign">$</span>{" "}
                  <span aria-label="percent">%</span>
                </p>
              </>
            ) : (
              <>
                <label>Password:</label>
                <p className="h-8"></p>
              </>
            )}

            <label>Confirm New Password:</label>
            {isEditing ? (
              <>
                <input
                  type="password"
                  id="matchpassword"
                  onChange={handleChange}
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                />
                <p
                  id="confirmnote"
                  className={
                    matchFocus && !validMatch
                      ? "text-xs text-black rounded-md p-1 relative bottom-10"
                      : "absolute left-[-9999px]"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must match the first password input field.
                </p>
              </>
            ) : (
              <p className="h-8"></p>
            )}

            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                id="email"
                onChange={handleChange}
                value={user.email}
                aria-invalid={validEmail ? "false" : "true"}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
            ) : (
              <p>{user.email}</p>
            )}

            <label>Registration Date:</label>
            <p>
              {new Date(user.registrationDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div className="flex flex-wrap flex-row justify-evenly">
              <button
                onClick={isEditing ? handleSubmit : toggleEdit}
                className="w-1/2"
                disabled={
                  isEditing &&
                  (validName || validPwd || validMatch || validEmail)
                    ? false
                    : !isEditing
                      ? false
                      : true
                }
              >
                {isEditing ? "Save" : "Edit"}
              </button>

              <button
                onClick={() => setIsEditing(false)}
                disabled={!isEditing}
                className="w-1/2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {activeMenuItem === "Vouchers" && <UserVoucher userId={userId} />}

        {activeMenuItem === "Wishlist" && <Wishlist userId={userId} />}

        {activeMenuItem === "Reviews" && (
          <div>
            {/* Navbar for reviews options */}
            <nav className="flex mb-4">
              <button
                className={`mr-4 px-4 py-2 text-black ${
                  activeTab === "NewReview"
                    ? "bg-blue-500 text-white rounded"
                    : "bg-slate-300 "
                }`}
                onClick={() => setActiveTab("NewReview")}
              >
                New Review
              </button>
              <button
                className={`px-4 py-2 text-black ${
                  activeTab === "ManageReviews"
                    ? "bg-blue-500 text-white rounded"
                    : "bg-slate-300 text-black"
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
                    <label
                      className="block mb-1 font-semibold"
                      htmlFor="content"
                    >
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
                    <label
                      className="block mb-1 font-semibold"
                      htmlFor="rating"
                    >
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
                  <div
                    key={review.reviewId}
                    className="bg-teal-200 rounded-lg shadow-md p-4 mb-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-normal mb-4">
                          {review.content}
                        </p>
                        <p className="text-purple-800">
                          Rating: {review.rating}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditReview(review.reviewId)}
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

        {activeMenuItem === "Events" && (
          <UserEvent userId={userId}/>
        )}

      </div>
    </div>
  );
};

export default UserProfile;
