function Header({ darkMode, setDarkMode }) {

  return (

    <div className="header">

      <div>
        <h1>AI Fitness Dashboard</h1>
        <p>Track your workout analytics</p>
      </div>

      <button
        onClick={() => setDarkMode(!darkMode)}
      >
        Toggle Theme
      </button>

    </div>
  );
}

export default Header;