document.addEventListener('DOMContentLoaded', function () {
    // Your JSON-like data as an object
    const jsonData = {
        "players": [
          {
            "name": "Lebron James",
            "6moty": 0,
            "allNBA": 19,
            "allSTAR": 20,
            "fmvps": 4,
            "ROTYS": 1,
            "DPOYS": 0,
            "MVPS": 4
          },
          {
            "name": "Steph Curry",
            "6moty": 0,
            "allNBA": 9,
            "allSTAR": 10,
            "fmvps": 1,
            "ROTYS": 0,
            "DPOYS": 0,
            "MVPS": 2
          },
          {
            "Name": "Hakeem Olajuwon",
            "All-Star": 12,
            "DPOY": 2,
            "MVP": 1,
            "ROTY": 0,
            "FMVP": 2,
            "Six-Man": 0
          }
        ]
      };

// Function to compare player's guess with the correct answer
function checkGuess() {
    console.log("Checking guess...");

    // Select a random player from the JSON data
    const randomIndex = Math.floor(Math.random() * jsonData.players.length);
    const randomPlayer = jsonData.players[randomIndex];

    // Get the user's guessed player
    const playerGuess = document.getElementById('player-guess').value;
    const guessedPlayer = jsonData.players.find(player => player.name.toLowerCase() === playerGuess.toLowerCase());

    // Create a new row for the guessed player's accolades
    const guessedPlayerRow = document.createElement('div');
    guessedPlayerRow.classList.add('guessed-player-row');
    guessedPlayerRow.innerHTML = `<p>${guessedPlayer.name}</p>`;

    // Compare the user's guessed player's accolades with the random player's accolades
    for (const accolade in guessedPlayer) {
        if (accolade !== "name") {
            const guessedValue = guessedPlayer[accolade];
            const randomValue = randomPlayer[accolade];

            const accoladeElement = document.createElement('div');
            accoladeElement.classList.add('accolade-row');
            accoladeElement.innerHTML = `<span>${accolade}: <span class="accolade-value">${guessedValue}</span><span class="arrow"></span></span>`;

            // Compare the user's guessed player's accolade with the random player's accolade
            if (guessedValue === randomValue) {
                accoladeElement.querySelector('.arrow').textContent = '';
                accoladeElement.style.color = 'green';
            } else if (guessedValue > randomValue) {
                accoladeElement.querySelector('.arrow').textContent = ' ↓';
                accoladeElement.style.color = 'red';
            } else {
                accoladeElement.querySelector('.arrow').textContent = ' ↑';
                accoladeElement.style.color = 'red';
            }

            guessedPlayerRow.appendChild(accoladeElement);
        }
    }

    // Display the guessed player's row
    document.getElementById('player-info').appendChild(guessedPlayerRow);

    // Display the correct answer
    displayResult(guessedPlayer === randomPlayer);
    console.log("Guess checked!");
}})
