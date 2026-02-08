export const teamsSeed = [
  { id: "t1", name: "Daly City Dawgs", city: "Daly City", color: "Blue" },
  { id: "t2", name: "SSF Storm", city: "South San Francisco", color: "Black" },
];

export const playersSeed = [
  { id: "p1", teamId: "t1", name: "Marco Agapito", position: "SG", number: 7 },
  { id: "p2", teamId: "t2", name: "Jay Cruz", position: "C", number: 21 },
];

export const gamesSeed = [
  {
    id: "g1",
    date: "2026-02-15",
    time: "19:30",
    court: "Gym A",
    homeTeamId: "t1",
    awayTeamId: "t2",
    homeScore: null,
    awayScore: null,
  },
];