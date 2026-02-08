import useLocalStorage from "./hooks/useLocalStorage";
import { teamsSeed, playersSeed } from "./data/seed";

export default function App() {
  // 1) State stored in LocalStorage
  const [teams, setTeams] = useLocalStorage("phl_teams", teamsSeed);
  const [players, setPlayers] = useLocalStorage("phl_players", playersSeed);

  // 2) Create a team
  function addTeam() {
    const name = prompt("Team name?");
    const city = prompt("City?");
    if (!name?.trim() || !city?.trim()) return;

    const newTeam = {
      id: crypto.randomUUID(),
      name: name.trim(),
      city: city.trim(),
      color: "N/A",
    };

    setTeams((prev) => [newTeam, ...prev]);
  }

  // 3) Create a player for a specific team
  function addPlayer(teamId) {
    const name = prompt("Player name?");
    const position = prompt("Position? (PG/SG/SF/PF/C)", "PG");
    const number = prompt("Jersey number?", "0");
    if (!name?.trim()) return;

    const newPlayer = {
      id: crypto.randomUUID(),
      teamId,
      name: name.trim(),
      position: (position || "PG").toUpperCase(),
      number: Number(number) || 0,
    };

    setPlayers((prev) => [newPlayer, ...prev]);
  }

  // 4) Delete a player
  function removePlayer(playerId) {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
  }

  // 5) Reset LocalStorage back to seeds
  function resetLeague() {
    localStorage.removeItem("phl_teams");
    localStorage.removeItem("phl_players");
    window.location.reload();
  }

  // 6) Helper: players for a team
  const playersByTeam = (teamId) => players.filter((p) => p.teamId === teamId);

  // 7) Render UI
  return (
    <main style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Peninsula Hoopers League</h1>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={addTeam}>+ Add Team</button>
          <button onClick={resetLeague}>Reset Data</button>
        </div>
      </header>

      <p style={{ marginTop: 8 }}>
        LocalStorage MVP: add teams/players, refresh — data stays.
      </p>

      <hr />

      <section>
        <h2>Teams</h2>

        {teams.length === 0 ? (
          <p>No teams yet. Click “Add Team”.</p>
        ) : (
          <ul style={{ paddingLeft: 0, listStyle: "none", display: "grid", gap: 12 }}>
            {teams.map((t) => (
              <li key={t.id} style={{ border: "1px solid #eee", padding: 12, borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{t.name}</h3>
                    <small>{t.city}</small>
                  </div>

                  <button onClick={() => addPlayer(t.id)}>+ Add Player</button>
                </div>

                <div style={{ marginTop: 10 }}>
                  <b>Roster</b>

                  {playersByTeam(t.id).length === 0 ? (
                    <p style={{ margin: "6px 0" }}>No players yet.</p>
                  ) : (
                    <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
                      {playersByTeam(t.id).map((p) => (
                        <li key={p.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <span>
                            #{p.number} {p.name} ({p.position})
                          </span>
                          <button onClick={() => removePlayer(p.id)}>Remove</button>
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