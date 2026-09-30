import axios from "axios";
import { useEffect, useState } from "react";

const Blog = () => {
  const [feedback, setFaceback] = useState([]);

  const getFeedback = async (page = 1) => {
    const res = await axios.get(
      `/v2/api/${import.meta.env.VITE_APP_API_PATH}/articles?page=${page}`,
    );
    setFaceback(res.data.articles);
  };
  useEffect((page) => {
    getFeedback();
  }, []);

  return (
    <div className="blog">
      <div className="blog-title">
        <div className="blog-title-1">顧客回饋</div>
        <div>All posts</div>
      </div>
      {feedback?.map((mes) => {
        const backToDate = new Date(mes.create_at * 1000);
        const messageData = backToDate.toISOString().slice(5, 10);
        if (mes.isPublic) {
          return (
            <div className="card mb-3" key={mes.id}>
              <div className="card-body">
                <div className="body-title">
                  <i className="bi bi-person-circle"></i>
                  <div>
                    <div className="form-floating card-title">{mes.title}</div>
                    <div>{messageData}</div>
                  </div>
                </div>
                <div className="form-floating my-3 card-description">
                  {mes.description}
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Blog;
