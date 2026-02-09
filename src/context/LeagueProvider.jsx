import { LeagueContext } from "./LeagueContext";

export function LeagueProvider({ value, children }) {
  return (
    <LeagueContext.Provider value={value}>
      {children}
    </LeagueContext.Provider>
  );
}