import PropTypes from "prop-types";
import { useState } from "react";
import { useEffect } from "react";

const Nav = ({ page, setPage, setAuthenticated, imie, nazwisko }) => {
  const logout = async () => {
    const response = await fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      setAuthenticated(false);
    }
  };

  const handleClick = (x) => {
    if (x.target.value == undefined) {
      setPage("ZST");
    } else {
      setPage(x.target.value);
    }
    document.title = page;
  };

  useEffect(() => {
    fetchPendingCases();
  }, [page]);

  const [pendingRequests, setPendingRequests] = useState(0);
  const fetchPendingCases = async () => {
    fetch("/get-pending-cases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setPendingRequests(responseData.number);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <img
          onClick={handleClick}
          type={"button"}
          className="navbar-brand"
          width={100}
          src="logo.svg"
          alt="logo"
        />
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button
                value={"Pliki"}
                className="nav-link me-3"
                onClick={handleClick}
              >
                Moje pliki <br />
              </button>
            </li>
            <li className="nav-item">
              <button
                value={"Akta"}
                className="nav-link me-3"
                onClick={handleClick}
              >
                Akta{" "}
                {pendingRequests != 0 ? (
                  <span className="badge text-bg-danger">
                    {pendingRequests}
                  </span>
                ) : null}
              </button>
            </li>
            <li className="nav-item dropdown">
              <button
                value={"Konto"}
                className="nav-link"
                onClick={handleClick}
              >
                Konto
              </button>
            </li>
          </ul>
          <div className="d-flex flex-column justify-content-center align-items-center me-4">
            <div>Zalogowano jako:</div>
            <button
              className="fw-bold text-danger border-0 bg-body-tertiary"
              onClick={logout}
            >
              {imie} {nazwisko}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

Nav.propTypes = {
  page: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  setAuthenticated: PropTypes.func.isRequired,
  imie: PropTypes.func.isRequired,
  nazwisko: PropTypes.func.isRequired,
};

export default Nav;
