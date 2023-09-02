// Function to create starting teams with balanced skill levels, height, and unique players
export default async function createNextTenStartingTeams(users) {
  const maxPlayersPerTeam = 5
  const nextTen = grabNextTen(users);
  // Separate players by skill level ("average" and "good")
  const goodPlayers = nextTen.filter(
    (user) => user.skillLevel === "Good" && user.height <= 6
  );
  const averagePlayers = nextTen.filter(
    (user) => user.skillLevel === "Average" && user.height <= 6
  );

  // Separate players over 6 feet in height
  const tallPlayers = nextTen.filter((user) => user.height >= 6);

  // Shuffle the arrays multiple times for increased randomness
  shuffleArray(averagePlayers);
  shuffleArray(goodPlayers);
  shuffleArray(tallPlayers);

  // Initialize teams array
  const teams = [[], []]; // Two teams
  let team1 = teams[0];
  let team2 = teams[1];
  let currentPlayer;
  
  while (
    (currentPlayer = goodPlayers.shift() || averagePlayers.shift()) ||
    (currentPlayer = averagePlayers.shift() || goodPlayers.shift())
  ) {
    const tallPlayersInTeam1 = team1.filter((player) => player.height >= 6);
    const tallPlayersInTeam2 = team2.filter((player) => player.height >= 6);

    // Check if player is taller than 6 feet and not already in a team
    if (
      currentPlayer.height >= 6.0 &&
      !team1.includes(currentPlayer) &&
      !team2.includes(currentPlayer)
    ) {
      // Check if the other team already has a tall player
      if (
        hasHeight(team1) && 
        tallPlayersInTeam1.length !== tallPlayersInTeam2.length
      ) {
        team2.push(currentPlayer);
      } else {
        team1.push(currentPlayer);
      }
    } else {
      // Add player to the team with fewer players
      const targetTeam = team1.length <= team2.length && 
      team1.length  < maxPlayersPerTeam && team2.length < maxPlayersPerTeam ? team1 : team2;
      targetTeam.push(currentPlayer);
    }
  }

  return teams;
}

// Function to shuffle an array in-place (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function grabNextTen(players) {
  // Use the filter method to select objects within the range
  return (players
    .slice(0, 10));
}

function hasHeight(team) {
  // Check if team has tall player
  return team.some((player) => player.height >= 6);
}

