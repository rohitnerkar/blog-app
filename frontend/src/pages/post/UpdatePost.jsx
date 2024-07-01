import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import addPostValidator from "../../validators/addPostValidator";

const initialFormData = {
  title: "",
  desc: "",
  category: "",
};

const initialFormError = {
  title: "",
  category: "",
};

const UpdatePost = () => {

  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [extensionError, setExtensionError] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [isDisable, setIsDisable] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const postId = params.id;

  useEffect(() => {
    if(postId){
      const getPost = async () => {
        try {
          const response = await axios.get(`/posts/${postId}`);
          const data = response.data.data;

          setFormData({ 
            title: data.post.title,
            desc: data.post.desc,
            category: data.post.category._id,
            file: data.post?.file?._id,
          });
        } catch (error) {
          const response = error.response;
          const data = response.data;
          
          toast.error(data.message, {
            position: "top-right",
            autoClose: true,
          });
        }
      }

      getPost();
    }
  }, [postId]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(`/category?size=1000`);
        const data = response.data.data;
        setCategories(data.categories);
      } catch (error) {
        const response = error.response;
        const data = response.data;
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
        });
      }
    };

    getCategories();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = addPostValidator({ title: formData.title, category: formData.category });
    if (errors.title || errors.category) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);

        let input = formData;

        if(fileId){
          input = {...input, file: fileId}
        }

        const response = await axios.put(`/posts/${postId}`, input);
        const data = response.data;

        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });
        setFormData(initialFormData);
        setFormError(initialFormError);
        setLoading(false);
        navigate(`/posts/detail-post/${postId}`);
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

  const handleFileChange = async (e) => {
    const formInput = new FormData();
    formInput.append("image", e.target.files[0]);

    const type = e.target.files[0].type;

    if (type === "image/png" || type === "image/jpg" || type === "image/jpeg") {
      setExtensionError(null);

      try {
        setIsDisable(true);
        const response = await axios.post("/file/upload", formInput);
        const data = response.data;
        setFileId(data.data._id);

        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });
        setIsDisable(false);
      } catch (error) {
        setIsDisable(false);
        const response = error.response;
        const data = response.data;
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
        });
      }
    } else {
      setExtensionError("Only .png or .jpg or .jpeg file allowed");
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

      <div className="form-container">
        <form className="inner-container" onSubmit={handleSubmit}>
          <h2 className="inner-title">Update Post</h2>
          <div className="form-group">
            <label className="inner-label">Title</label>
            <input
              className="form-control"
              type="text"
              name="title"
              placeholder="React blog post"
              value={formData.title}
              onChange={handleChange}
            />
            {formError.title && <p className="error">{formError.title}</p>}
          </div>

          <div className="form-group">
            <label className="inner-label">Description</label>
            <textarea
              className="form-control"
              type="text"
              name="desc"
              placeholder="Lorem ipsum"
              value={formData.desc}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="inner-label">Select an image</label>
            <input
              className="form-control"
              type="file"
              name="file"
              placeholder="Lorem ipsum"
              onChange={handleFileChange}
            />
            {extensionError && <p className="error">{extensionError}</p>}
          </div>

          <div className="form-group">
            <label className="inner-label">Select a category</label>
            <select className="form-control" name="category" value={formData.category} onChange={handleChange}>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
            {formError.category && <p className="error">{formError.category}</p>}
          </div>

          <div className="form-group">
            <input 
              className="button" 
              type="submit" 
              disabled={isDisable} 
              value={`${loading ? "Updating..." : "Update"}`} 
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
