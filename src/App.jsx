// src/App.jsx
import { useMemo, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import useLocalStorage from "./hooks/useLocalStorage";
import { teamsSeed, playersSeed, gamesSeed } from "./data/seed";

import TeamForm from "./components/TeamForm";
import EditTeamForm from "./components/EditTeamForm";
import EditPlayerForm from "./components/EditPlayerForm";

import TeamProfile from "./pages/TeamProfile";
import PlayerProfile from "./pages/PlayerProfile";

export default function App() {
  // LocalStorage state
  const [teams, setTeams] = useLocalStorage("phl_teams", teamsSeed);
  const [players, setPlayers] = useLocalStorage("phl_players", playersSeed);
  const [games] = useLocalStorage("phl_games", gamesSeed);

  // Editing state (Home lists)
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editingPlayerId, setEditingPlayerId] = useState(null);

  // Tabs
  const [activeTab, setActiveTab] = useState("players"); // players | teams | games

  // Search per tab
  const [playersQuery, setPlayersQuery] = useState("");
  const [teamsQuery, setTeamsQuery] = useState("");
  const [gamesQuery, setGamesQuery] = useState("");

  // -------------------------
  // CRUD: Teams
  // -------------------------
  function handleAddTeam(team) {
    const newTeam = { id: crypto.randomUUID(), ...team };
    setTeams((prev) => [newTeam, ...prev]);
  }

  function updateTeam(teamId, updates) {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, ...updates } : t))
    );
  }

  function deleteTeam(teamId) {
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
    setPlayers((prev) => prev.filter((p) => p.teamId !== teamId));
  }

  // -------------------------
  // CRUD: Players
  // -------------------------
  function updatePlayer(playerId, updates) {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, ...updates } : p))
    );
  }

  function removePlayer(playerId) {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
  }

  // -------------------------
  // Utilities
  // -------------------------
  function resetLeague() {
    localStorage.removeItem("phl_teams");
    localStorage.removeItem("phl_players");
    localStorage.removeItem("phl_games");
    window.location.reload();
  }

  function playersByTeam(teamId) {
    return players.filter((p) => p.teamId === teamId);
  }

  function teamNameFor(player) {
    const team = teams.find((t) => t.id === player.teamId);
    return team ? team.name : "Unknown team";
  }

  function teamLabel(teamId) {
    const t = teams.find((x) => x.id === teamId);
    return t ? t.name : "Unknown team";
  }

  // -------------------------
  // Filters per tab
  // -------------------------
  const teamsQ = teamsQuery.trim().toLowerCase();
  const playersQ = playersQuery.trim().toLowerCase();
  const gamesQ = gamesQuery.trim().toLowerCase();

  const teamResults = useMemo(() => {
    if (!teamsQ) return teams;

    return teams.filter((t) => {
      return (
        t.name.toLowerCase().includes(teamsQ) ||
        t.city.toLowerCase().includes(teamsQ) ||
        String(t.color || "").toLowerCase().includes(teamsQ)
      );
    });
  }, [teams, teamsQ]);

  const playerResults = useMemo(() => {
    if (!playersQ) return players;

    return players.filter((p) => {
      return (
        p.name.toLowerCase().includes(playersQ) ||
        p.position.toLowerCase().includes(playersQ) ||
        String(p.number).includes(playersQ)
      );
    });
  }, [players, playersQ]);

  const gameResults = useMemo(() => {
    const sorted = [...games].sort((a, b) =>
      `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
    );

    if (!gamesQ) return sorted;

    return sorted.filter((g) => {
      const homeTeam = teams.find((t) => t.id === g.homeTeamId);
      const awayTeam = teams.find((t) => t.id === g.awayTeamId);

      const home = homeTeam?.name.toLowerCase() || "";
      const away = awayTeam?.name.toLowerCase() || "";

      return (
        String(g.date || "").toLowerCase().includes(gamesQ) ||
        String(g.time || "").toLowerCase().includes(gamesQ) ||
        String(g.court || "").toLowerCase().includes(gamesQ) ||
        home.includes(gamesQ) ||
        away.includes(gamesQ)
      );
    });
  }, [games, teams, gamesQ]);

  // -------------------------
  // Home UI
  // -------------------------
  const Home = (
    <main className="app">
      <header className="app-header">
        <div>
          <h1 className="app-title mb-0">Peninsula Hoopers League</h1>
          <p className="app-subtitle mb-0">Players • Teams • Games</p>
        </div>

        <button className="btn btn-outline-secondary" onClick={resetLeague}>
          Reset Data
        </button>
      </header>

      <hr className="divider" />

      <section className="section">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="section-title mb-0">Browse</h2>
          <small className="text-muted">
            {players.length} players • {teams.length} teams • {games.length} games
          </small>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mt-3">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === "players" ? "active" : ""}`}
              onClick={() => setActiveTab("players")}
            >
              Players{" "}
              <span className="badge text-bg-secondary ms-1">
                {playerResults.length}
              </span>
            </button>
          </li>

          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === "teams" ? "active" : ""}`}
              onClick={() => setActiveTab("teams")}
            >
              Teams{" "}
              <span className="badge text-bg-secondary ms-1">
                {teamResults.length}
              </span>
            </button>
          </li>

          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === "games" ? "active" : ""}`}
              onClick={() => setActiveTab("games")}
            >
              Games{" "}
              <span className="badge text-bg-secondary ms-1">
                {gameResults.length}
              </span>
            </button>
          </li>
        </ul>

        {/* Tab content */}
        <div className="pt-3">
          {/* PLAYERS TAB */}
          {activeTab === "players" ? (
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
                            #{p.number} {p.name} ({p.position}) —{" "}
                            <b>{teamNameFor(p)}</b>
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
          ) : null}

          {/* TEAMS TAB */}
          {activeTab === "teams" ? (
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
                                <Link
                                  to={`/teams/${t.id}`}
                                  className="text-decoration-none"
                                >
                                  {t.name}
                                </Link>
                              </h3>
                              <p className="team-sub mb-0">
                                {t.city} • Color: {t.color} •{" "}
                                {playersByTeam(t.id).length} players
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
                                  `Delete ${t.name}? This also deletes its players.`
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
          ) : null}

          {/* GAMES TAB */}
          {activeTab === "games" ? (
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
                  {gameResults.map((g) => (
                    <li
                      key={g.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-semibold">
                          <Link
                            to={`/teams/${g.homeTeamId}`}
                            className="text-decoration-none"
                          >
                            {teamLabel(g.homeTeamId)}
                          </Link>{" "}
                          vs{" "}
                          <Link
                            to={`/teams/${g.awayTeamId}`}
                            className="text-decoration-none"
                          >
                            {teamLabel(g.awayTeamId)}
                          </Link>
                        </div>

                        <small className="text-muted">
                          {g.date} • {g.time} • {g.court}
                        </small>
                      </div>

                      <div className="text-muted">
                        {g.homeScore == null || g.awayScore == null
                          ? "TBD"
                          : `${g.homeScore} - ${g.awayScore}`}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : null}
        </div>
      </section>
    </main>
  );

  return (
    <Routes>
      <Route path="/" element={Home} />
      <Route path="/teams/:teamId" element={<TeamProfile />} />
      <Route path="/players/:playerId" element={<PlayerProfile />} />
    </Routes>
  );
}