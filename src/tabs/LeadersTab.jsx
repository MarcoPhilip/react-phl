import StatLeaders from "../components/StatLeaders";
import { useLeague } from "../context/useLeague";

export default function LeadersTab() {
  const { players, teams, games, boxScores } = useLeague();
  return <StatLeaders players={players} teams={teams} games={games} boxScores={boxScores} />;
}