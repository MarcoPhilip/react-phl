export const teamsSeed = [
  { id: "t1", name: "Daly City Dawgs", city: "Daly City", color: "Blue" },
  { id: "t2", name: "SSF Storm", city: "South San Francisco", color: "Black" },
  { id: "t3", name: "San Mateo Sharks", city: "San Mateo", color: "Teal" },
  { id: "t4", name: "Redwood City Raptors", city: "Redwood City", color: "Red" },

  { id: "t5", name: "Millbrae Monarchs", city: "Millbrae", color: "Purple" },
  { id: "t6", name: "Burlingame Bulls", city: "Burlingame", color: "Maroon" },
  { id: "t7", name: "Pacifica Waves", city: "Pacifica", color: "Navy" },
  { id: "t8", name: "San Bruno Blazers", city: "San Bruno", color: "Orange" },

  { id: "t9", name: "Foster City Flyers", city: "Foster City", color: "Sky Blue" },
  { id: "t10", name: "Half Moon Bay Breakers", city: "Half Moon Bay", color: "Aqua" },
];

export const playersSeed = [
  // Daly City Dawgs (t1)
  { id: "p1", teamId: "t1", name: "Marco Agapito", position: "SG", number: 7 },
  { id: "p2", teamId: "t1", name: "Chris Nguyen", position: "PG", number: 3 },
  { id: "p3", teamId: "t1", name: "Daniel Cruz", position: "SF", number: 15 },
  { id: "p4", teamId: "t1", name: "Eric Santos", position: "PF", number: 24 },
  { id: "p5", teamId: "t1", name: "Michael Tan", position: "C", number: 31 },

  // SSF Storm (t2)
  { id: "p6", teamId: "t2", name: "Jay Cruz", position: "C", number: 21 },
  { id: "p7", teamId: "t2", name: "Anthony Reyes", position: "PF", number: 12 },
  { id: "p8", teamId: "t2", name: "Kevin Lim", position: "SG", number: 9 },
  { id: "p9", teamId: "t2", name: "Brian Lee", position: "PG", number: 2 },
  { id: "p10", teamId: "t2", name: "Oscar Martinez", position: "SF", number: 18 },

  // San Mateo Sharks (t3)
  { id: "p11", teamId: "t3", name: "Luis Ramirez", position: "PG", number: 1 },
  { id: "p12", teamId: "t3", name: "Jose Alvarez", position: "SG", number: 11 },
  { id: "p13", teamId: "t3", name: "Victor Chen", position: "SF", number: 20 },
  { id: "p14", teamId: "t3", name: "Samuel Park", position: "PF", number: 33 },
  { id: "p15", teamId: "t3", name: "Alex Johnson", position: "C", number: 44 },

  // Redwood City Raptors (t4)
  { id: "p16", teamId: "t4", name: "Ethan Park", position: "PG", number: 0 },
  { id: "p17", teamId: "t4", name: "Noah Kim", position: "SG", number: 8 },
  { id: "p18", teamId: "t4", name: "Ryan O'Connor", position: "SF", number: 23 },
  { id: "p19", teamId: "t4", name: "Mark Velasco", position: "PF", number: 10 },
  { id: "p20", teamId: "t4", name: "Jason Wu", position: "C", number: 55 },

  // Millbrae Monarchs (t5)
  { id: "p21", teamId: "t5", name: "Aaron Flores", position: "PG", number: 4 },
  { id: "p22", teamId: "t5", name: "Steven Cho", position: "SG", number: 14 },
  { id: "p23", teamId: "t5", name: "Miguel Santos", position: "SF", number: 22 },
  { id: "p24", teamId: "t5", name: "Patrick O'Brien", position: "PF", number: 30 },
  { id: "p25", teamId: "t5", name: "Daniel Wong", position: "C", number: 41 },

  // Burlingame Bulls (t6)
  { id: "p26", teamId: "t6", name: "Justin Park", position: "PG", number: 6 },
  { id: "p27", teamId: "t6", name: "Andrew Kim", position: "SG", number: 13 },
  { id: "p28", teamId: "t6", name: "Robert Diaz", position: "SF", number: 19 },
  { id: "p29", teamId: "t6", name: "Tommy Nguyen", position: "PF", number: 25 },
  { id: "p30", teamId: "t6", name: "Henry Liu", position: "C", number: 52 },

  // Pacifica Waves (t7)
  { id: "p31", teamId: "t7", name: "Kyle Anderson", position: "PG", number: 5 },
  { id: "p32", teamId: "t7", name: "Jason Morales", position: "SG", number: 17 },
  { id: "p33", teamId: "t7", name: "Nick Torres", position: "SF", number: 27 },
  { id: "p34", teamId: "t7", name: "Luis Mendoza", position: "PF", number: 32 },
  { id: "p35", teamId: "t7", name: "Ben Carter", position: "C", number: 50 },

  // San Bruno Blazers (t8)
  { id: "p36", teamId: "t8", name: "Ryan Chen", position: "PG", number: 1 },
  { id: "p37", teamId: "t8", name: "Alex Rivera", position: "SG", number: 10 },
  { id: "p38", teamId: "t8", name: "Matthew Lee", position: "SF", number: 21 },
  { id: "p39", teamId: "t8", name: "Joseph Kim", position: "PF", number: 34 },
  { id: "p40", teamId: "t8", name: "Carlos Gomez", position: "C", number: 45 },

  // Foster City Flyers (t9)
  { id: "p41", teamId: "t9", name: "Derek Huang", position: "PG", number: 2 },
  { id: "p42", teamId: "t9", name: "Kevin Patel", position: "SG", number: 9 },
  { id: "p43", teamId: "t9", name: "Sam Wilson", position: "SF", number: 16 },
  { id: "p44", teamId: "t9", name: "Brian Thompson", position: "PF", number: 28 },
  { id: "p45", teamId: "t9", name: "Jonathan Lee", position: "C", number: 60 },

  // Half Moon Bay Breakers (t10)
  { id: "p46", teamId: "t10", name: "Evan Miller", position: "PG", number: 0 },
  { id: "p47", teamId: "t10", name: "Chris Parker", position: "SG", number: 11 },
  { id: "p48", teamId: "t10", name: "Tyler Brooks", position: "SF", number: 24 },
  { id: "p49", teamId: "t10", name: "Nathan Scott", position: "PF", number: 35 },
  { id: "p50", teamId: "t10", name: "Zachary Adams", position: "C", number: 53 },
];
export const gamesSeed = [
  {
    id: "g1",
    date: "2026-02-15",
    time: "19:30",
    court: "Gym A",
    homeTeamId: "t1", // Daly City Dawgs
    awayTeamId: "t2", // SSF Storm
    homeScore: null,
    awayScore: null,
  },
  {
    id: "g2",
    date: "2026-02-18",
    time: "20:00",
    court: "Gym B",
    homeTeamId: "t3", // San Mateo Sharks
    awayTeamId: "t4", // Redwood City Raptors
    homeScore: null,
    awayScore: null,
  },
  {
    id: "g3",
    date: "2026-02-22",
    time: "18:30",
    court: "Gym A",
    homeTeamId: "t2",
    awayTeamId: "t3",
    homeScore: null,
    awayScore: null,
  },
  {
    id: "g4",
    date: "2026-02-25",
    time: "19:00",
    court: "Gym C",
    homeTeamId: "t4",
    awayTeamId: "t1",
    homeScore: null,
    awayScore: null,
  },
  {
    id: "g5",
    date: "2026-03-01",
    time: "17:00",
    court: "Gym A",
    homeTeamId: "t1",
    awayTeamId: "t3",
    homeScore: null,
    awayScore: null,
  },
  {
    id: "g6",
    date: "2026-03-04",
    time: "20:30",
    court: "Gym B",
    homeTeamId: "t2",
    awayTeamId: "t4",
    homeScore: null,
    awayScore: null,
  },

  // Example completed game (shows scores working)
  {
    id: "g7",
    date: "2026-02-08",
    time: "19:00",
    court: "Gym A",
    homeTeamId: "t3",
    awayTeamId: "t1",
    homeScore: 72,
    awayScore: 68,
  },
];

// Helpers: deterministic random so seed stays consistent across refresh
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickN(arr, n, rand) {
  const copy = [...arr];
  const out = [];
  while (copy.length && out.length < n) {
    const idx = Math.floor(rand() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

// Build box scores from players + games
export function buildBoxScoresSeed(players, games) {
  const rand = mulberry32(12345);

  const results = [];
  let idCounter = 1;

  for (const g of games) {
    // create stats for each team in the game
    const homePlayers = players.filter((p) => p.teamId === g.homeTeamId);
    const awayPlayers = players.filter((p) => p.teamId === g.awayTeamId);

    // pick up to 5 players (or fewer if not enough)
    const homeRotation = pickN(homePlayers, Math.min(5, homePlayers.length), rand);
    const awayRotation = pickN(awayPlayers, Math.min(5, awayPlayers.length), rand);

    for (const p of homeRotation) {
      results.push({
        id: `bs${idCounter++}`,
        gameId: g.id,
        playerId: p.id,
        teamId: p.teamId,
        pts: Math.floor(rand() * 26), // 0-25
        reb: Math.floor(rand() * 13), // 0-12
        ast: Math.floor(rand() * 11), // 0-10
      });
    }

    for (const p of awayRotation) {
      results.push({
        id: `bs${idCounter++}`,
        gameId: g.id,
        playerId: p.id,
        teamId: p.teamId,
        pts: Math.floor(rand() * 26),
        reb: Math.floor(rand() * 13),
        ast: Math.floor(rand() * 11),
      });
    }
  }

  return results;
}

// Default seed (generated from your existing seeds)
export const boxScoresSeed = buildBoxScoresSeed(playersSeed, gamesSeed);