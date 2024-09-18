import "./App.css";
import "jquery/dist/jquery.js";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from "./Login";
import Nav from "./Nav";
import Dashboard from "./Dashboard";
import Files from "./Files";
import Cases from "./Cases";
import Account from "./Account";
import { useState, useEffect } from "react";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [imie, setImie] = useState(null);
  const [nazwisko, setNazwisko] = useState(null);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("ZST");
  const [err, setErr] = useState(false);

  document.title = page;

  const setPageOnServer = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page: page }),
    };

    fetch("/set-page", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error setting page on the server:", error);
      });
  };
  useEffect(() => {
    setPageOnServer();
  }, [page]);

  const p = () => {
    switch (page) {
      case "ZST":
        return <Dashboard></Dashboard>;
      case "Pliki":
        return <Files err={err} setErr={setErr} user={user}></Files>;
      case "Akta":
        return <Cases user={user} setPage={setPage}></Cases>;
      case "Konto":
        return (
          <Account
            user={user}
            imie={imie}
            nazwisko={nazwisko}
            setAuthenticated={setAuthenticated}
          ></Account>
        );
      default:
        return <Dashboard></Dashboard>;
    }
  };

  const checkUser = async () => {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    if (
      responseData.text == "User already logged in" &&
      user != "" &&
      user != null
    ) {
      setAuthenticated(true);
      setImie(responseData.imie);
      setNazwisko(responseData.nazwisko);
      setUser(responseData.user);
      setPage(responseData.page);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <div className="vw-100 vh-100">
      {authenticated ? (
        <>
          <Nav
            page={page}
            setPage={setPage}
            setAuthenticated={setAuthenticated}
            imie={imie}
            nazwisko={nazwisko}
          ></Nav>
          {p()}
        </>
      ) : (
        <Login
          setUser={setUser}
          setAuthenticated={setAuthenticated}
          setImie={setImie}
          setNazwisko={setNazwisko}
          err={err}
          setErr={setErr}
        ></Login>
      )}
    </div>
  );
}

export default App;
