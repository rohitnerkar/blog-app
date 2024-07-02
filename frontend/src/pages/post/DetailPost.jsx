import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const DetailPost = () => {

  const [post, setPost] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const postId = params.id;

  useEffect(() => {
    if(postId){
      const getPost = async () => {
        try {
          const response = await axios.get(`/posts/${postId}`);
          const data = response.data.data;

          setPost(data.post);

          // console.log(data)
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
    if(post && post?.file){
      const getFile = async () => {
        try {
          const response = await axios.get(`/file/signed-url?key=${post.file.key}`);
          const data = response.data.data;

          setFileUrl(data.url);
        } catch (error) {
          const response = error.response;
          const data = response.data;
          
          toast.error(data.message, {
            position: "top-right",
            autoClose: true,
          });
        }
      }

      getFile();
    }
  }, [post]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/posts/${postId}`);
      
      setShowModal(false);

      const data = response.data;
      toast.success(data.message, {
        position: "top-right",
        autoClose: true,
      });
      navigate("/posts")
    } catch (error) {
      setShowModal(false);
      const response = error.response;
      const data = response.data;
        
      toast.error(data.message, {
        position: "top-right",
        autoClose: true,
      });
    }
  };

  return (
    <div className="main-home-div">
      <button
        style={{margin:"10px"}}
        className="back-button"
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
      
      <button 
        style={{color:"blue"}}
        className="detailpost-button"
        onClick={() => navigate(`/posts/update-post/${postId}`)}
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>

      <button 
        style={{color:"red"}}
        className="detailpost-button"
        onClick={() => setShowModal(true)}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>

      <div className="detail-container">
        <h2 className="post-title">{post?.title}</h2>
        <h5 className="post-category">Category: {post?.category?.title}</h5>
        <h5 className="post-category">Created at: {moment(post?.createdAt).format("YYYY-MM-DD HH:mm:ss")}</h5>
        <h5 className="post-category">Updated at: {moment(post?.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</h5>
        <p className="post-desc">{post?.desc}</p>

        <img src={fileUrl} alt="mern" />
      </div>

      <Modal show={showModal} 
        onHide={() => {
          setShowModal(false);
        }}>
        <Modal.Header closeButton={true}>
          <Modal.Title>Are you sure you want to delete post?</Modal.Title>
        </Modal.Header>

        <Modal.Footer>
          <div style={{ margin: "0 auto" }}>
            <button 
              className="no-button" 
              onClick={() => {
                setShowModal(false);
              }}
            >
              No
            </button>

            <button className="yes-button" onClick={handleDelete}>Yes</button>
          </div>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default DetailPost;
