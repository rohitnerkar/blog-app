import { useState } from "react";
import { toast } from "react-toastify";
import axios from "../utils/axiosInstance";
import loginValidator from "../validators/loginValidator";
import { useNavigate, Link } from "react-router-dom";

const initialFormData = {
  email: "",
  password: "",
};

const initialFormError = {
  email: "",
  password: "",
};

const Login = () => {

  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = loginValidator({
      email: formData.email,
      password: formData.password,
    });

    if (errors.email || errors.password) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);

        const response = await axios.post("/auth/signin", formData);
        const data = response.data;

        window.localStorage.setItem("blogData", JSON.stringify(data.data));

        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });

        setFormData(initialFormData);
        setFormError(initialFormError);
        setLoading(false);
        navigate("/");
      } catch (error) {
        setLoading(false);
        setFormError(initialFormError);

        const response = error.response;
        const data = response.data;
        
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
          });
      }
    }
  };

  return (
    <div className="bg-img">
    <div className="form-container">
      <form className="inner-container" onSubmit={handleSubmit}>
        <h2 className="form-title">Login Form</h2>

        <div className="form-group">
          <label>Email</label>
          <input
            id="email"
            className="form-control"
            type="text"
            name="email"
            placeholder="Username"
            value={formData.email}
            onChange={handleChange}
          />
          {formError.email && <p className="error">{formError.email}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            id="password"
            className="form-control"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {formError.password && <p className="error">{formError.password}</p>}
        </div>

        <Link className="forgot-password" to="/forgot-password">
          Forgot Password?
        </Link>

        <div className="form-group">
          <input type="submit" value={`${loading ? "Loging..." : "Login"}`} />
        </div>
      </form>
    </div>
    </div>
  );
};

export default Login;
