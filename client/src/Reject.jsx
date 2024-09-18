import PropTypes from "prop-types";
import { useState } from "react";
import { Error } from "./Error";

const Reject = ({ setReject, setRejection, signature }) => {
  const [description, setDescription] = useState("");
  const [err, setErr] = useState(false);
  const submitForm = async (e) => {
    e.preventDefault();
    if (description == "") {
      setErr(true);
    } else {
      try {
        const response = await fetch("/reject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signature: signature,
            description: description,
          }),
        });
        if (response.ok) {
          setReject(false);
          setRejection(true);
        } else {
          console.error("Błąd podczas wysyłania żądania do serwera");
        }
      } catch (error) {
        console.error("Wystąpił błąd:", error.message);
      }
    }
  };

  return (
    <>
      {err ? (
        <Error text={"Podaj powód rezygnacji"} setErr={setErr}></Error>
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
              <h5 className="modal-title">Podaj powód rezygnacji</h5>
              {description}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setReject(false);
                }}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                <input
                  className="form-control mb-2"
                  type="text"
                  placeholder="Powód:"
                  onChange={(event) => setDescription(event.target.value)}
                />
              </p>
            </div>
            <div className="modal-footer">
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

Reject.propTypes = {
  setReject: PropTypes.func.isRequired,
  setRejection: PropTypes.func.isRequired,
  signature: PropTypes.string.isRequired,
};

export default Reject;
