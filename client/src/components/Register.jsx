import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast"; // eslint-disable-line
import { useCookies } from "react-cookie"; // eslint-disable-line
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [cookies] = useCookies(["cookie-name"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.jwt) {
      navigate("/");
    }
  }, [cookies, navigate]);

  const [values, setValues] = useState({ email: "", password: "" });

  const generateError = (error) =>
    toast.error(error);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/signup`,
        {
          ...values,
        },
        { withCredentials: true }
      );

      if (data) {
        if (data.errors) {
          const { email, password } = data.errors;
          if (email) generateError(email);
          else if (password) generateError(password);
        } else {
          navigate("/");
        }
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  return (
    <div className="container">
      <h2>Register Account</h2>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          />
        </div>
        <button type="submit">Submit</button>
        <span>
          Already have an account ?<Link to="/login"> Login</Link>
        </span>
      </form>
    </div>
  );
}

export default Register;
