const express = require("express");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let gamer = {
    name: '',
    surname: '',
    score: 0
};
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

app.route('/hola')
    .get(function (req, res) {
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
            //! If Name and Surname is repe  ated
            if (gamer.name == req.body.name && gamer.surname == req.body.surname) {
                output = {
                    error: true,
                    errCode: 503,
                    message: 'The player was alredy existing'
                };
            }
            //* If Name AND Surname are original
            else {
                //Get correct inputs
                gamer = {
                    name: req.body.name,
                    surname: req.body.surname,
                    score: req.body.score
                };
                //Set output to correct fields
                output = {
                    error: false,
                    errCode: 200,
                    message: 'Player created',
                    output: gamer
                };
            }
        }
        // Send output
        res.send(output);
    })

app.listen(3000, () => {
    console.log("The server is starting at port 3000");
});
//AA