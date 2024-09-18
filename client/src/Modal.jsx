import PropTypes from "prop-types";

const Modal = ({
  title,
  body,
  sub,
  color,
  setModal,
  filePath,
  fetchData,
  user,
}) => {
  const handleClick = () => {
    setModal(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/del-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullPath: filePath }),
      });

      const directoryName = user;

      const parentDirPath = filePath.substring(
        filePath.indexOf(directoryName) - 1,
        filePath.lastIndexOf("/")
      );

      console.log(parentDirPath);

      if (response.ok) {
        console.log("ok");
        fetchData(user, parentDirPath);
      } else {
        console.log("Err");
        fetchData(user, parentDirPath);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    handleClick();
  };

  return (
    <div
      className="modal"
      style={{
        display: "block",
      }}
    >
      <div
        className="modal-dialog w-50"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleClick}
            ></button>
          </div>
          <div className="modal-body">
            <p>{body}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={handleClick}
            >
              Anuluj
            </button>
            <button
              type="button"
              className={"btn " + color}
              onClick={handleSubmit}
            >
              {sub}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  sub: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  setModal: PropTypes.func.isRequired,
  filePath: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired,
};

export default Modal;
