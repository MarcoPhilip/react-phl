import { Link } from "react-router-dom";
import { useLeague } from "../context/useLeague";

export default function GamesTab() {
  const {
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