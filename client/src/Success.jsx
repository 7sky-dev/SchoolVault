import PropTypes from "prop-types";

export const Success = ({ text, setErr }) => {
  const handleClose = () => {
    setErr(false);
  };

  const getDate = () => {
    const current = new Date();
    const date = `${current.getDate()}/${
      current.getMonth() + 1
    }/${current.getFullYear()}`;
    return date;
  };
  return (
    <div
      className="toast w-25"
      style={{
        display: "block",
        position: "absolute",
        top: "8vh",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="toast-header">
        <svg
          className="bd-placeholder-img rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <rect width="100%" height="100%" fill="#198754"></rect>
        </svg>
        <strong className="me-auto">Sukces!</strong>
        <small>{getDate()}</small>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
          onClick={handleClose}
        ></button>
      </div>
      <div className="toast-body fw-bold">{text}</div>
    </div>
  );
};

Success.propTypes = {
  text: PropTypes.func.isRequired,
  setErr: PropTypes.func.isRequired,
};
