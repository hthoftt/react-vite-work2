const Store = () => {
  return (
    <div className="store">
      <div className="store-title">
        <div className="store-title-1">實體店面(虛構)</div>
      </div>
      <div className="row">
        <div className="col map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d34373.604048761306!2d121.54540978040981!3d25.09915134265451!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a80291b1b5f9%3A0xb891f90afecb5572!2z5p6X5pys5rqQ5Zut6YK4!5e0!3m2!1szh-CN!2stw!4v1791174640332!5m2!1szh-CN!2stw"
            style={{ border: "0" }}
            title="借我穿一下 實體店面地圖"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="googlemap"
          ></iframe>
        </div>
        <div className="col">
          <div className="mb-3">
            <div className="fw-bold mb-1">店名: 借我穿一下</div>
          </div>
          <div className="mb-3">
            <div className="fw-bold mb-1">店面地址:</div>
            <div>220新北市板橋區留侯里西門街9號</div>
          </div>
          <div className="mb-3">
            <div className="fw-bold mb-1">營業時間:</div>
            <div>
              一 ~ 四: 10:00 ~ 18:00 <br />五 ~ 日: 10:00 ~ 20:00
            </div>
          </div>
          <div className="mb-3">
            <div className="fw-bold mb-1">聯絡電話:</div>
            <div>0912345678</div>
          </div>
          <div className="mb-3">
            <div className="fw-bold mb-1">交通方式:</div>
            <div>
              🚇捷運:
              <br />
              板橋站，出站後步行約 10–15 分鐘即可抵達
              <br />
              🚌公車:
              <br />
              可搭乘公車264、701、702、793至林家花園站 <br />
              🚗開車:
              <br />
              建議導航至「西門街 9 號」附近停車場停車,再步行抵達
            </div>
          </div>
          <div>
            <div className="fw-bold mb-1">提供的服務:</div>
            <div>試穿、現場諮詢</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
