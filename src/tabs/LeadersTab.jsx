import StatLeaders from "../components/StatLeaders";

export default function LeadersTab({ players, teams, games, boxScores }) {
  return <StatLeaders players={players} teams={teams} games={games} boxScores={boxScores} />;
}