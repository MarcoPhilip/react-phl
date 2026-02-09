import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

  // ------------------
  // Add Game form state
  // ------------------
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newCourt, setNewCourt] = useState("");
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");

  // Derive safe select values without setState-in-effect
  const homeTeamValue = useMemo(() => {
    if (!teams.length) return "";
    return teams.some((t) => t.id === homeTeamId) ? homeTeamId : teams[0].id;
  }, [teams, homeTeamId]);

  const awayTeamValue = useMemo(() => {
    if (!teams.length) return "";

    // Prefer the currently selected away team if it still exists
    let value = teams.some((t) => t.id === awayTeamId) ? awayTeamId : (teams[1]?.id ?? teams[0].id);

    // Ensure away != home
    if (value === homeTeamValue) {
      value = (teams.find((t) => t.id !== homeTeamValue)?.id ?? value);
    }

    return value;
  }, [teams, awayTeamId, homeTeamValue]);

  const canCreateGame = useMemo(() => {
    return (
      teams.length >= 2 &&
      newDate.trim() &&
      newTime.trim() &&
      homeTeamValue &&
      awayTeamValue &&
      homeTeamValue !== awayTeamValue
    );
  }, [teams.length, newDate, newTime, homeTeamValue, awayTeamValue]);

  function handleAddGameSubmit(e) {
    e.preventDefault();
    if (!canCreateGame) return;

    addGame({
      date: newDate.trim(),
      time: newTime.trim(),
      court: newCourt.trim(),
      homeTeamId: homeTeamValue,
      awayTeamId: awayTeamValue,
    });

    setNewDate("");
    setNewTime("");
    setNewCourt("");
  }

  return (
    <>
      {/* Add Game */}
      <div className="mb-3">
        <h3 className="h5 mb-2">Add Game</h3>
        <form onSubmit={handleAddGameSubmit} className="d-grid gap-2">
          <div className="row g-2">
            <div className="col-12 col-md-3">
              <input
                className="form-control"
                placeholder="YYYY-MM-DD"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-2">
              <input
                className="form-control"
                placeholder="HH:MM"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-3">
              <input
                className="form-control"
                placeholder="Court (optional)"
                value={newCourt}
                onChange={(e) => setNewCourt(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-2">
              <select
                className="form-select"
                value={homeTeamValue}
                onChange={(e) => setHomeTeamId(e.target.value)}
                disabled={teams.length < 1}
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-2">
              <select
                className="form-select"
                value={awayTeamValue}
                onChange={(e) => setAwayTeamId(e.target.value)}
                disabled={teams.length < 2}
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <button className="btn btn-primary" type="submit" disabled={!canCreateGame}>
              Add Game
            </button>
            {homeTeamValue && awayTeamValue && homeTeamValue === awayTeamValue ? (
              <small className="text-danger">Home and away must be different.</small>
            ) : null}
          </div>

          {teams.length < 2 ? (
            <small className="text-muted">Add at least 2 teams before creating games.</small>
          ) : null}
        </form>
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

      {/* List */}
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
                      className={`badge ms-2 ${final ? "text-bg-success" : "text-bg-warning"}`}
                    >
                      {final ? "Final" : "Upcoming"}
                    </span>
                  </div>
                  <small className="text-muted">
                    {g.date} • {g.time} • {g.court}
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