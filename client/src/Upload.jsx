import PropTypes from "prop-types";
import { useState } from "react";

const Upload = ({ uploadFile, setUploadFile, filePath, user, fetchData }) => {
  const handleClick = () => {
    setUploadFile(!uploadFile);
  };

  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const sendFile = (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filePath", filePath);

      fetch("/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("File uploaded successfully");
          console.log(data);
          fetchData(user, filePath);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          fetchData(user, filePath);
        });
    }
    fetchData(user, filePath);
    handleClick();
  };

  return (
    <>
      <form
        onSubmit={sendFile}
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
              <h5 className="modal-title">Prześlij plik</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleClick}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                <input
                  className="form-control"
                  type="file"
                  onChange={handleFileChange}
                />
              </p>
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
              <button type="submit" className="btn btn-success">
                Prześlij
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

Upload.propTypes = {
  uploadFile: PropTypes.bool.isRequired,
  setUploadFile: PropTypes.func.isRequired,
  filePath: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
};

export default Upload;
