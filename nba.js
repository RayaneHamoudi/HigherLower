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
    let randomPlayer;

    // Function to get a random player
    function getRandomPlayer() {
        const randomIndex = Math.floor(Math.random() * jsonData.players.length);
        return jsonData.players[randomIndex];
    }

    // Fetch JSON data and set up random player
    fetch('nba.json')
        .then(response => response.json())
        .then(data => {
            jsonData = data;
            randomPlayer = getRandomPlayer();
            console.log("Random Player:", randomPlayer);  // Log the random player to console
            document.getElementById('submit-button').removeAttribute('disabled');
        })
        .catch(error => console.error('Error fetching data', error));

    // Function to compare player's guess with the correct answer
    function checkGuess() {
        console.log("Checking guess...");

        // Get the user's guessed player
        const playerGuess = document.getElementById('player-guess').value;
        console.log("Player Guess:", playerGuess);

        if (!jsonData) {
            console.error("JSON data not available. Please reload the page.");
            return;
        }


        let guessedPlayer = jsonData.players.find(player => player.Name.toLowerCase() === playerGuess.toLowerCase());

        if (!guessedPlayer) {
            console.error("Guessed player not found.");
            return;
        }

        console.log("Guessed Player:", guessedPlayer);

        // Create a new row for the guessed player's accolades
        const guessedPlayerRow = document.createElement('div');
        guessedPlayerRow.classList.add('guessed-player-row');
        console.log("Guessed Player Row:", guessedPlayerRow);

        // Compare the user's guessed player's accolades with the random player's accolades
        for (const accolade in guessedPlayer) {
            if (accolade !== "name") {
                const guessedValue = guessedPlayer[accolade];
                const randomValue = randomPlayer[accolade];

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
        displayResult(guessedPlayer === randomPlayer);
        console.log("Guess checked!");
    }

    document.getElementById('submit-button').addEventListener('click', checkGuess);
});


