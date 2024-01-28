import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";

const Logout = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/home");
  };

  return (
    <button
      className="text-right w-full px-4 py-3 mt-0 no-underline block text-red-600 transition bg-slate-100 hover:bg-slate-300 duration-200 rounded-none"
      onClick={signOut}
    >
      Logout
    </button>
  );
};

export default Logout;
