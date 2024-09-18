const Dashboard = () => {
  return (
    <main
      className="w-50 mt-2"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
      }}
    >
      <div className="border rounded p-3">
        <h1 className="text-center">Drogi nauczycielu!</h1>
        <hr />
        <p className="text-center">
          Witamy w naszym szkolnym systemie! Chcielibyśmy poinformować Cię, że
          ta platforma została stworzona specjalnie dla Ciebie!
          <br />
          Masz tutaj możliwość przechowywania i zarządzania swoimi plikami, co
          ułatwi organizację i dostęp do materiałów potrzebnych w Twojej pracy
          dydaktycznej, dzięki czemu możesz szybko i wygodnie dzielić się swoimi
          materiałami.
          <br />
          <br />W przypadku jakichkolwiek pytań lub wątpliwości, nasz zespół
          jest gotowy do udzielenia Ci pomocy.
          <br />
          Jesteśmy tutaj, aby wspierać Cię w Twojej pracy i pomagać w
          wykorzystywaniu wszystkich funkcji naszego systemu.
          <br />
          Dziękujemy za korzystanie z naszej platformy!
        </p>
        <br />

        <div className="d-flex flex-row-reverse">
          <div>
            <p className="text-center">
              Pozdrawiamy,
              <br />
              <i>Zespół Szkół Technicznych</i>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
