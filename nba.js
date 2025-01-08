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
    let attemptCount = 0; // Initialize attempt counter


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
                option.value = player.Name; // Use correct property name
                datalist.appendChild(option);
            });

            // Search bar functionality
            const searchBar = document.getElementById('player-guess');
            searchBar.addEventListener('input', displayAutocompleteSuggestions);
        })
        .catch(error => console.error('Error fetching data', error));

    // Function to generate player picture URL
    function getPlayerPictureUrl(player) {
        const [firstName, lastName] = player.Name.split(' ');
        const lastNamePart = lastName.substring(0, 5).toLowerCase();
        const firstNamePart = firstName.substring(0, 2).toLowerCase();
        return `https://www.basketball-reference.com/req/202106291/images/headshots/${lastNamePart}${firstNamePart}01.jpg`;
    }

    // Function to compare player's guess with the correct answer
    function checkGuess() {
        console.log("Checking guess...");

         // Increment attempt counter
         attemptCount++;
         console.log(`Attempt ${attemptCount}`);

         // Update the attempts display
        const attemptsElement = document.getElementById('attempts');
        attemptsElement.textContent = `Attempts: ${attemptCount}/6`;

            // Check if the maximum number of attempts has been reached
    if (attemptCount > 6) {
        // Disable the submit button
        //document.getElementById('submit-button').disabled = true;
        

        // Display the game over message
        const resultElement = document.getElementById('result');
        resultElement.textContent = "Out of attempts! Game over!";

        // Optionally display the correct player
        const correctPlayerElement = document.getElementById('correct-player');
        correctPlayerElement.innerHTML = `
            <p>The correct player was: <strong>${randomPlayer.Name}</strong></p>
        `;
        document.getElementById('submit-button').addEventListener('click', location.reload());
        return; // Exit the function to prevent further processing
        }
        if(attemptCount==6){
            document.getElementById('submit-button').textContent = "Restart";

        }

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

        const playerInfo = document.getElementById('player-info');

        // Create a new row for the guessed player's accolades
        const guessedPlayerRow = document.createElement('div');
        guessedPlayerRow.classList.add('guessed-player-row');



        
        // Compare the user's guessed player's accolades with the random player's accolades
        for (const accolade in guessedPlayer) {
            if (accolade !== "Name") {
                const guessedValue = guessedPlayer[accolade];
                const randomValue = randomPlayer[accolade];

                const accoladeElement = document.createElement('div');
                accoladeElement.classList.add('accolade-row');
                accoladeElement.innerHTML = `<span>${accolade}: <span class="accolade-value">${guessedValue}</span><span class="arrow"></span></span>`;

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

        // Display the guessed player's accolades
        playerInfo.prepend(guessedPlayerRow);

        // Display the correct answer
        displayResult(guessedPlayer === randomPlayer);
        console.log("Guess checked!"); 
            // Create the player picture element
            const guessedPlayerImage = getPlayerPictureUrl(guessedPlayer);
            const playerPictureElement = document.createElement('div');
    
            playerPictureElement.innerHTML = `
                <img src="${guessedPlayerImage}" alt="${guessedPlayer.Name}" onerror="this.src='placeholder.jpg';" />
                <p>${guessedPlayer.Name}</p>`;
            if (guessedPlayerRow) {
                guessedPlayerRow.prepend(playerPictureElement);
            } else {
                console.error('Element with class "guessed-player-row" not found.');
                    playerInfo.appendChild(playerPictureElement);
            
        
        }}

    document.getElementById('submit-button').addEventListener('click', checkGuess);
});
