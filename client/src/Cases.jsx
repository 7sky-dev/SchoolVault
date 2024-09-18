import { useEffect, useState } from "react";
import Case from "./Case";
import CreateCase from "./CreateCase";
import PropTypes from "prop-types";

const Cases = ({ setPage }) => {
  const [data, setData] = useState([]);
  const [cc, setCc] = useState(false);
  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    fetch("/get-Cases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setData(responseData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const sort = (e) => {
    let sort = false;

    if (e.target.value === "pilne") {
      sort = true;
    }

    fetch("/get-Cases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sort: sort,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        setData(responseData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      {cc ? (
        <CreateCase fetchCases={fetchCases} setCc={setCc}></CreateCase>
      ) : null}
      <main className="w-100 mt-2">
        <div className="container">
          <h1 className="text-center">Twoje akta</h1>
          <div className="d-flex flex-row align-items-center w-75">
            <button
              className="btn btn-primary me-2"
              onClick={() => setCc(true)}
            >
              Stwórz sprawę
            </button>

            <select className="form-select h-50 w-25" onChange={sort}>
              <option selected disabled>
                Sortowanie
              </option>
              <option value={"reset"}>Pokaż wszystko</option>
              <option value={"pilne"}>Pilne</option>
            </select>
          </div>
          <hr />
          <span className="text-secondary mt-2 ms-2 w-100"></span>
          <div className="container d-flex flex-wrap flex-row">
            <Case fetchCases={fetchCases} setPage={setPage} data={data}></Case>
          </div>
        </div>
      </main>
    </>
  );
};

Cases.propTypes = {
  setPage: PropTypes.func.isRequired,
};

export default Cases;
