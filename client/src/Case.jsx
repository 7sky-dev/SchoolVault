import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Assing from "./Assing";
import Reject from "./Reject";
import UploadFileToCase from "./UploadFileToCase";
import { Success } from "./Success";
import DelCaseModal from "./DelCaseModal";

const Case = ({ data, fetchCases, setPage }) => {
  const [signature, setSignature] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [assing, setAssing] = useState(false);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState("");
  const [users, setUsers] = useState([]);
  const [made, setMade] = useState("");
  const [done, setDone] = useState("");
  const [realization, setRealization] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [delCase, setDelCase] = useState(false);

  const fetchAllowed = (e) => {
    fetch("/get-allowed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ signature: e }),
    })
      .then((response) => response.json())
      .then((data) => {
        const users = data.map((item) => ({
          user: item.user,
          status: item.status,
          description: item.description,
        }));
        setUsers(users);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const deleteCase = () => {
    setDelCase(true);
  };

  const [files, setFiles] = useState([]);

  const handleClick = async (
    signature,
    title,
    body,
    status,
    user,
    made,
    done,
    realization,
    message
  ) => {
    setSignature(signature);
    setTitle(title);
    setBody(body);
    setStatus(status);
    setUser(user);
    setMade(made);
    setDone(done);
    setRealization(realization);
    setMessage(message);

    try {
      const response = await fetch("/get-case-files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signature: signature }),
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      } else {
        console.error("Error fetching files:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handlePrzydzielClick = () => {
    setAssing(true);
  };

  const acceptPending = async () => {
    try {
      const response = await fetch("/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signature: signature }),
      });

      if (response.ok) {
        fetchCases();
        setPage("ZST");
      } else {
        console.error("Błąd podczas wysyłania żądania do serwera");
      }
    } catch (error) {
      console.error("Wystąpił błąd:", error.message);
    }
    handleClick("", "", "", "", "", "", "", "", "");
  };

  const [reject, setReject] = useState(false);
  const [rejection, setRejection] = useState(false);

  const rejectCase = () => {
    setReject(true);
  };

  useEffect(() => {
    checkRejection();
  }, [reject]);

  const checkRejection = async () => {
    if (rejection) {
      try {
        const response = await fetch("/reject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ signature: signature }),
        });

        if (response.ok) {
          fetchCases();
          setPage("ZST");
        } else {
          console.error("Błąd podczas wysyłania żądania do serwera");
        }
      } catch (error) {
        console.error("Wystąpił błąd:", error.message);
      }
      handleClick("", "", "", "", "", "", "", "", "");
    } else {
      null;
    }
  };
  const endCase = async () => {
    try {
      const response = await fetch("/end-case", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signature: signature }),
      });
      if (response.ok) {
        fetchCases();
      } else {
        console.error("Błąd podczas wysyłania żądania do serwera");
      }
    } catch (error) {
      console.error("Wystąpił błąd:", error.message);
    }
    handleClick("", "", "", "", "", "", "", "", "");
  };

  const [upload, setUpload] = useState(false);

  const handleUploadClick = () => {
    setUpload(true);
  };

  return (
    <>
      {delCase ? (
        <DelCaseModal
          setDelCase={setDelCase}
          signature={signature}
          fetchCases={fetchCases}
          handleClick={handleClick}
        ></DelCaseModal>
      ) : null}
      {success ? (
        <Success setErr={setSuccess} text={"Pomyślnie dodano plik."}></Success>
      ) : null}
      {upload ? (
        <UploadFileToCase
          setUpload={setUpload}
          identifier={signature}
          setSignature={setSignature}
          setSuccess={setSuccess}
        ></UploadFileToCase>
      ) : null}
      {reject ? (
        <Reject
          setReject={setReject}
          setRejection={setRejection}
          signature={signature}
        ></Reject>
      ) : null}
      {assing ? (
        <Assing setAssing={setAssing} signature={signature}></Assing>
      ) : null}
      {signature == "" ? (
        data.map((object, index) => (
          <>
            {object.status == "rejected" ? null : (
              <button
                key={index}
                className={
                  object.status == "accepted" || object.status == "made"
                    ? "btn btn-warning ps-5 pe-5 pt-3 pb-3 m-2"
                    : object.status == "done"
                    ? "btn btn-success ps-5 pe-5 pt-3 pb-3 m-2"
                    : "btn btn-dark ps-5 pe-5 pt-3 pb-3 m-2"
                }
                onClick={() => {
                  handleClick(
                    object.signature,
                    object.title,
                    object.body,
                    object.status,
                    object.user,
                    object.made,
                    object.done,
                    object.realization,
                    object.message
                  );
                  fetchAllowed(object.signature);
                }}
              >
                <div value={object.signature}>
                  <p className="fw-bold text-center ">{object.signature}</p>
                  {object.title}
                  <hr />
                  <i>Od: {object.user}</i>
                  <br />
                  {object.status == "done" ? (
                    <i className="text-warning">Zadanie zakończone</i>
                  ) : (
                    <i className="text-danger">{object.realization}</i>
                  )}
                </div>
              </button>
            )}
          </>
        ))
      ) : (
        <>
          <div className="w-100 border rounded d-flex flex-wrap justify-content-center align-items-center">
            <div className="d-flex justify-content-center align-items-center p-2 w-100">
              <button
                className="btn btn-secondary w-auto mx-auto"
                onClick={() => handleClick("", "", "", "", "", "", "", "", "")}
              >
                Powrót
              </button>
              <span className="text-center fw-bold fs-3 w-75 mx-auto">
                {title}
              </span>
              <div className="d-flex flex-column justify-content-center align-items-center mx-auto">
                <i className="text-secondary">{user}</i>
                <div>
                  <i className="text-success">{made}</i>
                </div>
              </div>
            </div>
            <hr className="m-0" style={{ flexBasis: "100%" }} />
            <div className="p-2 mt-2 w-75">{body}</div>
            <div className="p-2 w-100">
              <i className="text-secondary m-4">Dostępne pliki:</i>
              <div>
                <ul>
                  {files.map((fileData, index) => (
                    <li key={index}>
                      <a
                        href={`/akta/${signature}/${fileData.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {fileData.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <hr className="m-0" style={{ flexBasis: "100%" }} />
            <div className="p-2 w-100 d-flex flex-wrap justify-content-end">
              {status == "made" ? (
                <>
                  <button className="btn btn-danger" onClick={deleteCase}>
                    Usuń
                  </button>
                  <button
                    className="btn btn-info w-auto ms-2"
                    onClick={handlePrzydzielClick}
                  >
                    Przydziel
                  </button>
                  <button
                    className="btn btn-warning w-auto ms-2"
                    onClick={handleUploadClick}
                  >
                    Dodaj plik
                  </button>
                  <button
                    className="btn btn-success w-auto ms-2"
                    onClick={endCase}
                  >
                    Zakończ
                  </button>
                </>
              ) : null}
              {status == "done" ? (
                <>
                  <div className="w-100">
                    <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                      <i className="text-success fw-bold">
                        Data zakończenia: {done}
                      </i>
                      <button
                        className="btn btn-danger d-flex justify-content-center align-items-center w-25 mt-2"
                        onClick={deleteCase}
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
              {status == "pending" ? (
                <>
                  <button className="btn btn-danger" onClick={rejectCase}>
                    Odrzuć
                  </button>
                  <button
                    className="btn btn-success ms-2"
                    onClick={acceptPending}
                  >
                    Zaakceptuj
                  </button>
                </>
              ) : null}
              {status == "accepted" ? (
                <>
                  <button
                    className="btn btn-warning w-auto me-2"
                    onClick={handleUploadClick}
                  >
                    Dodaj plik
                  </button>
                  <button className="btn btn-danger" onClick={rejectCase}>
                    Zrezygnuj
                  </button>
                </>
              ) : null}
            </div>
          </div>
          <div className="m-3 text-secondary d-flex flex-row w-100">
            {status == "done" ? null : (
              <div className="w-50">
                <i>Twoje zadanie: {message}</i> <br />
                <i className="text-danger">
                  Data realizacji zadania: {realization}
                </i>
                <br />
                <br />
              </div>
            )}
            <div className="w-50">
              Lista przydzielonych osób:
              <br />
              <ul>
                {users.map((item) => (
                  <li
                    key={item.user}
                    className={
                      item.status == "rejected" ? "text-danger" : "text-success"
                    }
                  >
                    {item.user} -
                    {item.status == "rejected"
                      ? " rezygnacja z powodu: "
                      : " przyjęcie"}
                    {item.description != undefined ? item.description : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
};

Case.propTypes = {
  data: PropTypes.array.isRequired,
  fetchCases: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default Case;
