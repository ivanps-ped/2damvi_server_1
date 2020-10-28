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
    userNumber: 0,
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
                userNumber: gamerArray.length,
                message: 'The player was alredy existing'
            };
            break;
        case 504:
            output = {
                error: true,
                errCode: 504,
                userNumber: gamerArray.length,
                message: 'The player does not exist'
            };
            break;
        case 20:
            output = {
                error: false,
                errCode: 20,
                userNumber: gamerArray.length,
                message: 'This server works!'
            };
            break;
        case 505:
            output = {
                error: false,
                errCode: 200,
                userNumber: gamerArray.length,
                message: 'Player updated',
                output: gamerArray
            };
            break;
        default:
            break;
    }

};

function CheckIfAliasRepeated(aliasToCheck) {
    var isRepeated = false;
    var arrayIndex;
    gamerArray.forEach(function (item, index, array) {
        if (aliasToCheck == gamerArray[index].alias) {
            OutputCase(504);
            isRepeated = true;
            arrayIndex = index;
        }
    })
    return [isRepeated, arrayIndex];
};

function IsNull(nameToCheck, surnameToCheck, scoreToCheck) {
    if (!nameToCheck || !surnameToCheck || !scoreToCheck || scoreToCheck < 0) {
        output = {
            error: true,
            errCode: 502,
            userNumber: gamerArray.length,
            message: 'Required fields: name, surname, score'
        };
        return true;
    }
    return false;
};

function CreatePlayer(input, newAlias) {
    //* If Name AND Surname are original
    //Get correct inputs
    gamer = {
        alias: newAlias,
        position: 1,
        name: input.name,
        surname: input.surname,
        score: input.score,
    };
    //Add new User to "Database" array
    let newGamer = gamerArray.push(gamer);
    SortByScore();
    //Set output to correct fields
    output = {
        error: false,
        errCode: 200,
        userNumber: gamerArray.length,
        message: 'Player created',
        output: gamer
    };
};

function SortByScore() {
    gamerArray.sort((a, b) => Math.sign(b.score - a.score));
    gamerArray.forEach(function (item, index, array) {
        item.position = index+1;
    })
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
                CreatePlayer(req.body, req.body.name.charAt(0) + req.body.surname);
            }
        }
        // Send output
        res.send(output);
    })

//Use Query Parameters
app.route('/gamer/:user')
    //Get user information
    .get(function (req, res) {
        //Change to output error in advance (Player does not exist)
        OutputCase(504);
        //Change output if player exists
        for (var i = 0; i < gamerArray.length; i++) {
            if (gamerArray[i].alias == req.params.user) {
                output = gamerArray[i];
            }
        }
        res.send(output);
    })

    //Post user information
    .post(function (req, res) {
        //If valid parameters
        if (!IsNull(req.body.name, req.body.surname, req.body.score)) {
            //If player doesn't exist
            if (!CheckIfExists(req.body.name, req.body.surname)) {
                CreatePlayer(req.body, req.params.user);
            }
        }
        // Send output
        res.send(output);
    })

    //Update User (search by alias in URL)
    .put(function (req, res) {
        //Return where the user is in the Array
        var values = CheckIfAliasRepeated(req.params.user);
        //If valid input
        if (!IsNull(req.body.name, req.body.surname, req.body.score)) {
            //If user doesn't exists
            if (!values[0]) {
                OutputCase(504);
            }
            //If user exists (Substitute user)
            else {
                gamerArray[values[1]] = {
                    alias: req.params.user,
                    position: 1,
                    name: req.body.name,
                    surname: req.body.surname,
                    score: req.body.score,
                }
                //Set output to correct fields
                OutputCase(505);
            }
        }
        SortByScore();
        res.send(output);
    })

app.get('/ranking', function (req, res) {
    SortByScore();
    //Show total Ranking
    output = {
        error: false,
        errCode: 200,
        userNumber: gamerArray.length,
        message: 'Player created',
        output: gamerArray
    };
    res.send(output);
})

app.listen(3000, () => {
    console.log("The server is starting at port 3000");
});