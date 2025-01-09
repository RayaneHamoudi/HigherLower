let attemptCount = 0;
let gamewin = 0;
function displayResult(isCorrect) {
    const resultElement = document.getElementById('result');
    if (isCorrect) {
        // Display overall guess result
        resultElement.textContent = "Correct!";
        document.getElementById('submit-button').textContent = "Restart";
        attemptCount = 6
        gamewin = 1;   
    } else {
        // Player not found
        resultElement.textContent = "Incorrect. Try again!";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    let jsonData;
    let randomPlayer;
    attemptCount = 0; // Initialize attempt counter
    // Function to get a random player
    function getRandomPlayer() {
        const randomIndex = Math.floor(Math.random() * jsonData.players.length);
        return jsonData.players[randomIndex];
    }

    function displayAutocompleteSuggestions(searchTerm) {

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
            //test logging
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
        const lastNamePart = lastName.replace(/[^a-zA-Z ]/g, "").substring(0, 5).toLowerCase();
        const firstNamePart = firstName.replace(/[^a-zA-Z ]/g, "").substring(0, 2).toLowerCase();
        return `https://www.basketball-reference.com/req/202106291/images/headshots/${lastNamePart}${firstNamePart}01.jpg`;
    }
    // Function to compare player's guess with the correct answer
    function checkGuess() {
        
        // Create a new row for the guessed player's accolades
        const guessedPlayerRow = document.createElement('div');
        guessedPlayerRow.classList.add('guessed-player-row');
        const playerInfo = document.getElementById('player-info');
        
        // Get the user's guessed player
        const playerGuess = document.getElementById('player-guess').value;
        if (!jsonData) {return;}
        let guessedPlayer = jsonData.players.find(player => player.Name.toLowerCase() === playerGuess.toLowerCase());
        if (guessedPlayer== null && attemptCount<6) {
            document.getElementById('result').textContent="Enter a valid guess";
            return;
        }

        // Increment attempt counter
        attemptCount++;
        // Update the attempts display
        const attemptsElement = document.getElementById('attempts');
        attemptsElement.textContent = `Attempts: ${attemptCount}/6`;
        // Check if the maximum number of attempts has been reached
        if (attemptCount > 6) {
            // Display the game over message
            const resultElement = document.getElementById('result');
            resultElement.textContent = "Out of attempts! Game over!";
            // Optionally display the correct player
            const correctPlayerElement = document.getElementById('correct-player');
            correctPlayerElement.innerHTML = `<p>The correct player was: <strong>${randomPlayer.Name}</strong></p>`;
            document.getElementById('submit-button').addEventListener('click', location.reload());
            // Exit the function 
            return; 
        }
        
        // Compare the user's guessed player's accolades with the random player's accolades
        for (const accolade in guessedPlayer) {
            if (accolade !== "Name") {
                const guessedValue = guessedPlayer[accolade];
                const randomValue = randomPlayer[accolade];
                
                const accoladeElement = document.createElement('div');
                accoladeElement.classList.add('accolade-row');
                accoladeElement.innerHTML = `<span class= acc-name>${accolade}: <span class="accolade-value">${guessedValue}</span><span class="arrow"></span></span>`;
                
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
        displayResult(guessedPlayer == randomPlayer);
        
        
        // Create the player picture element
        if(gamewin==0){
            const guessedPlayerImage = getPlayerPictureUrl(guessedPlayer);
            const playerPictureElement = document.createElement('div');
            const playerNameElement = document.createElement('div');
            playerNameElement.innerHTML = `<p>${guessedPlayer.Name}</p>`
            playerPictureElement.innerHTML = `<img src="${guessedPlayerImage}" alt="${guessedPlayer.Name}" onerror="this.src='data/placeholder.jpg';" width="100" height="100"/>`;
            if (guessedPlayerRow) {
                guessedPlayerRow.prepend(playerPictureElement);
                guessedPlayerRow.prepend(playerNameElement)
            } else {
                playerInfo.appendChild(playerPictureElement);
                guessedPlayerRow.prepend(playerNameElement)
            }
        }
        //attempt limit
        if(attemptCount==6){
            document.getElementById('submit-button').textContent = "Restart";
            const correctPlayerElement = document.getElementById('correct-player');
            correctPlayerElement.innerHTML = `<p>The correct player was: <strong>${randomPlayer.Name}</strong></p>`;
            if(gamewin==1){correctPlayerElement.style.color = 'green'}
            //row for random player if game is lost 
            const randomPlayerRow = document.createElement('div');
            randomPlayerRow.classList.add('guessed-player-row');    
            //creates correct answer row
            if(gamewin == 0){
                for (const accolade in randomPlayer) {
                    if (accolade !== "Name") {
                        const randomValue = randomPlayer[accolade];
                        const randomAccoladeElement = document.createElement('div');
                        randomAccoladeElement.classList.add('accolade-row');
                        randomAccoladeElement.innerHTML = `<span class= acc-name>${accolade}: <span class="accolade-value">${randomValue}</span><span class="arrow"></span></span>`;
                        randomPlayerRow.appendChild(randomAccoladeElement);
                    }}
                    playerInfo.prepend(randomPlayerRow);
            }
            // Create the player picture element
            const randomPlayerImage = getPlayerPictureUrl(randomPlayer);    
            const playerPictureElement = document.createElement('div');
            const playerNameElement = document.createElement('div');
            playerNameElement.innerHTML = `<p>${randomPlayer.Name}</p>`
            playerPictureElement.innerHTML = `<img src="${randomPlayerImage}" alt="${randomPlayer.Name}" onerror="this.src='data/placeholder.jpg';"width="120" height="180"/>`;
            playerInfo.prepend(playerPictureElement);
            attemptCount++;
        }
        //clear text box
        document.getElementById('player-guess').value='';
    }
    //detect click or enter
    document.getElementById('submit-button').addEventListener('click', checkGuess);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            checkGuess();
        }
    }); 
});
