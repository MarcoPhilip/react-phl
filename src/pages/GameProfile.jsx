// src/pages/GameProfile.jsx
import { Link, useParams } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { teamsSeed, gamesSeed } from "../data/seed";

export default function GameProfile() {
  const { gameId } = useParams();

  const [teams] = useLocalStorage("phl_teams", teamsSeed);
  const [games, setGames] = useLocalStorage("phl_games", gamesSeed);

  const game = games.find((g) => g.id === gameId);

  function teamLabel(teamId) {
    const t = teams.find((x) => x.id === teamId);
    return t ? t.name : "Unknown team";
  }

  function isFinal(g) {
    return g.homeScore != null && g.awayScore != null;
  }

  function updateGame(updates) {
    setGames((prev) => prev.map((g) => (g.id === gameId ? { ...g, ...updates } : g)));
  }

  function enterScore() {
    const hs = prompt("Home score?", String(game?.homeScore ?? 0));
    const as = prompt("Away score?", String(game?.awayScore ?? 0));
    if (hs == null || as == null) return;

    const homeScore = Number(hs);
    const awayScore = Number(as);

    if (Number.isNaN(homeScore) || Number.isNaN(awayScore)) return;

    updateGame({ homeScore, awayScore });
  }

  function clearScore() {
    updateGame({ homeScore: null, awayScore: null });
  }

  if (!game) {
    return (
      <main className="app">
        <p className="empty">Game not found.</p>
        <Link to="/" className="btn btn-outline-secondary">
          Back
        </Link>
      </main>
    );
  }

  const final = isFinal(game);

  return (
    <main className="app">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="mb-0">
          {teamLabel(game.homeTeamId)} vs {teamLabel(game.awayTeamId)}
        </h1>

        <Link to="/" className="btn btn-outline-secondary">
          Back
        </Link>
      </div>

      <p className="text-muted mt-2">
        {game.date} • {game.time} • {game.court} •{" "}
        <span className={`badge ${final ? "text-bg-success" : "text-bg-warning"}`}>
          {final ? "Final" : "Upcoming"}
        </span>
      </p>

      <hr />

      <div className="d-flex gap-2 align-items-center">
        <div className="fs-4">
          {final ? `${game.homeScore} - ${game.awayScore}` : "Score: TBD"}
        </div>

        <button className="btn btn-primary" onClick={enterScore}>
          {final ? "Edit Score" : "Enter Score"}
        </button>

        {final ? (
          <button className="btn btn-outline-secondary" onClick={clearScore}>
            Clear
          </button>
        ) : null}
      </div>

      <hr />

      <h3 className="h5">Teams</h3>
      <ul>
        <li>
          Home:{" "}
          <Link to={`/teams/${game.homeTeamId}`} className="text-decoration-none">
            {teamLabel(game.homeTeamId)}
          </Link>
        </li>
        <li>
          Away:{" "}
          <Link to={`/teams/${game.awayTeamId}`} className="text-decoration-none">
            {teamLabel(game.awayTeamId)}
          </Link>
        </li>
      </ul>
    </main>
  );
}