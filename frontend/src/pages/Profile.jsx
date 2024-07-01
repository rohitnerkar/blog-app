import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import profileValidator from "../validators/profileValidaotor";

const initialFormData = {
  name: "",
  email: "",
};

const initialFormError = {
  name: "",
  email: "",
};

const Profile = () => {

  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);
  const [oldEmail, setOldEmail] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`/auth/current-user`);
        const data = response.data.data;

        setFormData({ name: data.user.name, email: data.user.email });
        setOldEmail(data.user.email);
      } catch (error) {
        const response = error.response;
        const data = response.data;
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
        });
      }
    };

    getUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = profileValidator({
      name: formData.name,
      email: formData.email,
    });

    if (errors.name || errors.email) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);

        const response = await axios.put("/auth/update-profile", formData);
        const data = response.data;

        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });

        setFormError(initialFormError);
        setLoading(false);

        if(oldEmail !== formData.email){
          window.localStorage.removeItem("blogData");
          navigate("/login");
        }
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
    <div className="main-container">
      <button className="back-button button-block" onClick={() => navigate(-1)}>
        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
          <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 
            7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 
            0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 
            2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 
            7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 
            495.52477z">
          </path>
        </svg>
        <span>Back</span>
      </button>

      <div className="form-container">
        <form className="inner-container" onSubmit={handleSubmit}>
          <h2 className="inner-title">Update profile</h2>
          <div className="form-group">
            <label className="inner-label">Name</label>
            <input
              className="form-control"
              type="text"
              name="name"
              placeholder="Jhon Doe"
              value={formData.name}
              onChange={handleChange}
            />
            {formError.name && <p className="error">{formError.name}</p>}
          </div>

          <div className="form-group">
            <label className="inner-label">Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="doe@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
            {formError.email && <p className="error">{formError.email}</p>}
          </div>

          <div className="form-group">
            <input 
              className="button" 
              type="submit" 
              value={`${loading ? "Updating..." : "Update"}`} 
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
