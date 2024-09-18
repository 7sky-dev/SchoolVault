import PropTypes from "prop-types";
import { useState } from "react";
import { Error } from "./Error";

const CreateCase = ({ setCc, fetchCases }) => {
  const handleClick = () => {
    setCc(false);
  };
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [err, setErr] = useState(false);

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const changeTitle = (e) => {
    setTitle(e.target.value);
  };

  const changeDescription = (e) => {
    setDescription(e.target.value);
  };

  const changeDate = (e) => {
    const selectedDateTime = new Date(e.target.value);
    const day = selectedDateTime.getDate();
    const month = selectedDateTime.getMonth() + 1;
    const year = selectedDateTime.getFullYear();
    const hours = selectedDateTime.getHours();
    const minutes = selectedDateTime.getMinutes();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const formattedDateTime = `${formattedDay}-${formattedMonth}-${year} / ${formattedHours}:${formattedMinutes}`;

    setDate(formattedDateTime);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (title == "" || description == "" || date == "") {
      setErr(true);
      setTimeout(() => {
        setErr(false);
      }, 2000);
    } else {
      let identifier = "";

      await fetch("/create-case", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title, desc: description, date: date }),
      })
        .then((response) => response.json())
        .then((data) => {
          identifier = data;
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });

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
            console.log(data);
          })
          .catch((error) => {
            console.error("Error uploading file:", error);
          });
      }
      fetchCases();

      handleClick();
    }
  };

  return (
    <>
      {err ? (
        <Error
          setErr={setErr}
          text={"Proszę uzupełnić wszystkie pola."}
        ></Error>
      ) : null}
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
              <h5 className="modal-title">
                {title === "" ? "Stwórz sprawę:" : title}
              </h5>
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
                  className="form-control mb-2"
                  type="text"
                  placeholder="Tytuł:"
                  onChange={changeTitle}
                />
                <input
                  className="form-control mt-2"
                  type="text"
                  placeholder="Opis sprawy:"
                  onChange={changeDescription}
                />
                <input
                  className="form-control mt-2"
                  type="datetime-local"
                  onChange={changeDate}
                />
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

CreateCase.propTypes = {
  setCc: PropTypes.bool.isRequired,
  fetchCases: PropTypes.func.isRequired,
};

export default CreateCase;
