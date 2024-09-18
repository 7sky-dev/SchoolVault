import PropTypes from "prop-types";
import { useState } from "react";
import { ChangePassword } from "./ChangePassword";

const Account = ({ user, imie, nazwisko, setAuthenticated }) => {
  const [passwordForm, setPasswordForm] = useState(false);

  const logout = () => {
    setAuthenticated(false);
  };
  const clickHandle = () => {
    setPasswordForm(true);
  };
  return (
    <div className="w-100 mt-2">
      <div className="container">
        <h1>
          <b>
            {imie} {nazwisko}
          </b>
        </h1>
        <hr />
        <button className="btn btn-primary me-2" onClick={clickHandle}>
          Zmień hasło
        </button>
        <button className="btn btn-danger" onClick={logout}>
          Wyloguj
        </button>
      </div>
      {passwordForm ? (
        <ChangePassword
          setPasswordForm={setPasswordForm}
          user={user}
        ></ChangePassword>
      ) : null}
    </div>
  );
};

Account.propTypes = {
  user: PropTypes.string.isRequired,
  imie: PropTypes.string.isRequired,
  nazwisko: PropTypes.string.isRequired,
  setAuthenticated: PropTypes.func.isRequired,
};

export default Account;
