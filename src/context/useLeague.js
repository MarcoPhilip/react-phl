import { useContext } from "react";
import { LeagueContext } from "./LeagueContext";

export function useLeague() {
  const ctx = useContext(LeagueContext);
  if (ctx === null) {
    throw new Error("useLeague must be used inside <LeagueProvider>");
  }
  return ctx;
}