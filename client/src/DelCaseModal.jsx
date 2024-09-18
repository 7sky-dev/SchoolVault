import PropTypes from "prop-types";

const DelCaseModal = ({ setDelCase, signature, fetchCases, handleClick }) => {
  const handleClose = () => {
    setDelCase(false);
  };

  const handleSubmit = async () => {
    fetch("/delete-case", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ signature: signature }),
    })
      .then((response) => response.json())
      .then((data) => {
        handleClick("", "", "", "", "", "", "", "", "");
        fetchCases();
        console.log(data);
        handleClose();
      })
      .catch((error) => {
        console.error("Error", error);
      });
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
            <h5 className="modal-title">Usuń</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>Czy na pewno chcesz usunąć akta o sygnaturze: {signature}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={handleClose}
            >
              Anuluj
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleSubmit}
            >
              Usuń
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DelCaseModal.propTypes = {
  setDelCase: PropTypes.func.isRequired,
  signature: PropTypes.string.isRequired,
  fetchCases: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default DelCaseModal;
