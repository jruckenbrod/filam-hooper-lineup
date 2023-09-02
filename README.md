## FILAM Hooper Lineup Generator
This is a tool used by our local basketball team to create our next lineups

## Prerequisites
Before you begin, ensure you have met the following requirements:

Node.js: Make sure you have Node.js installed on your machine. You can download it from https://nodejs.org/.

## Installation
To install this application, follow these steps:

1. Clone the repository to your local machine:

```
git clone https://github.com/jruckenbrod/lineup-maker.git
```

2. Navigate to the project directory:

```
cd lineup-maker
run npm install
node startGame.js
```

Follow the prompt instructions.
```
Do you want to (add) or (remove) players? (Type "exit" to finish): // add/remove
Enter a player name (or type "save" to finish adding): // Enter name here

// after entering 10 names, the tool will generate starting five
// Example:
Players data saved to ./data/players.json. Currently limited to 10
======================================================s
Team 1:
1. Diggs
2. Rucky
3. Bobby
4. Richard
5. MJ
======================================================
Team 2:
1. Jamar
2. Jean
3. Addison
4. Alain
5. Angelo
```

Note that tool is a personal tool where names can be entered manually in ./data/good_players.json and ./tall_players.json. Adding players names here will compare the name entered in the prompt and will flag them based on this ranking to generate a well-balance team.

License
This project is licensed under the MIT License - see the LICENSE file for details.

