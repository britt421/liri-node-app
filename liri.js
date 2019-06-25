//Reads and sets environment variables with the dotenv package:
require("dotenv").config();

//Imports the key.js file and stores it in a variable
var keys = require("./keys.js");

// Declares variables for dependencies 
Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
var fs = require("fs");
var axios = require("axios");
var chalk = require("chalk");

// Variable for user commands ("concert-this" "spotify-this-song" "movie-this" "do-what-it-says")
var command = process.argv[2];

// Variable for user data inputs
var userInput = process.argv.splice(3).join(" ");


// Bands in Town function
function concert(userInput) {
    // Use axios to get data from Bands in Town API
    axios.get("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp").then(
        function (response) {
            var date = moment(response.data[0].datetime).format('MM/DD/YYYY');
            console.log(chalk.bold("Venue name: ") + response.data[0].venue.name);
            console.log(chalk.bold("Venue location: ") + response.data[0].venue.city);
            console.log(chalk.bold("Date: ") + date);
            console.log(chalk.blue(("=============================================")));
        }
    )
        // Is there is an error
        .catch(
            function (err) {
                console.log("Error occurred: " + err);
            }
        )


};


// Spotify function
function spotifySearch(userInput) {
    // If the user inputs nothing, use the song, "The Sign"
    if (!userInput) {
        userInput = "The Sign by Ace of Base";
        spotifySearch(userInput);
    }
    // Or search whatever track they input and limit the search to 1 result
    else {
        spotify.search({
            type: "track",
            query: userInput,
            limit: 1
        })
            .then(function (response) {
                let songObject = response.tracks.items;
                // console.log(response);
                for (i = 0; i < songObject.length; i++) {
                    console.log(chalk.bold("Artist: ") + songObject[i].artists[i].name);
                    console.log(chalk.bold("Song name: ") + songObject[i].name);
                    console.log(chalk.bold("Preview: ") + songObject[i].preview_url);
                    console.log(chalk.bold("Album name: ") + songObject[i].album.name);
                    console.log(chalk.blue(("=============================================")))
                };
            })
            // If there is an error
            .catch(
                function (err) {
                    console.log("Error occurred: " + err);
                }
            )



    }
};


// OMDB function
function movie(userInput) {
    // If the user inputs nothing, display data for the movie, "Mr. Nobody"
    if (!userInput) {
        userInput = "mr nobody";
        movie(userInput);
    }
    // Or search for whatever the user inputs using axios and the OMDB API
    else {
        axios.get("http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy").then(
            function (response) {
                console.log(chalk.bold("Title: ") + response.data.Title);
                console.log(chalk.bold("Year: ") + response.data.Year);
                console.log(chalk.bold("IMDB rating: ") + response.data.imdbRating);
                console.log(chalk.bold("Rotten Tomatoes: ") + response.data.Ratings[1].Value);
                console.log(chalk.bold("Country: ") + response.data.Country);
                console.log(chalk.bold("Language: ") + response.data.Language);
                console.log(chalk.bold("Plot: ") + response.data.Plot);
                console.log(chalk.bold("Actors: ") + response.data.Actors);
                console.log(chalk.blue(("=============================================")));
            }
        )
            // If there is an error
            .catch(
                function (err) {
                    console.log("Error occurred: " + err);
                }
            )

    }
};

// Do What It Says (fs) function
function doWhatItSays() {
    // Access the text content in random.txt using the fs package
    fs.readFile("random.txt", "utf8", function (error, content) {
        if (error) {
            return console.log(error);
        }
        console.log(content);

        // Makes the content an array and divides it at the comma
        var array = content.split(",");

        // The first item in the array is equal to the command. The second item is equal to userInput.
        var command = array[0];
        let userInput = array[1];

        // Function that runs whatever command is first in the array in the random.txt file
        function doSearch() {
            if (command === "concert-this") {
                concert(userInput);
            } else if (command === "spotify-this-song") {
                spotifySearch(userInput);
            } else if (command === "movie-this") {
                movie(userInput);
            }
        }
        doSearch();
    });
};

// Switch/case function to make the program work
function liri() {
    switch (command) {
        case "concert-this":
            concert(userInput)
            break;
        case "spotify-this-song":
            spotifySearch(userInput)
            break;
        case "movie-this":
            movie(userInput)
            break;
        case "do-what-it-says":
            doWhatItSays()
            break;
    }
} liri();