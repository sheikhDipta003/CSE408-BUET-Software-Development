import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";

const LOGIN_URL = "/auth";
const ROLES = {
  Admin: 5150,
  Collaborator: 1984,
  User: 2001,
};

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUser("");
    setPwd("");

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      console.log(JSON.stringify(response?.data));
      console.log(JSON.stringify(response));
      console.log(JSON.stringify(response?.data.userId));
      const userId = response?.data.userId;
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      console.log("frontend -> roles ", roles);
      setAuth({ user, pwd, roles, accessToken, userId });
      setUser("");
      setPwd("");
      if (roles === ROLES.User) navigate(from, { replace: true });
      else if (roles === ROLES.Admin) navigate("/admin", { replace: true });
      console.log(
        "roles = ",
        roles,
        ", ROLES.roles = ",
        ROLES.roles,
        ", ROLES.User = ",
        ROLES.User,
      );
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
        />
        <button>Sign In</button>
        <div className="text-xs mt-2.5 flex justify-start items-end">
          <input
            type="checkbox"
            id="persist"
            onChange={togglePersist}
            checked={persist}
            className="h-5 w-5 m-0 mx-1 my-0.5 ml-0.5"
          />
          <label htmlFor="persist" className="m-0">
            Trust this device
          </label>
        </div>
      </form>
      <p className="text-red-500">
        Need an Account?
        <br />
        <span className="line">
          <Link to="/register">Sign Up</Link>
        </span>
      </p>
    </section>
  );
};

export default Login;
