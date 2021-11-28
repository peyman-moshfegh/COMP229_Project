/*
Name: Peyman Moshfegh
ID: 301151808
Date: 10/29/2021
*/

let mongoose = require('mongoose');

// create a model class
let surveyModel = mongoose.Schema({
    title: String,
    startDate: String,
    endDate: String,
    questions: [],
    responses: []
},
{
    collection: "surveys"
});

module.exports = mongoose.model('Survey', surveyModel);