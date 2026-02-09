// src/pages/GameProfile.jsx
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useLeague } from "../context/useLeague";

export default function GameProfile() {
  const { gameId } = useParams();

  const {
    games,
    teams,
    players,
    boxScores,
    upsertBoxScore,
    isFinalGame,
    enterScorePrompt,
    clearScore,
    teamNameById,
  } = useLeague();

  const game = useMemo(() => games.find((g) => g.id === gameId), [games, gameId]);

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

  const final = isFinalGame(game);
  const homeName = teamNameById.get(game.homeTeamId) ?? "Unknown team";
  const awayName = teamNameById.get(game.awayTeamId) ?? "Unknown team";

  return (
    <main className="app">
      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
        <h1 className="mb-0">
          {homeName} vs {awayName}
        </h1>

        <div className="d-flex gap-2 align-items-center">
          <Link to="/" className="btn btn-outline-secondary">
            Back
          </Link>
        </div>
      </div>

      <p className="text-muted mt-2">
        {game.date} • {game.time} {game.court ? `• ${game.court}` : ""} •{" "}
        <span className={`badge ${final ? "text-bg-success" : "text-bg-warning"}`}>
          {final ? "Final" : "Upcoming"}
        </span>
      </p>

      <hr />

      <div className="d-flex gap-2 align-items-center flex-wrap">
        <div className="fs-4">{final ? `${game.homeScore} - ${game.awayScore}` : "Score: TBD"}</div>

        <button className="btn btn-primary" onClick={() => enterScorePrompt(game.id)}>
          {final ? "Edit Score" : "Enter Score"}
        </button>

        {final ? (
          <button className="btn btn-outline-secondary" onClick={() => clearScore(game.id)}>
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
            {homeName}
          </Link>
        </li>
        <li>
          Away:{" "}
          <Link to={`/teams/${game.awayTeamId}`} className="text-decoration-none">
            {awayName}
          </Link>
        </li>
      </ul>

      <hr />

      {/* Step 3: Box Score Editor (MVP) — only show once game is Final */}
      {final ? (
        <BoxScoreEditor
          game={game}
          teams={teams}
          players={players}
          boxScores={boxScores}
          upsertBoxScore={upsertBoxScore}
        />
      ) : (
        <p className="text-muted">
          Box score editing unlocks after the game is marked <b>Final</b>.
        </p>
      )}
    </main>
  );
}

function BoxScoreEditor({ game, teams, players, boxScores, upsertBoxScore }) {
  const homeTeam = teams.find((t) => t.id === game.homeTeamId);
  const awayTeam = teams.find((t) => t.id === game.awayTeamId);

  const homePlayers = useMemo(
    () => players.filter((p) => p.teamId === game.homeTeamId),
    [players, game.homeTeamId]
  );
  const awayPlayers = useMemo(
    () => players.filter((p) => p.teamId === game.awayTeamId),
    [players, game.awayTeamId]
  );

  const rowsByPlayerId = useMemo(() => {
    const map = new Map();
    for (const row of boxScores) {
      if (row.gameId !== game.id) continue;
      map.set(row.playerId, row);
    }
    return map;
  }, [boxScores, game.id]);

  const homePtsTotal = useMemo(() => {
    return homePlayers.reduce(
      (sum, p) => sum + (Number(rowsByPlayerId.get(p.id)?.pts) || 0),
      0
    );
  }, [homePlayers, rowsByPlayerId]);

  const awayPtsTotal = useMemo(() => {
    return awayPlayers.reduce(
      (sum, p) => sum + (Number(rowsByPlayerId.get(p.id)?.pts) || 0),
      0
    );
  }, [awayPlayers, rowsByPlayerId]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h3 className="h5 mb-0">Box Score (Admin)</h3>
        <div className="text-muted">
          Team totals (PTS):
          <span className="ms-1">
            {homeTeam?.name ?? "Home"} {homePtsTotal}
          </span>
          <span className="ms-2">
            {awayTeam?.name ?? "Away"} {awayPtsTotal}
          </span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <TeamBox
            title={homeTeam?.name ?? "Home"}
            teamId={game.homeTeamId}
            players={homePlayers}
            rowsByPlayerId={rowsByPlayerId}
            gameId={game.id}
            upsertBoxScore={upsertBoxScore}
          />
        </div>

        <div className="col-12 col-lg-6">
          <TeamBox
            title={awayTeam?.name ?? "Away"}
            teamId={game.awayTeamId}
            players={awayPlayers}
            rowsByPlayerId={rowsByPlayerId}
            gameId={game.id}
            upsertBoxScore={upsertBoxScore}
          />
        </div>
      </div>
    </div>
  );
}

function TeamBox({ title, teamId, players, rowsByPlayerId, gameId, upsertBoxScore }) {
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="fw-semibold">{title}</div>
        <small className="text-muted">Players: {players.length}</small>
      </div>

      <div className="table-responsive">
        <table className="table table-sm align-middle mb-0">
          <thead>
            <tr>
              <th>Player</th>
              <th className="text-end">PTS</th>
              <th className="text-end">REB</th>
              <th className="text-end">AST</th>
              <th className="text-end">STL</th>
              <th className="text-end">BLK</th>
              <th className="text-end">TO</th>
            </tr>
          </thead>
          <tbody>
            {players.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-muted p-3">
                  No players on this team yet.
                </td>
              </tr>
            ) : (
              players.map((p) => {
                const row = rowsByPlayerId.get(p.id) ?? {};

                return (
                  <tr key={p.id}>
                    <td>
                      <div className="fw-semibold">
                        #{p.number} {p.name}
                      </div>
                      <div className="text-muted small">{p.position}</div>
                    </td>

                    <StatInput
                      value={row.pts}
                      onChange={(v) =>
                        upsertBoxScore({
                          gameId,
                          playerId: p.id,
                          teamId,
                          stats: { pts: v },
                        })
                      }
                    />

                    <StatInput
                      value={row.reb}
                      onChange={(v) =>
                        upsertBoxScore({
                          gameId,
                          playerId: p.id,
                          teamId,
                          stats: { reb: v },
                        })
                      }
                    />

                    <StatInput
                      value={row.ast}
                      onChange={(v) =>
                        upsertBoxScore({
                          gameId,
                          playerId: p.id,
                          teamId,
                          stats: { ast: v },
                        })
                      }
                    />

                    <StatInput
                      value={row.stl}
                      onChange={(v) =>
                        upsertBoxScore({
                          gameId,
                          playerId: p.id,
                          teamId,
                          stats: { stl: v },
                        })
                      }
                    />

                    <StatInput
                      value={row.blk}
                      onChange={(v) =>
                        upsertBoxScore({
                          gameId,
                          playerId: p.id,
                          teamId,
                          stats: { blk: v },
                        })
                      }
                    />

                    <StatInput
                      value={row.tov}
                      onChange={(v) =>
                        upsertBoxScore({
                          gameId,
                          playerId: p.id,
                          teamId,
                          stats: { tov: v },
                        })
                      }
                    />
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="card-body border-top">
        <small className="text-muted">
          Tip: totals update automatically as you enter stats.
        </small>
      </div>
    </div>
  );
}

function StatInput({ value, onChange }) {
  return (
    <td className="text-end" style={{ width: 72 }}>
      <input
        className="form-control form-control-sm text-end"
        inputMode="numeric"
        value={value ?? 0}
        onChange={(e) => onChange(e.target.value)}
      />
    </td>
  );
}