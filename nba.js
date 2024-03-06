function displayResult(isCorrect) {
    console.log("Displaying result...");

    const resultElement = document.getElementById('result');

    if (isCorrect) {
        // Display overall guess result
        resultElement.textContent = "Correct!";
    } else {
        // Player not found
        resultElement.textContent = "Incorrect. Try again!";
    }

    console.log("Result displayed!");
}

document.addEventListener('DOMContentLoaded', function () {
    let jsonData;
    let randomPlayer;  // Declare randomPlayer outside functions to make it accessible

    // start game func
    function startGame() {
        console.log("Game started!");
        document.getElementById('submit-button').removeAttribute('disabled');

        //random player
        const randomIndex = Math.floor(Math.random() * jsonData.players.length);
        randomPlayer = jsonData.players[randomIndex];
        console.log("Random Player:", randomPlayer);

        //saving random player (later comparisons)
        document.getElementById('submit-button').dataset.randomPlayer = JSON.stringify(randomPlayer);
    }

    // Function to compare player's guess with the correct answer
    function checkGuess() {
        console.log("Checking guess...");

        // Get the user's guessed player
        const playerGuess = document.getElementById('player-guess').value;
        console.log("Player Guess:", playerGuess);

        if (!jsonData) {
            console.error("JSON data not available. Please start the game.");
            return;
        }

        const guessedPlayer = jsonData.players.find(player => player && player.name && player.name.toLowerCase() === playerGuess.toLowerCase());

        if (!guessedPlayer) {
            console.error("Guessed player not found.");
            return;
        }

        console.log("Guessed Player:", guessedPlayer);

        // Create a new row for the guessed player's accolades
        const guessedPlayerRow = document.createElement('div');
        guessedPlayerRow.classList.add('guessed-player-row');
        guessedPlayerRow.innerHTML = `<p>${guessedPlayer.name}</p>`;
        console.log("Guessed Player Row:", guessedPlayerRow);

        //getting saved random player info for comparison
        const savedRandomPlayer = JSON.parse(document.getElementById('submit-button').dataset.randomPlayer);

        // Compare the user's guessed player's accolades with the random player's accolades
        for (const accolade in guessedPlayer) {
            if (accolade !== "name") {
                const guessedValue = guessedPlayer[accolade];
                const randomValue = savedRandomPlayer[accolade];

                const accoladeElement = document.createElement('div');
                accoladeElement.classList.add('accolade-row');
                accoladeElement.innerHTML = `<span>${accolade}: <span class="accolade-value">${guessedValue}</span><span class="arrow"></span></span>`;
                console.log("Accolade Element:", accoladeElement);

                // Compare the user's guessed player's accolade with the random player's accolade
                if (guessedValue > randomValue) {
                    accoladeElement.querySelector('.arrow').textContent = ' ↓';
                    accoladeElement.style.color = 'red';
                } else if (guessedValue < randomValue) {
                    accoladeElement.querySelector('.arrow').textContent = ' ↑';
                    accoladeElement.style.color = 'red';
                } else {
                    accoladeElement.querySelector('.arrow').textContent = '';
                    accoladeElement.style.color = 'green';
                }

                guessedPlayerRow.appendChild(accoladeElement);
            }
        }

        // Display the guessed player's row
        document.getElementById('player-info').appendChild(guessedPlayerRow);

        // Display the correct answer
        displayResult(guessedPlayer === savedRandomPlayer);
        console.log("Guess checked!");
    }

    // get json data and enable start game button
    fetch('nba.json')
        .then(response => response.json())
        .then(data => {
            jsonData = data;
            document.getElementById('start-game-button').addEventListener('click', startGame);
        })
        .catch(error => console.error('Error fetching data', error));

    document.getElementById('submit-button').addEventListener('click', checkGuess);
});

