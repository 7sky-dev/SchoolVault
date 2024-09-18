import { useState } from "react";
import PropTypes from "prop-types";
import { Error } from "./Error";

export const ChangePassword = ({ user, setPasswordForm }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRepeatPassword, setNewRepeatPassword] = useState("");
  const [err, setErr] = useState(false);

  const currentPass = (e) => {
    setCurrentPassword(e.target.value);
  };

  const newPass = (e) => {
    setNewPassword(e.target.value);
  };

  const newRepeat = (e) => {
    setNewRepeatPassword(e.target.value);
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (newPassword === newRepeatPassword) {
      fetch("/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: newPassword,
          currentPassword: currentPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Password changed successfully");
          console.log(data);
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
      setErr(true);
      setTimeout(() => {
        setErr(false);
      }, 3000);
    } else {
      setErr(true);
      setTimeout(() => {
        setErr(false);
      }, 3000);
    }
  };

  const abort = () => {
    setPasswordForm(false);
  };

  return (
    <>
      {err ? (
        <Error
          text={
            "Sprawdź czy stare hasło jest prawidłowe i sprawdź poprawność nowego hasła."
          }
          setErr={setErr}
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
                Zmień hasło dla: <b>{user}</b>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={abort}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Stare hasło:"
                  onChange={currentPass}
                />
              </p>
              <p>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Nowe hasło:"
                  onChange={newPass}
                />
              </p>
              <p>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Powtórz nowe hasło:"
                  onChange={newRepeat}
                />
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={abort}
              >
                Anuluj
              </button>
              <button type="submit" className="btn btn-success">
                Zmień
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

ChangePassword.propTypes = {
  user: PropTypes.string.isRequired,
  setPasswordForm: PropTypes.func.isRequired,
};
