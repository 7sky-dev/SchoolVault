import { useState } from "react";
import PropTypes from "prop-types";
import { Error } from "./Error";
import { Success } from "./Success";

const Login = ({
  setUser,
  setAuthenticated,
  setImie,
  setNazwisko,
  err,
  setErr,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLoginChange = (e) => {
    setLogin(e.target.value);
  };

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { login, password };

    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const userData = await response.json();

      if (userData == "Error") {
        setErr(true);
        setTimeout(() => {
          setErr(false);
        }, 3000);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setAuthenticated(true);
          setImie(userData.imie);
          setNazwisko(userData.nazwisko);
          setUser(userData.user);
        }, 1000);
      }
    }
  };

  return (
    <>
      {success ? (
        <Success setErr={setSuccess} text={"Zalogowano do systemu."}></Success>
      ) : null}
      <div className="d-flex flex-row v-100 h-100 justify-content-center align-items-center">
        <div className="w-50 d-flex justify-content-center align-items-center">
          <img className="w-75" src="login.svg" alt="Login image" />
        </div>
        <div className="w-50 d-flex flex-column justify-content-center align-items-center">
          <form className="w-50" onSubmit={handleSubmit}>
            <input
              name="login"
              className="form-control m-1"
              type="text"
              placeholder="Login"
              onChange={handleLoginChange}
            />
            <div className="input-group m-1">
              <input
                name="password"
                className="form-control"
                type={showPassword ? "text" : "password"}
                placeholder="Haslo"
                value={password}
                onChange={handlePasswordChange}
              />
              <div className="ms-2 input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handlePasswordToggle}
                >
                  {showPassword ? (
                    <i className="bi bi-eye-slash"></i>
                  ) : (
                    <i className="bi bi-eye"></i>
                  )}
                </button>
              </div>
            </div>
            <input
              className="btn btn-primary w-100 m-1"
              type="submit"
              value="Zaloguj"
            />
          </form>
          {err ? (
            <Error text={"Podano złe dane logowania!"} setErr={setErr}></Error>
          ) : null}
        </div>
      </div>
    </>
  );
};

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
  setAuthenticated: PropTypes.func.isRequired,
  setImie: PropTypes.func.isRequired,
  setNazwisko: PropTypes.func.isRequired,
  err: PropTypes.string.isRequired,
  setErr: PropTypes.func.isRequired,
};

export default Login;
