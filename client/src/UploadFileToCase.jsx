import { useState } from "react";
import { Error } from "./Error";
import PropTypes from "prop-types";

const UploadFileToCase = ({
  setUpload,
  identifier,
  setSignature,
  setSuccess,
}) => {
  const [err, setErr] = useState(false);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (file != null) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("identifier", identifier);

      fetch("/upload-to-case", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message != "Katalog przekracza dozwolony rozmiar (1 GB).") {
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              setSignature("");
              handleClick();
            }, 1500);
          } else {
            setText("Katalog przekracza dozwolony rozmiar (1 GB).");
            setErr(true);
            setTimeout(() => {
              setErr(false);
            }, 1500);
          }
        })
        .catch((error) => {
          setText("Błąd poczas wysyłania pliku.");
          setErr(true);
          setTimeout(() => {
            setErr(false);
            handleClick();
          }, 1500);
          console.error("Error uploading file:", error);
        });
    } else {
      setText("Błąd podczas wysyłania pliku!");
      setErr(true);
      setTimeout(() => {
        setErr(false);
        handleClick();
      }, 1500);
    }
  };

  const handleClick = () => {
    setUpload(false);
  };

  return (
    <>
      {err ? <Error setErr={setErr} text={text}></Error> : null}
      <form
        className="modal"
        style={{
          display: "block",
        }}
        onSubmit={submitForm}
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
                  className="form-control mt-2"
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

export default UploadFileToCase;

UploadFileToCase.propTypes = {
  setUpload: PropTypes.func.isRequired,
  identifier: PropTypes.string.isRequired,
  setSignature: PropTypes.func.isRequired,
  setSuccess: PropTypes.func.isRequired,
};
