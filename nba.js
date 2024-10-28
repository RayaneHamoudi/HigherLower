function displayResult(isCorrect) {
    console.log("Displaying result...");

    const resultElement = document.getElementById('result');

    if (isCorrect) {
        resultElement.textContent = "Correct!";
    } else {
        resultElement.textContent = "Incorrect. Try again!";
    }

    console.log("Result displayed!");
}

document.addEventListener('DOMContentLoaded', function () {
    let jsonData;
    let randomPlayer;

    // Fetch JSON data and set up random player
    fetch('nba.json')
        .then(response => response.json())
        .then(data => {
            jsonData = data;

            // Populate the datalist with player names
            const datalist = document.getElementById('player-names');
            jsonData.players.forEach(player => {
                const option = document.createElement('option');
                option.value = player.Name;
                datalist.appendChild(option);
            });

            randomPlayer = getRandomPlayer();
            console.log("Random Player:", randomPlayer);  // Log the random player to console
            document.getElementById('submit-button').removeAttribute('disabled');
        })
        .catch(error => console.error('Error fetching data', error));

    // Function to get a random player
    function getRandomPlayer() {
        const randomIndex = Math.floor(Math.random() * jsonData.players.length);
        return jsonData.players[randomIndex];
    }

    // Function to compare player's guess with the correct answer
    document.getElementById('submit-button').addEventListener('click', function () {
        console.log("Checking guess...");

        // Get the user's guessed player
        const playerGuess = document.getElementById('player-guess').value;
        console.log("Player Guess:", playerGuess);

        let guessedPlayer = jsonData.players.find(player => player.Name.toLowerCase() === playerGuess.toLowerCase());

        if (!guessedPlayer) {
            alert("Player not found.");
            return;
        }

        console.log("Guessed Player:", guessedPlayer);

        // Compare accolades and display results
        const playerInfo = document.getElementById('player-info');
        playerInfo.innerHTML = ''; // Clear previous results

        const accoladeKeys = ['All-Star', 'DPOY', 'MVP', 'ROTY', 'FMVP', 'Six-Man', 'All-NBA'];

        accoladeKeys.forEach(key => {
            const guessedValue = guessedPlayer[key];
            const randomValue = randomPlayer[key];

            const accoladeElement = document.createElement('div');
            accoladeElement.classList.add('accolade-row');
            accoladeElement.innerHTML = `<span>${key}: <span class="accolade-value">${guessedValue}</span><span class="arrow"></span></span>`;

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

            playerInfo.appendChild(accoladeElement);
        });

        // Display the correct answer
        displayResult(guessedPlayer === randomPlayer);
        console.log("Guess checked!");
    });
});

