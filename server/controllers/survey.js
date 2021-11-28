/*
Name: Peyman Moshfegh
ID: 301151808
Date: 10/29/2021
*/

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
const survey = require('../models/survey');

// connect to our Survey Model
let Survey = require('../models/survey');

let moment = require('moment');
const today = moment().format().split('T')[0]

module.exports.displaySurveyList = (req, res, next) => {
    Survey.find((err, surveyList) => {
        if (err) {
            return console.error(err);
        } else {
            //console.log(SurveyList);

            res.render('survey/list', {
                title: 'Surveys', 
                SurveyList : surveyList, 
                today: today,
                displayName: req.user ? req.user.displayName : ''});
        }
    });

};

module.exports.displayAddPage = (req, res, next) => {
    res.render('survey/add', {title: 'Add Survey', 
    displayName: req.user ? req.user.displayName : ''});
}

module.exports.processAddPage = (req, res, next) => {

    const qs = []
    for (i = 1; ;i++) {
        let x = eval("req.body.q" + i)
        if (x == null) {
            break
        }
        const arr = [x]
        for (j = 1; j < 5; j++) {
            arr.push(eval("req.body.q" + i + "_" + j))
        }
        qs.push(arr)
    }

    let newSurvey = Survey({
        "title": req.body.title,
        "startDate": req.body.startDate,
        "endDate": req.body.endDate,
        "questions": qs

    });

    Survey.create(newSurvey, (err, Survey) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            // refresh the survey list
            res.redirect('/survey-list');
        }
    });
}

module.exports.displayEditPage = (req, res, next) => {
    let id = req.params.id;

    Survey.findById(id, (err, surveyToEdit) => {
        if (err) {
            console.log(err);
            res.end(err);    
        } else {
            //show the edit view
            res.render('survey/edit', {title: 'Edit Survey', survey: surveyToEdit, 
            displayName: req.user ? req.user.displayName : ''})
        }
    })
}

module.exports.processEditPage =  (req, res, next) => {
    let id = req.params.id;

    const qs = []
    for (i = 1; ;i++) {
        let x = eval("req.body.q" + i)
        if (x == null) {
            break
        }
        const arr = [x]
        for (j = 1; j < 5; j++) {
            arr.push(eval("req.body.q" + i + "_" + j))
        }
        qs.push(arr)
    }

    let updatedSurvey = Survey({
        "_id": id,
        "title": req.body.title,
        "startDate": req.body.startDate,
        "endDate": req.body.endDate,
        "questions": qs
    });

    Survey.updateOne({_id: id}, updatedSurvey, (err) => {
        if (err) {
            console.log(err);
            res.end(err);    
        } else {
            // refresh the survey list
            res.redirect('/survey-list');
        }
    });

}

module.exports.performDelete =  (req, res, next) => {
    let id = req.params.id;

    Survey.remove({_id: id}, (err) => {
        if (err) {
            console.log(err);
            res.end(err);    
        } else {
            // refresh the survey list
            res.redirect('/survey-list');
        }
    });
}

/////////////////////////////////////////

module.exports.displayViewPage = (req, res, next) => {
    let id = req.params.id;

    Survey.findById(id, (err, surveyToView) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            if (surveyToView.startDate > today || today > surveyToView.endDate) {
                res.end("<h1>Survey not started or expired!</h1>")
            } else {
            //show the view view
            res.render('survey/view', {title: 'View Survey', survey: surveyToView, 
            displayName: req.user ? req.user.displayName : ''})
            }
        }
    })
}

module.exports.processViewPage =  (req, res, next) => {
    let id = req.params.id;

    Survey.findById(id, (err, surveyToView) => {
        if (err) {
            console.log(err);
            res.end(err);    
        } else {
            const response = []
            for (i = 1; ;i++) {
                let x = eval("req.body.q" + i)
                if (x == null) {
                    break
                }
                response.push(x)
            }
        
            arrr = surveyToView.responses
            arrr.push(response)

            let updatedSurvey = Survey({
                "_id": id,
                "title": surveyToView.title,
                "startDate": surveyToView.startDate,
                "endDate": surveyToView.endDate,
                "questions": surveyToView.questions,
                "responses": arrr
            });
        
            Survey.updateOne({_id: id}, updatedSurvey, (err) => {
                if (err) {
                    console.log(err);
                    res.end("err");    
                } else {
                    // refresh the survey list
                    res.redirect('/survey-list');
                }
            });
        }
    })
}