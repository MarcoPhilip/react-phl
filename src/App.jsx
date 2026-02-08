// src/App.jsx
import { useMemo, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import useLocalStorage from "./hooks/useLocalStorage";
import { teamsSeed, playersSeed } from "./data/seed";

import TeamForm from "./components/TeamForm";
import PlayerForm from "./components/PlayerForm";
import EditTeamForm from "./components/EditTeamForm";
import EditPlayerForm from "./components/EditPlayerForm";

import TeamProfile from "./pages/TeamProfile";
import PlayerProfile from "./pages/PlayerProfile";

export default function App() {
  // Teams stored in LocalStorage
  const [teams, setTeams] = useLocalStorage("phl_teams", teamsSeed);

  // Players stored in LocalStorage
  const [players, setPlayers] = useLocalStorage("phl_players", playersSeed);

  // Track which team is being edited
  const [editingTeamId, setEditingTeamId] = useState(null);

  // Track which player is being edited
  const [editingPlayerId, setEditingPlayerId] = useState(null);

  // Search text for teams
  const [teamSearch, setTeamSearch] = useState("");

  // Search text for players
  const [playerSearch, setPlayerSearch] = useState("");

  // Add a team (from TeamForm)
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

  // Delete a team and cascade delete its players
  function deleteTeam(teamId) {
    setTeams((prevTeams) => prevTeams.filter((t) => t.id !== teamId));
    setPlayers((prevPlayers) =>
      prevPlayers.filter((p) => p.teamId !== teamId)
    );
  }

  // Add a player to a team (from PlayerForm)
  function handleAddPlayer(teamId, player) {
    const newPlayer = { id: crypto.randomUUID(), teamId, ...player };
    setPlayers((prev) => [newPlayer, ...prev]);
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

  // Reset LocalStorage back to seed data
  function resetLeague() {
    localStorage.removeItem("phl_teams");
    localStorage.removeItem("phl_players");
    window.location.reload();
  }

  // Get players for a team
  function playersByTeam(teamId) {
    return players.filter((p) => p.teamId === teamId);
  }

  // Filter teams by teamSearch (name, city, color)
  const filteredTeams = useMemo(() => {
    const q = teamSearch.trim().toLowerCase();
    if (!q) return teams;

    return teams.filter((t) => {
      return (
        t.name.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        String(t.color || "").toLowerCase().includes(q)
      );
    });
  }, [teams, teamSearch]);

  // Filter roster by playerSearch (name, position, jersey number)
  function filteredRoster(teamId) {
    const roster = playersByTeam(teamId);
    const q = playerSearch.trim().toLowerCase();
    if (!q) return roster;

    return roster.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q) ||
        String(p.number).includes(q)
      );
    });
  }

  // UI mode flags
  const hasTeamQuery = teamSearch.trim().length > 0;
  const hasPlayerQuery = playerSearch.trim().length > 0;

  // If player search is active, show player results only
  const playerOnlyMode = hasPlayerQuery;

  // If team search is active (and not player search), show teams only (no roster)
  const teamOnlyMode = hasTeamQuery && !hasPlayerQuery;

  // Find players matching player search across ALL teams
  const playerResults = useMemo(() => {
    const q = playerSearch.trim().toLowerCase();
    if (!q) return [];

    return players.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q) ||
        String(p.number).includes(q)
      );
    });
  }, [players, playerSearch]);

  // Show team name for a player result
  function teamNameFor(player) {
    const team = teams.find((t) => t.id === player.teamId);
    return team ? team.name : "Unknown team";
  }

  // Home page UI (kept as a component variable so we can route / cleanly)
  const Home = (
    <main className="app">
      <header className="app-header">
        <div>
          <h1 className="app-title mb-0">Peninsula Hoopers League</h1>
          <p className="app-subtitle mb-0">
            LocalStorage CRUD + search filters + profiles (React Router).
          </p>
        </div>

        <button className="btn btn-outline-secondary" onClick={resetLeague}>
          Reset Data
        </button>
      </header>

      <hr className="divider" />

      {/* Add Team */}
      <section className="section">
        <h2 className="section-title">Add Team</h2>
        <TeamForm onAddTeam={handleAddTeam} />
      </section>

      <hr className="divider" />

      {/* Search Filters */}
      <section className="section">
        <h2 className="section-title">Search</h2>

        <div className="row g-2">
          <div className="col-12 col-md-6">
            <label className="form-label">Search teams</label>
            <input
              className="form-control"
              placeholder="Type team name, city, or color…"
              value={teamSearch}
              onChange={(e) => setTeamSearch(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Search players</label>
            <input
              className="form-control"
              placeholder="Type player name, position, or jersey #…"
              value={playerSearch}
              onChange={(e) => setPlayerSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            type="button"
            onClick={() => {
              setTeamSearch("");
              setPlayerSearch("");
            }}
          >
            Clear filters
          </button>
        </div>
      </section>

      <hr className="divider" />

      {/* Results */}
      <section className="section">
        <h2 className="section-title">
          {playerOnlyMode ? "Player Results" : "Teams"}
        </h2>

        {/* Player search active → show only players */}
        {playerOnlyMode ? (
          playerResults.length === 0 ? (
            <p className="empty">No players match your search.</p>
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
          )
        ) : filteredTeams.length === 0 ? (
          <p className="empty">No teams match your search.</p>
        ) : (
          <ul className="teams">
            {filteredTeams.map((t) => (
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
                          {t.city} • Color: {t.color}
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

                {/* Team search active → hide roster */}
                {teamOnlyMode ? null : (
                  <div className="team-body">
                    <h4 className="subsection-title">Add Player</h4>
                    <PlayerForm
                      onAddPlayer={(player) => handleAddPlayer(t.id, player)}
                    />

                    <h4 className="subsection-title">Roster</h4>

                    {filteredRoster(t.id).length === 0 ? (
                      <p className="empty">
                        No players match your search for this team.
                      </p>
                    ) : (
                      <ul className="roster">
                        {filteredRoster(t.id).map((p) => (
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
                                  #{p.number} {p.name} ({p.position})
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
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
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