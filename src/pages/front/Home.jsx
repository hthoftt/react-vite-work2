import { useEffect, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const colRef = useRef(null);
  const bodyImgRef = useRef(null);
  const cardRef = useRef(null);
  const { allProducts, feedback } = useOutletContext();

  useEffect(() => {
    const cards = colRef.current.querySelectorAll(".col");
    if (cards.length === 0) return;

    const observer1 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(cards).indexOf(entry.target);
            setTimeout(() => {
              entry.target.classList.add("show");
            }, index * 300); // 每張卡片延遲 300ms
            observer1.unobserve(entry.target); // 只解除該卡片的監聽
          }
        });
      },
      { threshold: 0.2 },
    );

    cards.forEach((card) => observer1.observe(card)); // ✅ 逐一監聽每張卡片

    const observer2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            bodyImgRef.current.classList.add("show");
            observer2.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );

    if (bodyImgRef.current) {
      observer2.observe(bodyImgRef.current);
    }
    return () => {
      observer1.disconnect();
      observer2.disconnect();
    };
  }, [allProducts]);

  useEffect(() => {
    const cards = cardRef.current.querySelectorAll(".card");
    if (cards.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(cards).indexOf(entry.target);
            setTimeout(() => {
              entry.target.classList.add("show");
            }, index * 300); // 每張卡片延遲 300ms
            observer.unobserve(entry.target); // 只解除該卡片的監聽
          }
        });
      },
      { threshold: 0.2 },
    );

    cards.forEach((card) => observer.observe(card)); // ✅ 逐一監聽每張卡片

    return () => {
      observer.disconnect();
    };
  }, [feedback]);

  return (
    <div className="home lxgw-wenkai-tc-regular">
      <div className="body1">
        <div className="text1">
          二手服飾
          <br />& 潮流品牌
        </div>
        <hr />
        <div className="text2">
          <div className="text2-left me-auto p-2">始於 1998</div>
          <div className="text2-center">
            穿出你的故事，
            <br />
            借我穿一下。
          </div>
          <Link className="text2-end" to={"/products"}>
            Products<i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
      <div className="body2">
        <div className="body2-text1">
          <div className="body2-text1-1">簡介</div>
          <div className="body2-text1-2">
            「借我穿一下」是一個主打二手潮流服飾的共享平台，讓時尚不再侷限於擁有，而是自由體驗。這裡匯集街頭、復古與設計品牌，提供租借、交換與販售服務。用輕鬆的方式探索穿搭靈感，讓每件衣服都能被再次喜愛、再次穿上。
          </div>
        </div>
        <div className="body2-text2">
          <div className="body2-text2-1">
            <div className="body2-text2-1-1">
              推廣永續時尚：讓舊衣有新生命，減少浪費。
              <br />
              創造共享潮流：提供租借、交換、購買的多元方式。
              <br />
              打造潮流社群：讓喜歡街頭、復古、設計品牌的人聚集交流。
              <br />
              提供平價時尚：用更低的成本享受高質感穿搭。
            </div>
            <div className="body2-text2-1-2">
              <Link
                className="body-text2-1-2-link"
                to={"/about"}
                onClick={() => window.scrollTo(0, 0)}
              >
                Learn More <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1588416643538-56bfaf66c742?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="圖片"
            className="body2-text2-2"
            ref={bodyImgRef}
          />
        </div>
      </div>
      <div className="body3 mx-4">
        <div className="body3-1">最新潮流</div>
        <div className="body3-2 row row-cols-1 row-cols-md-4 g-2" ref={colRef}>
          {allProducts.slice(1, 5).map((product) => (
            <div className="col" key={product.id}>
              <div className="card h-100">
                <img
                  src={product.imageUrl}
                  className="card-img-top"
                  alt="圖片"
                />
                <div className="card-body">
                  <Link className="card-title" to={`/products/${product.id}`}>
                    {product.title}
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                  <p className="card-text my-3">{product.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="blog">
        <div className="blog-title">
          <div className="blog-title-1">顧客回饋</div>
        </div>
        <div className="blogCard" ref={cardRef}>
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
                        <div className="form-floating card-title">
                          {mes.title}
                        </div>
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
      </div>
    </div>
  );
};

export default Home;
