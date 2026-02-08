import { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import { teamsSeed, playersSeed } from "./data/seed";

import TeamForm from "./components/TeamForm";
import PlayerForm from "./components/PlayerForm";
import EditTeamForm from "./components/EditTeamForm";
import EditPlayerForm from "./components/EditPlayerForm";

export default function App() {
  // Teams stored in LocalStorage
  const [teams, setTeams] = useLocalStorage("phl_teams", teamsSeed);

  // Players stored in LocalStorage
  const [players, setPlayers] = useLocalStorage("phl_players", playersSeed);

  // Track which team is currently being edited (null means none)
  const [editingTeamId, setEditingTeamId] = useState(null);

  // Track which player is currently being edited (null means none)
  const [editingPlayerId, setEditingPlayerId] = useState(null);

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
    setPlayers((prevPlayers) => prevPlayers.filter((p) => p.teamId !== teamId));
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

  // Remove player
  function removePlayer(playerId) {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
  }

  // Reset data
  function resetLeague() {
    localStorage.removeItem("phl_teams");
    localStorage.removeItem("phl_players");
    window.location.reload();
  }

  // Players for a team
  function playersByTeam(teamId) {
    return players.filter((p) => p.teamId === teamId);
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1 className="app-title">Peninsula Hoopers League</h1>

        <div className="app-actions">
          <button className="btn" onClick={resetLeague}>Reset Data</button>
        </div>
      </header>

      <p className="app-subtitle">
        CRUD Phase 1: create, update, and delete teams & players (LocalStorage).
      </p>

      <hr className="divider" />

      <section className="section">
        <h2 className="section-title">Add Team</h2>
        <TeamForm onAddTeam={handleAddTeam} />
      </section>

      <hr className="divider" />

      <section className="section">
        <h2 className="section-title">Teams</h2>

        {teams.length === 0 ? (
          <p className="empty">No teams yet. Add one above.</p>
        ) : (
          <ul className="teams">
            {teams.map((t) => (
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
                        <h3 className="team-name">{t.name}</h3>
                        <p className="team-sub">
                          {t.city} • Color: {t.color}
                        </p>
                      </>
                    )}
                  </div>

                  {editingTeamId !== t.id ? (
                    <div className="team-actions">
                      <button className="btn" onClick={() => setEditingTeamId(t.id)}>Edit</button>

                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          const ok = confirm(`Delete ${t.name}? This also deletes its players.`);
                          if (!ok) return;
                          deleteTeam(t.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="team-body">
                  <h4 className="subsection-title">Add Player</h4>
                  <PlayerForm onAddPlayer={(player) => handleAddPlayer(t.id, player)} />

                  <h4 className="subsection-title">Roster</h4>

                  {playersByTeam(t.id).length === 0 ? (
                    <p className="empty">No players yet.</p>
                  ) : (
                    <ul className="roster">
                      {playersByTeam(t.id).map((p) => (
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
                              <span className="roster-text">
                                #{p.number} {p.name} ({p.position})
                              </span>

                              <div className="roster-actions">
                                <button className="btn" onClick={() => setEditingPlayerId(p.id)}>Edit</button>
                                <button className="btn btn-ghost" onClick={() => removePlayer(p.id)}>Remove</button>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}