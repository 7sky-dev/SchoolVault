import PropTypes from "prop-types";
import Modal from "./Modal";
import { useState } from "react";

const File = ({
  user,
  name,
  filePath,
  setFilePath,
  directoryPath,
  fetchData,
}) => {
  const hasDot = name.includes(".");

  const handleFileClick = async (e) => {
    const fp = filePath + "/" + e.target.value;
    const fullPath = `${directoryPath}/client/public${fp}`;

    try {
      const response = await fetch("/open-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullPath }),
      });

      if (response.ok) {
        const fileBlob = await response.blob();
        const fileURL = URL.createObjectURL(fileBlob);
        window.open(fileURL, "_blank");
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [modal, setModal] = useState(false);
  const [del, setDel] = useState("");

  const handleDeleteFolder = (e) => {
    const name = e.target.value;
    const fp = filePath + "/" + e.target.value;
    const fullPath = `${directoryPath}/client/public${fp}`;
    handleDelete(fullPath, name);
  };

  const handleDeleteFile = (e) => {
    const name = e.target.value;
    const fp = filePath + "/" + e.target.value;
    const fullPath = `${directoryPath}/client/public${fp}`;
    handleDelete(fullPath, name);
  };

  const handleDelete = (x, y) => {
    if (y != undefined) {
      setFileName(y);
      setDel(x);
    }
    setModal(true);
  };

  const [fileName, setFileName] = useState("");

  const handleFolderClick = async (e) => {
    setFilePath(filePath + "/" + e.target.value);
  };

  return (
    <>
      {hasDot ? (
        <div className="d-flex">
          <button
            className="btn btn-danger mt-4 ms-2"
            onClick={handleDeleteFolder}
            value={name}
            style={{ borderRadius: "0.25rem 0 0 0.25rem" }}
          >
            X
          </button>
          <button
            onClick={handleFileClick}
            value={name}
            style={{ borderRadius: "0 0.25rem 0.25rem 0" }}
            className="mt-4 me-2 d-flex justify-content-center align-items-center btn btn-warning"
          >
            <i className="bi bi-file-earmark me-1"></i> {name}
          </button>
        </div>
      ) : (
        <div className="d-flex">
          <button
            className="btn btn-danger mt-4 ms-2"
            onClick={handleDeleteFile}
            value={name}
            style={{ borderRadius: "0.25rem 0 0 0.25rem" }}
          >
            X
          </button>
          <button
            onClick={handleFolderClick}
            value={name}
            style={{ borderRadius: "0 0.25rem 0.25rem 0" }}
            className="mt-4 me-2 d-flex justify-content-center align-items-center btn btn-warning"
          >
            <i className="bi bi-folder me-1"></i> {name}
          </button>
        </div>
      )}

      {modal ? (
        <Modal
          user={user}
          filePath={del}
          title={fileName}
          body="Czy na pewno chcesz usunąć ten plik?"
          sub="Usuń"
          color="btn-danger"
          setModal={setModal}
          fetchData={fetchData}
        ></Modal>
      ) : null}
    </>
  );
};

File.propTypes = {
  user: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  filePath: PropTypes.string.isRequired,
  setFilePath: PropTypes.func.isRequired,
  directoryPath: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
};

export default File;
