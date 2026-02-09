import { Link } from "react-router-dom";
import { useState } from "react";
import { useLeague } from "../context/useLeague";

export default function GamesTab() {
  const {
    teams,
    addGame,
    gamesQuery,
    setGamesQuery,
    gameResults,
    isFinalGame,
    enterScorePrompt,
    clearScore,
    teamNameById,
  } = useLeague();

  const gamesQ = gamesQuery.trim().toLowerCase();

  return (
    <>
      {/* Add Game (no auth for now) */}
      <div className="mb-3">
        <AddGameForm teams={teams} addGame={addGame} />
      </div>

      {/* Search */}
      <div className="mb-2">
        <label className="form-label">Search games</label>
        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Date, time, court, or team name..."
            value={gamesQuery}
            onChange={(e) => setGamesQuery(e.target.value)}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => setGamesQuery("")}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Results */}
      {gameResults.length === 0 ? (
        <p className="empty">
          {gamesQ ? "No games match your search." : "No games scheduled yet."}
        </p>
      ) : (
        <ul className="list-group">
          {gameResults.map((g) => {
            const final = isFinalGame(g);
            const home = teamNameById.get(g.homeTeamId) ?? "Unknown team";
            const away = teamNameById.get(g.awayTeamId) ?? "Unknown team";

            return (
              <li
                key={g.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <div className="fw-semibold">
                    <Link to={`/games/${g.id}`} className="text-decoration-none">
                      {home} vs {away}
                    </Link>

                    <span
                      className={`badge ms-2 ${
                        final ? "text-bg-success" : "text-bg-warning"
                      }`}
                    >
                      {final ? "Final" : "Upcoming"}
                    </span>
                  </div>

                  <small className="text-muted">
                    {g.date} • {g.time} {g.court ? `• ${g.court}` : ""}
                  </small>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <div className="text-muted">
                    {final ? `${g.homeScore} - ${g.awayScore}` : "TBD"}
                  </div>

                  {!final ? (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => enterScorePrompt(g.id)}
                    >
                      Enter Score
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => enterScorePrompt(g.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => clearScore(g.id)}
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function AddGameForm({ teams = [], addGame }) {
  const [form, setForm] = useState({
    date: "",
    time: "",
    court: "",
    homeTeamId: "",
    awayTeamId: "",
  });

  const sameTeam = Boolean(form.homeTeamId) && form.homeTeamId === form.awayTeamId;
  const notEnoughTeams = teams.length < 2;

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    if (sameTeam) return;

    if (typeof addGame === "function") {
      addGame({
        date: form.date,
        time: form.time,
        court: form.court,
        homeTeamId: form.homeTeamId,
        awayTeamId: form.awayTeamId,
      });
    }

    // Reset form after submit
    setForm({ date: "", time: "", court: "", homeTeamId: "", awayTeamId: "" });
  }

  return (
    <form onSubmit={onSubmit} className="card p-3">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h3 className="h6 mb-0">Add Game</h3>
        <small className="text-muted">Schedule a new matchup</small>
      </div>

      {notEnoughTeams ? (
        <div className="alert alert-info mt-3 mb-0">
          Add at least <b>2 teams</b> before scheduling a game.
        </div>
      ) : (
        <div className="row g-2 mt-2">
          <div className="col-12 col-md-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              required
            />
          </div>

          <div className="col-12 col-md-2">
            <label className="form-label">Time</label>
            <input
              type="time"
              className="form-control"
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
              required
            />
          </div>

          <div className="col-12 col-md-2">
            <label className="form-label">Court</label>
            <input
              className="form-control"
              placeholder="Optional"
              value={form.court}
              onChange={(e) => update("court", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-2">
            <label className="form-label">Home</label>
            <select
              className="form-select"
              value={form.homeTeamId}
              onChange={(e) => update("homeTeamId", e.target.value)}
              required
            >
              <option value="">Select…</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-2">
            <label className="form-label">Away</label>
            <select
              className="form-select"
              value={form.awayTeamId}
              onChange={(e) => update("awayTeamId", e.target.value)}
              required
            >
              <option value="">Select…</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-1 d-grid">
            <label className="form-label invisible">.</label>
            <button className="btn btn-primary" type="submit" disabled={sameTeam}>
              Add
            </button>
          </div>

          {sameTeam ? (
            <div className="col-12">
              <small className="text-danger">Home and Away cannot be the same team.</small>
            </div>
          ) : null}

          {typeof addGame !== "function" ? (
            <div className="col-12">
              <small className="text-muted">
                Note: addGame() isn’t wired yet. Next step is to add an addGame action in
                App context.
              </small>
            </div>
          ) : null}
        </div>
      )}
    </form>
  );
}