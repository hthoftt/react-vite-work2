import { useEffect, useRef } from "react";

const About = () => {
  const storyImgRef = useRef(null);
  const cardsRef = useRef(null);
  const team = [
    {
      name: "林子皓",
      text: "熱愛潮流文化與設計，擅長前端開發與平台架構。他希望透過科技打造共享時尚的舞台，讓二手服飾能以更直覺的方式被探索與喜愛。",
      img: "https://images.unsplash.com/photo-1673972249408-2cd76cb69831?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "陳雅雯",
      text: "專注於永續時尚與品牌行銷，擁有服裝設計背景。她致力推廣環保理念，讓每件衣服不只是商品，而是延續故事的載體。",
      img: "https://images.unsplash.com/photo-1731335095798-1af97efcbe2a?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "王承翰",
      text: "擁有電商運營與社群經營經驗，擅長用數據洞察消費者需求。他希望建立一個潮流社群，讓共享服飾成為年輕人展現態度的新選擇。",
      img: "https://images.unsplash.com/photo-1613425757001-dc238f3a077d?q=80&w=711&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  useEffect(() => {
    const cards = cardsRef.current.querySelectorAll(".card");
    const observeCards = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.classList.add("show");
              }, i * 400);
            });
            observeCards.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );

    const observeStoryImg = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            storyImgRef.current.classList.add("show");
            observeStoryImg.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );

    if (cardsRef.current) {
      observeCards.observe(cardsRef.current);
    }
    if (storyImgRef.current) {
      observeStoryImg.observe(storyImgRef.current);
    }

    return () => {
      observeCards.disconnect();
      observeStoryImg.disconnect();
    };
  }, []);

  return (
    <>
      <div className="about">
        <div className="about-text1">
          <div className="about-text1-1">起源</div>
          <div className="about-text1-2">始於 1998</div>
        </div>
        <div className="about-text2">
          「借我穿一下」以永續時尚為核心理念，推廣共享、再利用的潮流文化。讓每件衣服不只是物品，而是故事的延續。透過租借與交換，減少浪費、創造價值，讓時尚成為一種環保又有態度的生活方式。
        </div>
      </div>
      <div className="story">
        <div className="story-text1">
          <div className="story-text1-2 mx-3">故事</div>
          <div className="story-text1-3 mx-3">
            「借我穿一下」誕生於一次衣櫃整理的靈感。創辦人發現許多質感良好的衣服被閒置，卻仍有價值與故事，於是萌生「讓衣服再次被穿上」的想法。從朋友間的分享開始，逐漸形成一個以共享為核心的潮流社群。品牌希望透過租借、交換與販售，讓每件衣服都能延續生命，讓時尚不再只是消費，而是一種循環的生活態度。這個平台不僅是交易的場所，更是推動永續時尚與個人風格交流的起點。
          </div>
        </div>
        <div className="story-text2">
          <img
            src="https://images.unsplash.com/photo-1598681801564-6c576313d410?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="品牌故事"
            className="story-img"
            ref={storyImgRef}
          />
        </div>
      </div>
      <div className="associats" ref={cardsRef}>
        <div className="associats-name">創辦人</div>
        {team.map((member) => {
          return (
            <div className="card mb-3" key={member.name}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={member.img}
                    className="img-fluid rounded-start"
                    alt={member.name}
                    loading="lazy"
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{member.name}</h5>
                    <p className="card-text">
                      <i>合夥人</i>
                      <br />
                      {member.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default About;
