import { NavLink, Outlet } from "react-router-dom";
import { useLeague } from "../context/useLeague";

export default function HomeLayout() {
  const {
    resetLeague,
    players,
    teams,
    games,
    playerResults,
    teamResults,
    gameResults,
  } = useLeague();

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1 className="app-title mb-0">Peninsula Hoopers League</h1>
          <p className="app-subtitle mb-0">
            Phase 1: CRUD + Games + Standings + Leaders
          </p>
        </div>

        <button className="btn btn-outline-secondary" onClick={resetLeague}>
          Reset Data
        </button>
      </header>

      <hr className="divider" />

      <section className="section">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="section-title mb-0">League</h2>
          <small className="text-muted">
            {players.length} players • {teams.length} teams • {games.length} games
          </small>
        </div>

        <ul className="nav nav-tabs mt-3">
          {[
            { to: "players", label: "Players", badge: playerResults.length },
            { to: "teams", label: "Teams", badge: teamResults.length },
            { to: "games", label: "Games", badge: gameResults.length },
            { to: "standings", label: "Standings" },
            { to: "leaders", label: "Leaders" },
          ].map((t) => (
            <li className="nav-item" key={t.to}>
              <NavLink
                to={t.to}
                end
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                {t.label}
                {typeof t.badge === "number" ? (
                  <span className="badge text-bg-secondary ms-1">{t.badge}</span>
                ) : null}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="pt-3">
          <Outlet />
        </div>
      </section>
    </main>
  );
}