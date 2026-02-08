// src/App.jsx

import { useMemo, useState } from "react";
import { Routes, Route, Link, NavLink, Navigate, Outlet } from "react-router-dom";

import useLocalStorage from "./hooks/useLocalStorage";
import { teamsSeed, playersSeed, gamesSeed, boxScoresSeed } from "./data/seed";

import TeamForm from "./components/TeamForm";
import EditTeamForm from "./components/EditTeamForm";
import EditPlayerForm from "./components/EditPlayerForm";

import TeamProfile from "./pages/TeamProfile";
import PlayerProfile from "./pages/PlayerProfile";
import GameProfile from "./pages/GameProfile";

import StatLeaders from "./components/StatLeaders";

export default function App() {
  // Store teams in LocalStorage (fallback to teamsSeed on first load)
  const [teams, setTeams] = useLocalStorage("phl_teams", teamsSeed);

  // Store players in LocalStorage (fallback to playersSeed on first load)
  const [players, setPlayers] = useLocalStorage("phl_players", playersSeed);

  // Store games in LocalStorage (fallback to gamesSeed on first load)
  const [games, setGames] = useLocalStorage("phl_games", gamesSeed);

  // Store box scores in LocalStorage (fallback to boxScoresSeed on first load)
  const [boxScores] = useLocalStorage("phl_boxscores", boxScoresSeed);

  // Track which team is being edited (inline edit)
  const [editingTeamId, setEditingTeamId] = useState(null);

  // Track which player is being edited (inline edit)
  const [editingPlayerId, setEditingPlayerId] = useState(null);

  // Search inputs for tabs
  const [playersQuery, setPlayersQuery] = useState("");
  const [teamsQuery, setTeamsQuery] = useState("");
  const [gamesQuery, setGamesQuery] = useState("");

  // Add a new team from TeamForm
  function handleAddTeam(team) {
    const newTeam = { id: crypto.randomUUID(), ...team };
    setTeams((prev) => [newTeam, ...prev]);
  }

  // Update a team by id
  function updateTeam(teamId, updates) {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, ...updates } : t))
    );
  }

  // Delete a team + cascade delete its players + its games
  function deleteTeam(teamId) {
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
    setPlayers((prev) => prev.filter((p) => p.teamId !== teamId));
    setGames((prev) =>
      prev.filter((g) => g.homeTeamId !== teamId && g.awayTeamId !== teamId)
    );
  }

  // Update a player by id
  function updatePlayer(playerId, updates) {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, ...updates } : p))
    );
  }

  // Remove a player by id
  function removePlayer(playerId) {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
  }

  // Is a game final (has both scores)?
  function isFinalGame(g) {
    return g.homeScore != null && g.awayScore != null;
  }

  // Update a game by id
  function updateGame(gameId, updates) {
    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, ...updates } : g))
    );
  }

  // Clear score for a game
  function clearScore(gameId) {
    updateGame(gameId, { homeScore: null, awayScore: null });
  }

  // Prompt user to enter score (quick MVP)
  function enterScorePrompt(gameId) {
    const hs = prompt("Home score?", "0");
    const as = prompt("Away score?", "0");
    if (hs == null || as == null) return;

    const homeScore = Number(hs);
    const awayScore = Number(as);
    if (Number.isNaN(homeScore) || Number.isNaN(awayScore)) return;

    updateGame(gameId, { homeScore, awayScore });
  }

  // Reset league data in LocalStorage
  function resetLeague() {
    localStorage.removeItem("phl_teams");
    localStorage.removeItem("phl_players");
    localStorage.removeItem("phl_games");
    localStorage.removeItem("phl_boxscores");
    window.location.reload();
  }

  // Get players for a team
  function playersByTeam(teamId) {
    return players.filter((p) => p.teamId === teamId);
  }

  // Team name for a player
  function teamNameFor(player) {
    const team = teams.find((t) => t.id === player.teamId);
    return team ? team.name : "Unknown team";
  }

  // Label team by id
  function teamLabel(teamId) {
    const t = teams.find((x) => x.id === teamId);
    return t ? t.name : "Unknown team";
  }

  // Normalize search strings (used for UI text checks)
  const teamsQ = teamsQuery.trim().toLowerCase();
  const playersQ = playersQuery.trim().toLowerCase();
  const gamesQ = gamesQuery.trim().toLowerCase();

  // Filter teams for Teams tab
  const teamResults = useMemo(() => {
    const q = teamsQuery.trim().toLowerCase();
    if (!q) return teams;

    return teams.filter((t) => {
      return (
        t.name.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        String(t.color || "").toLowerCase().includes(q)
      );
    });
  }, [teams, teamsQuery]);

  // Filter players for Players tab
  const playerResults = useMemo(() => {
    const q = playersQuery.trim().toLowerCase();
    if (!q) return players;

    return players.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q) ||
        String(p.number).includes(q)
      );
    });
  }, [players, playersQuery]);

  // Filter games for Games tab (and sort chronologically)
  const gameResults = useMemo(() => {
    const q = gamesQuery.trim().toLowerCase();

    const sorted = [...games].sort((a, b) =>
      `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
    );

    if (!q) return sorted;

    return sorted.filter((g) => {
      const homeTeam = teams.find((t) => t.id === g.homeTeamId);
      const awayTeam = teams.find((t) => t.id === g.awayTeamId);

      const home = homeTeam?.name.toLowerCase() || "";
      const away = awayTeam?.name.toLowerCase() || "";

      return (
        String(g.date || "").toLowerCase().includes(q) ||
        String(g.time || "").toLowerCase().includes(q) ||
        String(g.court || "").toLowerCase().includes(q) ||
        home.includes(q) ||
        away.includes(q)
      );
    });
  }, [games, teams, gamesQuery]);

  // Compute standings from FINAL games only
  const standings = useMemo(() => {
    const rows = teams.map((t) => ({
      teamId: t.id,
      name: t.name,
      city: t.city,
      wins: 0,
      losses: 0,
      gp: 0,
      pf: 0,
      pa: 0,
      pd: 0,
    }));

    const byId = new Map(rows.map((r) => [r.teamId, r]));
    const finals = games.filter(isFinalGame);

    for (const g of finals) {
      const home = byId.get(g.homeTeamId);
      const away = byId.get(g.awayTeamId);
      if (!home || !away) continue;

      home.gp += 1;
      away.gp += 1;

      home.pf += g.homeScore;
      home.pa += g.awayScore;

      away.pf += g.awayScore;
      away.pa += g.homeScore;

      if (g.homeScore > g.awayScore) {
        home.wins += 1;
        away.losses += 1;
      } else if (g.awayScore > g.homeScore) {
        away.wins += 1;
        home.losses += 1;
      }
    }

    for (const r of rows) r.pd = r.pf - r.pa;

    rows.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.pd !== a.pd) return b.pd - a.pd;
      if (b.pf !== a.pf) return b.pf - a.pf;
      return a.name.localeCompare(b.name);
    });

    return rows;
  }, [teams, games]);

  // -----------------------------
  // Tab pages (nested routes)
  // -----------------------------

  function PlayersTab() {
    return (
      <>
        <div className="mb-2">
          <label className="form-label">Search players</label>
          <div className="d-flex gap-2">
            <input
              className="form-control"
              placeholder="Name, position, or jersey #..."
              value={playersQuery}
              onChange={(e) => setPlayersQuery(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setPlayersQuery("")}
            >
              Clear
            </button>
          </div>
        </div>

        {playerResults.length === 0 ? (
          <p className="empty">
            {playersQ ? "No players match your search." : "No players yet."}
          </p>
        ) : (
          <ul className="roster">
            {playerResults.map((p) => (
              <li key={p.id} className="roster-item">
                {editingPlayerId === p.id ? (
                  <EditPlayerForm
                    initialPlayer={p}
                    onSave={(updates) => {
                      updatePlayer(p.id, updates);
                      setEditingPlayerId(null);
                    }}
                    onCancel={() => setEditingPlayerId(null)}
                  />
                ) : (
                  <>
                    <Link
                      to={`/players/${p.id}`}
                      className="roster-text text-decoration-none"
                    >
                      #{p.number} {p.name} ({p.position}) — <b>{teamNameFor(p)}</b>
                    </Link>

                    <div className="roster-actions">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setEditingPlayerId(p.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => removePlayer(p.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }

  function TeamsTab() {
    return (
      <>
        <div className="mb-3">
          <h3 className="h5 mb-2">Add Team</h3>
          <TeamForm onAddTeam={handleAddTeam} />
        </div>

        <div className="mb-2">
          <label className="form-label">Search teams</label>
          <div className="d-flex gap-2">
            <input
              className="form-control"
              placeholder="Name, city, or color..."
              value={teamsQuery}
              onChange={(e) => setTeamsQuery(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setTeamsQuery("")}
            >
              Clear
            </button>
          </div>
        </div>

        {teamResults.length === 0 ? (
          <p className="empty">
            {teamsQ ? "No teams match your search." : "No teams yet."}
          </p>
        ) : (
          <ul className="teams">
            {teamResults.map((t) => (
              <li key={t.id} className="team-card">
                <div className="team-header">
                  <div className="team-meta">
                    {editingTeamId === t.id ? (
                      <EditTeamForm
                        initialTeam={t}
                        onSave={(updates) => {
                          updateTeam(t.id, updates);
                          setEditingTeamId(null);
                        }}
                        onCancel={() => setEditingTeamId(null)}
                      />
                    ) : (
                      <>
                        <h3 className="team-name">
                          <Link to={`/teams/${t.id}`} className="text-decoration-none">
                            {t.name}
                          </Link>
                        </h3>
                        <p className="team-sub mb-0">
                          {t.city} • Color: {t.color} • {playersByTeam(t.id).length} players
                        </p>
                      </>
                    )}
                  </div>

                  {editingTeamId !== t.id ? (
                    <div className="team-actions">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setEditingTeamId(t.id)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          const ok = confirm(
                            `Delete ${t.name}? This also deletes its players and games.`
                          );
                          if (!ok) return;
                          deleteTeam(t.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }

  function GamesTab() {
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

              return (
                <li
                  key={g.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <div className="fw-semibold">
                      <Link to={`/games/${g.id}`} className="text-decoration-none">
                        {teamLabel(g.homeTeamId)} vs {teamLabel(g.awayTeamId)}
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

  function StandingsTab() {
    return (
      <>
        <p className="text-muted mb-2">
          Standings are computed from <b>Final</b> games only.
        </p>

        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Team</th>
                <th>W</th>
                <th>L</th>
                <th>GP</th>
                <th>PF</th>
                <th>PA</th>
                <th>PD</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((r, idx) => (
                <tr key={r.teamId}>
                  <td>{idx + 1}</td>
                  <td>
                    <Link to={`/teams/${r.teamId}`} className="text-decoration-none">
                      {r.name}
                    </Link>
                    <div className="text-muted small">{r.city}</div>
                  </td>
                  <td>{r.wins}</td>
                  <td>{r.losses}</td>
                  <td>{r.gp}</td>
                  <td>{r.pf}</td>
                  <td>{r.pa}</td>
                  <td>{r.pd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  function LeadersTab() {
    return (
      <StatLeaders players={players} teams={teams} games={games} boxScores={boxScores} />
    );
  }

  // -----------------------------
  // Home layout (header + tabs persist)
  // -----------------------------

  function HomeLayout() {
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

          {/* Tabs as ROUTES */}
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
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
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

  // -----------------------------
  // Routes
  // -----------------------------

  return (
    <Routes>
      {/* Home layout with nested tab routes */}
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Navigate to="players" replace />} />
        <Route path="players" element={<PlayersTab />} />
        <Route path="teams" element={<TeamsTab />} />
        <Route path="games" element={<GamesTab />} />
        <Route path="standings" element={<StandingsTab />} />
        <Route path="leaders" element={<LeadersTab />} />
      </Route>

      {/* Profiles stay separate (same as before) */}
      <Route path="/teams/:teamId" element={<TeamProfile />} />
      <Route path="/players/:playerId" element={<PlayerProfile />} />
      <Route path="/games/:gameId" element={<GameProfile />} />

      <Route path="*" element={<div className="p-4">Not found</div>} />
    </Routes>
  );
}