const DeleteModal = ({ closeDeleteModal, title, id, deleteData }) => {
  // 載入狀態 綁住disabled
  return (
    <>
      <div
        className="modal fade"
        id="deleteModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-danger">
              <h2 className="modal-title fs-5 fw-bold text-light">確認刪除</h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeDeleteModal}
              ></button>
            </div>
            <div className="modal-body"> {title}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeDeleteModal}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => deleteData(id)}
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
