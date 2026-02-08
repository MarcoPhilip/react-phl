// src/pages/TeamProfile.jsx
import { useParams, Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { teamsSeed, playersSeed } from "../data/seed";

export default function TeamProfile() {
  const { teamId } = useParams();

  const [teams] = useLocalStorage("phl_teams", teamsSeed);
  const [players] = useLocalStorage("phl_players", playersSeed);

  const team = teams.find((t) => t.id === teamId);
  const roster = players.filter((p) => p.teamId === teamId);

  if (!team) {
    return (
      <main className="app">
        <Link to="/" className="btn btn-sm btn-outline-secondary mb-3">
          ← Back
        </Link>
        <p>Team not found.</p>
      </main>
    );
  }

  return (
    <main className="app">
      <Link to="/" className="btn btn-sm btn-outline-secondary mb-3">
        ← Back
      </Link>

      <h2 className="mb-1">{team.name}</h2>
      <p className="mb-3">
        {team.city} • Color: {team.color}
      </p>

      <h4>Roster</h4>

      {roster.length === 0 ? (
        <p>No players yet.</p>
      ) : (
        <ul className="roster">
          {roster.map((p) => (
            <li key={p.id}>
              <Link to={`/players/${p.id}`} className="text-decoration-none">
                #{p.number} {p.name} ({p.position})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}