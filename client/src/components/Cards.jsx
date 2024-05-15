import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie"; // eslint-disable-line
import axios from "axios";
import toast from "react-hot-toast"; // eslint-disable-line

function Cards() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([]); // eslint-disable-line
  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        navigate("/login");
      } else {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/users/`,
          {},
          {
            withCredentials: true,
          }
        );
        if (!data.status) {
          removeCookie("jwt");
          navigate("/login");
        } else
          toast.success(`Hi ${data.user} 🦄`);
      }
    };

    verifyUser();
  }, [cookies, navigate, removeCookie]);

  const logOut = () => {
    removeCookie("jwt");
    navigate("/login");
    toast.success("Logged out");
  };

  return (
    <div className="private">
      <h1>Super Secret Page</h1>
      <button type="button" onClick={logOut}>
        Log out
      </button>
    </div>
  );
}

export default Cards;
