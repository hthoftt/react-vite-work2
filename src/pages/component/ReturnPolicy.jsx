// 商品詳細頁的換退貨說明(作品展示用範例,非真實店家規定)
const steps = [
  { title: "聯繫客服", text: "收到商品 7 天內(鑑賞期),來信或私訊客服,告知訂單編號與換退貨原因。" },
  { title: "填寫申請", text: "客服回覆申請表單,填寫換貨尺寸或退款帳戶,並附上商品照片。" },
  { title: "寄回商品", text: "商品保持原狀、吊牌未拆,連同發票以超商店到店寄回。" },
  { title: "完成處理", text: "收到商品後 3–5 個工作天內完成換貨寄出或退款。" },
];

const notes = [
  "二手商品皆已於商品頁標示瑕疵,標示內的瑕疵不在退換範圍。",
  "已下水清洗、修改尺寸或人為損壞的商品恕不退換。",
  "商品瑕疵或寄錯由我們負擔運費;個人因素退換貨,運費由買家負擔。",
];

const ReturnPolicy = () => (
  <div className="return-policy">
    <details>
      <summary>
        <i className="bi bi-arrow-repeat me-2"></i>換退貨流程
        <span className="return-policy-tag">範例</span>
      </summary>
      <ol className="return-steps">
        {steps.map((step) => (
          <li key={step.title}>
            <strong>{step.title}</strong>
            <span>{step.text}</span>
          </li>
        ))}
      </ol>
    </details>
    <details>
      <summary>
        <i className="bi bi-info-circle me-2"></i>注意事項
      </summary>
      <ul className="return-notes">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </details>
    <p className="return-policy-hint">
      <i className="bi bi-truck me-2"></i>滿 NT$1,000 免運・7 天鑑賞期
    </p>
  </div>
);

export default ReturnPolicy;
