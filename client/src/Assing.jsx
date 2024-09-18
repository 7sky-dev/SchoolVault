import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Success } from "./Success";

const Assing = ({ setAssing, signature }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    fetch("/get-users", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  const handleClick = () => {
    setAssing(false);
  };

  const [user, setUser] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(user);

    try {
      const response = await fetch("/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          signature: signature,
          description: description,
        }),
      });

      if (response.ok) {
        console.log("Pomyślnie wysłano żądanie do serwera");
      } else {
        console.error("Błąd podczas wysyłania żądania do serwera");
      }
    } catch (error) {
      console.error("Wystąpił błąd:", error.message);
    }
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 2000);
  };

  const [success, setSuccess] = useState(false);

  const handleSelectChange = (e) => {
    setUser(e.target.value);
  };

  const [description, setDescription] = useState("");

  return (
    <>
      {success ? (
        <Success
          setErr={setSuccess}
          text={"Wysłano zapytanie do " + user}
        ></Success>
      ) : null}
      <form
        onSubmit={handleFormSubmit}
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
              <h5 className="modal-title">Wybierz nauczyciela</h5>
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
                <select className="form-select" onChange={handleSelectChange}>
                  {users.map((item, index) => (
                    <option key={index} value={item.login}>
                      {item.nazwisko} {item.imie}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="form-control mt-2"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  placeholder="Opis:"
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
                Przydziel
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

Assing.propTypes = {
  setAssing: PropTypes.func.isRequired,
  signature: PropTypes.string.isRequired,
};

export default Assing;
