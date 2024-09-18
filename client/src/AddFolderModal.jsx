import PropTypes from "prop-types";
import { useState } from "react";

const AddFolderModal = ({
  setCreateFolder,
  filePath,
  fetchData,
  user,
  createFolder,
  setErr,
}) => {
  const handleClick = () => {
    setCreateFolder(!createFolder);
  };

  const [name, setName] = useState("");

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const addFolder = () => {
    if (name.match(/[\\/:*?"<>|]/)) {
      setErr(true);
      setTimeout(() => {
        setErr(false);
      }, 3000);
    } else {
      fetch("/add-folder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath: filePath, name: name }),
      })
        .then((response) => {
          if (response.ok) {
            fetchData(user, filePath);
            console.log("Folder added successfully");
          } else {
            console.error("Error:", response.status);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    handleClick();
  };
  return (
    <>
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
              <h5 className="modal-title">Dodawanie folderu</h5>
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
                  placeholder="Nazwa folderu: "
                  type="text"
                  onChange={handleChange}
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
              <button
                type="button"
                className="btn btn-success"
                onClick={addFolder}
              >
                Dodaj
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

AddFolderModal.propTypes = {
  setCreateFolder: PropTypes.func.isRequired,
  filePath: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired,
  createFolder: PropTypes.bool.isRequired,
  setErr: PropTypes.func.isRequired,
};

export default AddFolderModal;
