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

    function displayAutocompleteSuggestions(searchTerm) {
        console.log("search term:", searchTerm);
    
        const autocompleteContainer = document.getElementById('autocomplete-suggestions');
        autocompleteContainer.innerHTML = '';
    
        if (!searchTerm || typeof searchTerm !== 'string') {
            return;
        }
    
        const matchingPlayers = jsonData.players.filter(player =>
            player.Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        matchingPlayers.forEach(player => {
            const suggestionItem = document.createElement('li');
            suggestionItem.textContent = player.Name;
            suggestionItem.addEventListener('click', () => {
                document.getElementById('player-guess').value = player.Name;
                autocompleteContainer.innerHTML = '';
            });
            autocompleteContainer.appendChild(suggestionItem);
        });
    }
    

    // Fetch JSON data and set up random player

    fetch('nba.json')
    .then(response => response.json())
    .then(data => {
        jsonData = data;
        randomPlayer = getRandomPlayer();
        console.log("Random Player:", randomPlayer);
        document.getElementById('submit-button').removeAttribute('disabled');

        // Populate the datalist with player names
        const datalist = document.getElementById('player-names');
        jsonData.players.forEach(player => {
            const option = document.createElement('option');
            option.value = player.Name;  // Use correct property name
            datalist.appendChild(option);
        });

        // Search bar functionality
        const searchBar = document.getElementById('player-guess');
        searchBar.addEventListener('input', displayAutocompleteSuggestions);
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