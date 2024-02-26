import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      console.log(response.data.userId);
      return {
        ...prev,
        roles: response.data.roles,
        accessToken: response.data.accessToken,
        userId: response.data.userId
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
