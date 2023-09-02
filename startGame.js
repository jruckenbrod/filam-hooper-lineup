import fs from "fs";
import readline from "readline";
import { promisify } from "util";
import chalk from "chalk";
import createNextTenStartingTeams from "./util/generateNextTen.js";
import { readFile } from "fs/promises";

const userList = JSON.parse(
  await readFile(new URL("./data/players.json", import.meta.url))
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

async function isPlayerNameInList(players, playerName) {
  return players.some(
    (player) => player.name.toLowerCase() === playerName.toLowerCase()
  );
}

async function startGame() {
  try {
    // Read the existing player data, if available
    let existingPlayers = [];
    let tallPlayers = [];
    let goodPlayers = [];

    try {
      // Check if the file already exists
      await fs.promises.access("./data/players.json");
    } catch (error) {
      // If the file doesn't exist, create an empty JSON file
      await writeFileAsync("./data/players.json", "[]", "utf8");
      console.log(`Created an empty JSON file: ${filename}`);
    }
    try {
      const data = await readFileAsync("./data/players.json", "utf8");
      existingPlayers = JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is empty; existingPlayers will remain an empty array
    }

    try {
      const tallData = await readFileAsync("./data/tall_players.json", "utf8");
      tallPlayers = JSON.parse(tallData);
    } catch (error) {
      // File doesn't exist or is empty; tallPlayers will remain an empty array
    }

    try {
      const goodData = await readFileAsync("./data/good_players.json", "utf8");
      goodPlayers = JSON.parse(goodData);
    } catch (error) {
      // File doesn't exist or is empty; goodPlayers will remain an empty array
    }

    const action = await new Promise((resolve) => {
      rl.question(
        chalk.blue(
          'Do you want to (add) or (remove) players? (Type "exit" to finish): '
        ),
        (input) => {
          resolve(input.toLowerCase());
        }
      );
    });

    if (action === "add") {
      let addedPlayerCount = 0; // Track the number of players added

      while (addedPlayerCount < 10) {
        const playerName = await new Promise((resolve) => {
          rl.question(
            chalk.blue(
              'Enter a player name (or type "save" to finish adding): '
            ),
            (input) => {
              resolve(input);
            }
          );
        });

        if (playerName.toLowerCase() === "save") {
          break;
        }
        let playerData = {
          name: playerName,
          height: 5,
          skillLevel: "Average",
          team: null,
        };

        if (await isPlayerNameInList(existingPlayers, playerName)) {
          console.log(chalk.yellow("Player already exists in the list."));
        } else if (
          tallPlayers
            .map((word) => word.toLowerCase())
            .includes(playerName.toLowerCase())
        ) {
          if (tallPlayers.map((player) => player.toLowerCase())) {
            playerData.skillLevel = "Good";
          }
          playerData.height = 6;
          existingPlayers.push(playerData);
          addedPlayerCount++; // Increment the added player count

          console.log(chalk.green("Player added successfully."));
        } else if (
          goodPlayers
            .map((player) => player.toLowerCase())
            .includes(playerName.toLowerCase())
        ) {
          playerData.skillLevel = "Good";
          existingPlayers.push(playerData);
          addedPlayerCount++; // Increment the added player count

          console.log(chalk.green("Player added successfully."));
        } else {
          existingPlayers.push(playerData);
          addedPlayerCount++; // Increment the added player count
          console.log(chalk.green("Player added successfully."));
        }
      }
    } else if (action === "remove") {
      while (true) {
        const playerName = await new Promise((resolve) => {
          rl.question(
            chalk.blue(
              'Enter the name of the player to remove (or type "exit" to finish removing): '
            ),
            (input) => {
              resolve(input);
            }
          );
        });

        if (playerName.toLowerCase() === "exit") {
          break;
        }

        const indexToRemove = existingPlayers.findIndex(
          (player) => player.name === playerName
        );
        if (indexToRemove !== -1) {
          existingPlayers.splice(indexToRemove, 1);
          console.log(chalk.green("Player removed successfully."));
        } else {
          console.log(chalk.yellow("Player not found. No removal performed."));
        }
      }
    } else if (action === "clear" || "delete") {
      const confirm = await new Promise((resolve) => {
        rl.question(
          chalk.red("Are you sure you want to delete all player data? (y/n): "),
          (input) => {
            resolve(input.toLowerCase());
          }
        );
      });

      if (confirm === "y") {
        existingPlayers = [];
        await writeFileAsync("./data/players.json", "[]", "utf8"); // Clear and recreate the file
        console.log(chalk.red("All player data deleted."));
      } else {
        console.log(chalk.green("No player data deleted."));
      }
    } else {
      console.log(chalk.yellow("Invalid action. No changes made."));
    }

    if (existingPlayers.length > 0) {
      const filename = "./data/players.json";

      await writeFileAsync(filename, JSON.stringify(existingPlayers, null, 2));
      console.log(
        chalk.green(
          `Players data saved to ${filename}. Currently limited to 10`
        )
      );
    } else {
      console.log(chalk.yellow("No players added or removed."));
    }
  } catch (error) {
    console.error(chalk.red("Error:", error.message));
  } finally {
    rl.close();
  }
}
await startGame();

// Create the starting teams
const startingTeams = await createNextTenStartingTeams(userList);
// Print the starting teams
console.log("======================================================");
console.log("Team 1:");
startingTeams[0].forEach((player, index) => {
  console.log(`${index + 1}. ${player.name}`);
});
console.log("======================================================");
console.log("Team 2:");
startingTeams[1].forEach((player, index) => {
  console.log(`${index + 1}. ${player.name}`);
});


