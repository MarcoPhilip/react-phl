// src/pages/PlayerProfile.jsx
import { useParams, Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { teamsSeed, playersSeed } from "../data/seed";

export default function PlayerProfile() {
  const { playerId } = useParams();

  const [teams] = useLocalStorage("phl_teams", teamsSeed);
  const [players] = useLocalStorage("phl_players", playersSeed);

  const player = players.find((p) => p.id === playerId);

  if (!player) {
    return (
      <main className="app">
        <Link to="/" className="btn btn-sm btn-outline-secondary mb-3">
          ← Back
        </Link>
        <p>Player not found.</p>
      </main>
    );
  }

  const team = teams.find((t) => t.id === player.teamId);

  return (
    <main className="app">
      <Link to="/" className="btn btn-sm btn-outline-secondary mb-3">
        ← Back
      </Link>

      <h2 className="mb-1">{player.name}</h2>
      <p className="mb-3">
        #{player.number} • {player.position}
      </p>

      {team ? (
        <p className="mb-0">
          Team:{" "}
          <Link to={`/teams/${team.id}`} className="text-decoration-none">
            {team.name}
          </Link>
        </p>
      ) : (
        <p className="mb-0">Team: Unknown</p>
      )}
    </main>
  );
}