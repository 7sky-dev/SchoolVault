import PropTypes from "prop-types";
import File from "./File";
import AddFolderModal from "./AddFolderModal";
import Upload from "./Upload";
import { useEffect, useState } from "react";
import { Error } from "./Error";

const Files = ({ user, err, setErr }) => {
  const [data, setData] = useState([]);
  const [filePath, setFilePath] = useState("/" + user);
  const [directoryPath, setDirectoryPath] = useState("");

  useEffect(() => {
    fetchData(user, filePath);
  }, [filePath]);

  useEffect(() => {
    fetchDirectoryPath();
  });

  const fetchDirectoryPath = async () => {
    try {
      const response = await fetch("/get-directory", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setDirectoryPath(data);
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const check = () => {
    const str = filePath;
    const charToCount = "/";

    const count = str.split(charToCount).length - 1;

    if (count >= 2) {
      return true;
    } else {
      return false;
    }
  };

  const goBack = () => {
    const str = filePath;
    const charToSplit = "/";

    const lastIndexOfChar = str.lastIndexOf(charToSplit);
    const result = str.substring(0, lastIndexOfChar);
    setFilePath(result);
  };

  const fetchData = async (user, filePath) => {
    try {
      const response = await fetch("/get-files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, filePath }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData == "File") {
          return;
        }
        setData(responseData);
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [createFolder, setCreateFolder] = useState(false);
  const handleCreateFolder = () => {
    setCreateFolder(!createFolder);
  };

  const [uploadFile, setUploadFile] = useState(false);
  const handleUploadFile = () => {
    setUploadFile(!uploadFile);
  };

  return (
    <main className="w-100 mt-2">
      <div className="container">
        {createFolder ? (
          <AddFolderModal
            err={err}
            setErr={setErr}
            user={user}
            fetchData={fetchData}
            filePath={filePath}
            createFolder={createFolder}
            setCreateFolder={setCreateFolder}
          ></AddFolderModal>
        ) : null}

        {uploadFile ? (
          <Upload
            filePath={filePath}
            uploadFile={uploadFile}
            setUploadFile={setUploadFile}
            user={user}
            fetchData={fetchData}
          ></Upload>
        ) : null}
        {err ? (
          <Error
            setErr={setErr}
            text={
              'Nazwa folderu nie może zawierać żadnego z tych znaków \\ / : * ? " < > |'
            }
          ></Error>
        ) : null}
        <h1 className="text-center">Moje pliki</h1>
        <div>
          {check() ? (
            <button onClick={goBack} className="btn btn-secondary me-2">
              Powrót
            </button>
          ) : null}
          <button className="btn btn-primary me-2" onClick={handleCreateFolder}>
            Stwórz folder
          </button>
          <button className="btn btn-primary me-2" onClick={handleUploadFile}>
            Dodaj plik
          </button>
        </div>
        <hr />
        <span className="text-secondary mt-2 ms-2 w-100">
          <i>{filePath}</i>
        </span>
        <div className="d-flex flex-wrap">
          {data &&
            data.map((item) => (
              <File
                key={item.id}
                item={item}
                name={item.name}
                user={user}
                filePath={filePath}
                setFilePath={setFilePath}
                directoryPath={directoryPath}
                fetchData={fetchData}
              />
            ))}
        </div>
      </div>
    </main>
  );
};

Files.propTypes = {
  user: PropTypes.string.isRequired,
  err: PropTypes.string.isRequired,
  setErr: PropTypes.func.isRequired,
};

export default Files;
