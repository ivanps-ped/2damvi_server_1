const express = require("express");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let gamer = {
    position: '',
    alias: '',
    name: '',
    surname: '',
    score: 0
};

let gamerArray = [
    gamer = {
        position: 1,
        alias: 'iperez',
        name: 'ivan',
        surname: 'perez',
        score: 1000
    },
    gamer = {
        position: 3,
        alias: 'mmoñas',
        name: 'manolo',
        surname: 'moñas',
        score: 200
    }
]

let output = {
    error: false,
    errCode: 200,
    message: ''
};

app.route('/')
    .get(function (req, res) {
        output = {
            error: true,
            errCode: 20,
            message: 'This server works!'
        };
        res.send(output);
    });

app.get('/hola', function (req, res) {
    res.send("Hi I guess...");
});

app.route('/gamer')
    //If enter with Get
    .get(function (req, res) {
        res.send('You must provide a JSON structure, for that purpose use POST');
    })
    //If enter with Post
    .post(function (req, res) {
        //! In case there's not enought fields
        if (!req.body.name || !req.body.surname || !req.body.score) {
            output = {
                error: true,
                errCode: 502,
                message: 'Required fields: name, surname, score'
            };
        }
        //If correct fields
        else {
            //* If Name AND Surname are original
            //Get correct inputs
            gamer = {
                alias: req.body.name.charAt(0) + req.body.surname,
                position: 1,
                name: req.body.name,
                surname: req.body.surname,
                score: req.body.score,
            };
            //Set output to correct fields
            output = {
                error: false,
                errCode: 200,
                message: 'Player created',
                output: gamer
            };
            //! If Name and Surname is repeated
            gamerArray.forEach(function (item, index, array) {
                if (gamer.name == gamerArray[index].name && gamer.surname == gamerArray[index].surname) {
                    output = {
                        error: true,
                        errCode: 503,
                        message: 'The player was alredy existing'
                    };
                }
            })
            //Add new User to "Database" array
            let newGamer = gamerArray.push(gamer);
        }
        // Send output
        res.send(output);
    })

//Use Query Parameters
app.route('/gamer/:user')
    //Get user information
    .get(function (req, res) {    
        output = {
            error: true,
            errCode: 504,
            message: 'The player does not exist'
        };    
        for (var i = 0; i < gamerArray.length; i++){
            if (gamerArray[i].alias == req.params.user){
                output = gamerArray[i];       
            }
        }
        
        res.send(output);
    })
    //Post user information
    .post(function (req, res) {
        
    })

app.get('/ranking', function (req, res) {
    //Order Array by Score (Using Bubble method)
    for (var i = 0; i < gamerArray.length; i++) {
        for (var j = 1; j < gamerArray.length - i; j++) {
            if (gamerArray[j - 1].score < gamerArray[j].score) {
                var temp = gamerArray[j - 1].score;
                gamerArray[j - 1].score = gamerArray[j].score;
                gamerArray[j].score = temp;
            }
        }
    }
    //Change "Position" using real Array position
    for (var i = 0; i < gamerArray.length; i++) {
        gamerArray[i].position = i + 1;
    }
    //Show total Ranking
    res.send(gamerArray);
})

app.listen(3000, () => {
    console.log("The server is starting at port 3000");
});