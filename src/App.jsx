// src/App.jsx
import { useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import useLocalStorage from "./hooks/useLocalStorage";
import { teamsSeed, playersSeed, gamesSeed, boxScoresSeed } from "./data/seed";

import HomeLayout from "./layouts/HomeLayout";
import PlayersTab from "./tabs/PlayersTab";
import TeamsTab from "./tabs/TeamsTab";
import GamesTab from "./tabs/GamesTab";
import StandingsTab from "./tabs/StandingsTab";
import LeadersTab from "./tabs/LeadersTab";

import TeamProfile from "./pages/TeamProfile";
import PlayerProfile from "./pages/PlayerProfile";
import GameProfile from "./pages/GameProfile";

import { LeagueProvider } from "./context/LeagueProvider";

export default function App() {
  // Persistent league data
  const [teams, setTeams] = useLocalStorage("phl_teams", teamsSeed);
  const [players, setPlayers] = useLocalStorage("phl_players", playersSeed);
  const [games, setGames] = useLocalStorage("phl_games", gamesSeed);
  const [boxScores] = useLocalStorage("phl_boxscores", boxScoresSeed);

  // UI state
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editingPlayerId, setEditingPlayerId] = useState(null);

  const [playersQuery, setPlayersQuery] = useState("");
  const [teamsQuery, setTeamsQuery] = useState("");
  const [gamesQuery, setGamesQuery] = useState("");

  // Team CRUD
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
    setGames((prev) =>
      prev.filter((g) => g.homeTeamId !== teamId && g.awayTeamId !== teamId)
    );
  }

  // Player CRUD
  function updatePlayer(playerId, updates) {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, ...updates } : p))
    );
  }

  function removePlayer(playerId) {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
  }

  // Game helpers
  function isFinalGame(g) {
    return g.homeScore != null && g.awayScore != null;
  }

  function updateGame(gameId, updates) {
    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, ...updates } : g))
    );
  }

  function clearScore(gameId) {
    updateGame(gameId, { homeScore: null, awayScore: null });
  }

  function enterScorePrompt(gameId) {
    const hs = prompt("Home score?", "0");
    const as = prompt("Away score?", "0");
    if (hs == null || as == null) return;

    const homeScore = Number(hs);
    const awayScore = Number(as);
    if (Number.isNaN(homeScore) || Number.isNaN(awayScore)) return;

    updateGame(gameId, { homeScore, awayScore });
  }

  // Reset league (MVP)
  function resetLeague() {
    localStorage.removeItem("phl_teams");
    localStorage.removeItem("phl_players");
    localStorage.removeItem("phl_games");
    localStorage.removeItem("phl_boxscores");
    window.location.reload();
  }

  // Normalize search strings
  const teamsQ = teamsQuery.trim().toLowerCase();
  const playersQ = playersQuery.trim().toLowerCase();
  const gamesQ = gamesQuery.trim().toLowerCase();

  // Stable lookup map (fixes memo/compiler warnings)
  const teamNameById = useMemo(() => {
    return new Map(teams.map((t) => [t.id, t.name]));
  }, [teams]);

  // Filter teams
  const teamResults = useMemo(() => {
    if (!teamsQ) return teams;
    return teams.filter(
      (t) =>
        t.name.toLowerCase().includes(teamsQ) ||
        t.city.toLowerCase().includes(teamsQ) ||
        String(t.color || "").toLowerCase().includes(teamsQ)
    );
  }, [teams, teamsQ]);

  // Filter players
  const playerResults = useMemo(() => {
    if (!playersQ) return players;
    return players.filter(
      (p) =>
        p.name.toLowerCase().includes(playersQ) ||
        p.position.toLowerCase().includes(playersQ) ||
        String(p.number).includes(playersQ)
    );
  }, [players, playersQ]);

  // Filter games (sort first)
  const gameResults = useMemo(() => {
    const sorted = [...games].sort((a, b) =>
      `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
    );

    if (!gamesQ) return sorted;

    return sorted.filter((g) => {
      const home = (teamNameById.get(g.homeTeamId) ?? "").toLowerCase();
      const away = (teamNameById.get(g.awayTeamId) ?? "").toLowerCase();

      return (
        String(g.date || "").toLowerCase().includes(gamesQ) ||
        String(g.time || "").toLowerCase().includes(gamesQ) ||
        String(g.court || "").toLowerCase().includes(gamesQ) ||
        home.includes(gamesQ) ||
        away.includes(gamesQ)
      );
    });
  }, [games, gamesQ, teamNameById]);

  // Standings from FINAL games only
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

    games.filter(isFinalGame).forEach((g) => {
      const home = byId.get(g.homeTeamId);
      const away = byId.get(g.awayTeamId);
      if (!home || !away) return;

      home.gp++;
      away.gp++;

      home.pf += g.homeScore;
      home.pa += g.awayScore;

      away.pf += g.awayScore;
      away.pa += g.homeScore;

      if (g.homeScore > g.awayScore) {
        home.wins++;
        away.losses++;
      } else if (g.awayScore > g.homeScore) {
        away.wins++;
        home.losses++;
      }
    });

    rows.forEach((r) => (r.pd = r.pf - r.pa));

    rows.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.pd !== a.pd) return b.pd - a.pd;
      if (b.pf !== a.pf) return b.pf - a.pf;
      return a.name.localeCompare(b.name);
    });

    return rows;
  }, [teams, games]);

  // Context value (tabs can read this later, even if they still use props today)
  const leagueValue = {
    // data
    teams,
    players,
    games,
    boxScores,
    standings,
    teamResults,
    playerResults,
    gameResults,
    teamNameById,

    // UI state
    editingTeamId,
    setEditingTeamId,
    editingPlayerId,
    setEditingPlayerId,
    playersQuery,
    setPlayersQuery,
    teamsQuery,
    setTeamsQuery,
    gamesQuery,
    setGamesQuery,

    // actions
    handleAddTeam,
    updateTeam,
    deleteTeam,
    updatePlayer,
    removePlayer,
    isFinalGame,
    enterScorePrompt,
    clearScore,
    resetLeague,
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LeagueProvider value={leagueValue}>
            <HomeLayout
              resetLeague={resetLeague}
              playersCount={players.length}
              teamsCount={teams.length}
              gamesCount={games.length}
              playersBadge={playerResults.length}
              teamsBadge={teamResults.length}
              gamesBadge={gameResults.length}
            />
          </LeagueProvider>
        }
      >
        <Route index element={<Navigate to="players" replace />} />

        <Route path="players" element={<PlayersTab />} />

        <Route
          path="teams"
          element={
            <TeamsTab
              onAddTeam={handleAddTeam}
              teamsQuery={teamsQuery}
              setTeamsQuery={setTeamsQuery}
              teamResults={teamResults}
              teamsQ={teamsQ}
              editingTeamId={editingTeamId}
              setEditingTeamId={setEditingTeamId}
              updateTeam={updateTeam}
              deleteTeam={deleteTeam}
              players={players}
            />
          }
        />

        <Route
          path="games"
          element={
            <GamesTab
              gamesQuery={gamesQuery}
              setGamesQuery={setGamesQuery}
              gameResults={gameResults}
              gamesQ={gamesQ}
              isFinalGame={isFinalGame}
              enterScorePrompt={enterScorePrompt}
              clearScore={clearScore}
              teamNameById={teamNameById}
            />
          }
        />

        <Route path="standings" element={<StandingsTab standings={standings} />} />

        <Route
          path="leaders"
          element={
            <LeadersTab
              players={players}
              teams={teams}
              games={games}
              boxScores={boxScores}
            />
          }
        />
      </Route>

      {/* Profiles */}
      <Route path="/teams/:teamId" element={<TeamProfile />} />
      <Route path="/players/:playerId" element={<PlayerProfile />} />
      <Route path="/games/:gameId" element={<GameProfile />} />

      <Route path="*" element={<div className="p-4">Not found</div>} />
    </Routes>
  );
}