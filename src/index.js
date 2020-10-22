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
        position: 3,
        alias: 'mmoñas',
        name: 'manolo',
        surname: 'moñas',
        score: 200
    },
        gamer = {
        position: 1,
        alias: 'iperez',
        name: 'ivan',
        surname: 'perez',
        score: 1000
    },
];

let output = {
    error: false,
    errCode: 200,
    message: ''
};

function CheckIfExists(nameToCheck, surnameToCheck) {
    var isRepeated = false;
    gamerArray.forEach(function (item, index, array) {
        if (nameToCheck == gamerArray[index].name && surnameToCheck == gamerArray[index].surname) {
            OutputCase(503);
            isRepeated = true;
        }
    })
    return isRepeated;
};

function OutputCase(errorCode) {
    switch (errorCode) {
        case 503:
            output = {
                error: true,
                errCode: 503,
                message: 'The player was alredy existing'
            };
            break;
        case 20:
            output = {
                error: false,
                errCode: 20,
                message: 'This server works!'
            };
            break;
    }
};

function IsNull(nameToCheck, surnameToCheck, scoreToCheck) {
    if (!nameToCheck || !surnameToCheck || !scoreToCheck || scoreToCheck < 0) {
        output = {
            error: true,
            errCode: 502,
            message: 'Required fields: name, surname, score'
        };
        return true;
    }
    return false;
};

function CreatePlayer(input) {
    //* If Name AND Surname are original
    //Get correct inputs
    gamer = {
        alias: input.name.charAt(0) + input.surname,
        position: 1,
        name: input.name,
        surname: input.surname,
        score: input.score,
    };
    //Set output to correct fields
    output = {
        error: false,
        errCode: 200,
        message: 'Player created',
        output: gamer
    };
    //Add new User to "Database" array
    let newGamer = gamerArray.push(gamer);
};

app.route('/')
    .get(function (req, res) {
        OutputCase(20);
        res.send(output);
    });

app.get('/hola', function (req, res) {
    res.send("Hi I guess...");
});

app.route('/gamer')
    .get(function (req, res) {
        res.send('You MUST provide a JSON structure, for that purpose use POST');
    })

    .post(function (req, res) {
        //If valid parameters
        if (!IsNull(req.body.name, req.body.surname, req.body.score)) {
            //If player doesn't exist
            if (!CheckIfExists(req.body.name, req.body.surname)) {
                CreatePlayer(req.body);
            }
        }
        // Send output
        res.send(output);
    })

app.listen(3000, () => {
    console.log("The server is starting at port 3000");
});