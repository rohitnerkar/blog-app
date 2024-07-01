import { useState } from "react";
import { toast } from "react-toastify";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";

const VerifyUser = () => {

  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [loading2, setLoading2] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  const handleSendVerificationCode = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post("/auth/send-verification-email", {email: auth.email});
      const data = response.data;

      toast.success(data.message, {
        position: "top-right",
        autoClose: true,
      });
     
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const response = error.response;
      const data = response.data;
      toast.error(data.message, {
        position: "top-right",
        autoClose: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(code){
      try {
        setLoading2(true);
  
        const response = await axios.post("/auth/verify-user", {email: auth.email, code});
        const data = response.data;

        setCode("");
        setCodeError("");

        window.localStorage.removeItem("blogData");
        navigate("/login");
  
        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });
       
        setLoading2(false);
      } catch (error) {
        setCode("");
        setCodeError("");
        setLoading2(false);
        const response = error.response;
        const data = response.data;
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
        });
      }
    }else{
      setCodeError("Code is required");
    }
  };

  return (
    <div className="main-container">
      <button 
        className="back-button button-block" 
        onClick={() => navigate(-1)}
      >
        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
          <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 
            188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 
            5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 
            0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 
            28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 
            475.058646 874.690416 484.217237 874.690416 495.52477z">
          </path>
        </svg>
        <span>Back</span>
      </button>

      <button className="back-button button-block" onClick={handleSendVerificationCode}>{`${loading ? "Sending..." : "Send verification code"}`}</button>

      <div className="form-container">
        <form className="inner-container" onSubmit={handleSubmit}>
          <h2 className="inner-title">Verify User</h2>
          <div className="form-group">
            <label className="inner-label">Confirmation code</label>
            <input
              className="form-control"
              type="text"
              name="code"
              placeholder="e.g. 789654"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {codeError && <p className="error">{codeError}</p>}
          </div>

          <div className="form-group">
            <input 
              className="button" 
              type="submit" 
              value={`${loading ? "Verifying..." : "Verify"}`} 
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyUser;
