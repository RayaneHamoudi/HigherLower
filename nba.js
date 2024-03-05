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
          }
        ]
      };

    // Function to compare player's guess with the correct answer
    function checkGuess() {
        console.log("Checking guess...");

        const playerGuess = document.getElementById('player-guess').value;
        const playerData = jsonData.players.find(player => player.name.toLowerCase() === playerGuess.toLowerCase());

        if (playerData) {
            // Create a new row for the guessed player's accolades
            const guessedPlayerRow = document.createElement('div');
            guessedPlayerRow.classList.add('guessed-player-row');
            guessedPlayerRow.innerHTML = `<p>${playerData.name}</p>`;

            for (const accolade in playerData) {
                if (accolade !== "name") {
                    const value = playerData[accolade];
                    const guess = parseInt(document.getElementById(accolade.toLowerCase()).querySelector('.accolade-guess').value) || 0;

                    const accoladeElement = document.createElement('div');
                    accoladeElement.classList.add('accolade-row');
                    accoladeElement.innerHTML = `<span>${accolade}: <span class="accolade-value">${value}</span><span class="arrow"></span></span>`;

                    // Compare the user's guess with the actual data
                    if (value === guess) {
                        accoladeElement.querySelector('.arrow').textContent = '';
                        accoladeElement.style.color = 'green';
                    } else if (value > guess) {
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
            displayResult(playerData);
        } else {
            // Player not found
            displayResult(null);
        }

        console.log("Guess checked!");
    }

    // Function to display the result
    function displayResult(playerData) {
        console.log("Displaying result...");

        const resultElement = document.getElementById('result');

        if (playerData) {
            // Display overall guess result
            resultElement.textContent = "Correct!";
        } else {
            // Player not found
            resultElement.textContent = "Incorrect. Try again!";
        }

        console.log("Result displayed!");
    }

    // Event listener for the submit button
    document.getElementById('submit-button').addEventListener('click', checkGuess);
});
