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

let path = require("path")
const fs = require('fs')

module.exports.displaySurveyList = (req, res, next) => {
    Survey.find((err, surveyList) => {
        if (err) {
            return console.error(err);
        } else {
            //console.log(surveyList)

            if (req.user) {
                surveyList.sort((a, b) => {
                    let x = (a.owner._id.toString() == req.user._id.toString()) ? 1 : 0
                    let y = (b.owner._id.toString() == req.user._id.toString()) ? 1 : 0
                    return y - x
                })
            }
            res.render('survey/list', {
                title: 'Surveys', 
                SurveyList : surveyList, 
                today: today,
                displayName: req.user ? req.user.displayName : '',
                userId: req.user ? req.user._id : ''});
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
        for (j = 1; ; j++) {
            let y = eval("req.body.q" + i + "_" + j)
            if (y == null) {
                break
            }
            arr.push(y)
        }
        qs.push(arr)
    }

    let newSurvey = Survey({
        "owner": req.user._id,
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
            displayName: req.user ? req.user.displayName : ''});
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
        for (j = 1; ; j++) {
            let y = eval("req.body.q" + i + "_" + j)
            if (y == null) {
                break
            }
            arr.push(y)
        }
        qs.push(arr)
    }

    let updatedSurvey = Survey({
        "_id": id,
        "owner": req.user._id,
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

////////////////////////////////////////////////////

module.exports.performDownload =  (req, res, next) => {
    let id = req.params.id;
    result = path.join(__dirname, '../../public/assests', 'result.txt')
    fs.writeFile(result, '', function(){})

    Survey.findById(id, (err, surveyToDownload) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            let arrr = surveyToDownload.responses
            let arrr2 = ["          "]
            for (let i = 0; i < arrr[0].length; i++) {
                arrr2.push("Question " + (i + 1))
            }

            fs.writeFileSync(result, arrr2.join("  ") + "\n", {'flag':'a'}, function(err) {
                if (err) {
                    return console.error(err);
                }
            })

            for (let i = 0; i < arrr.length; i++) {
                fs.writeFileSync(result, "Response " + (i + 1) + "      " +  arrr[i].join("           ") + "\n", {'flag':'a'}, function(err) {
                    if (err) {
                        return console.error(err);
                    }
                })
            }
            res.download(result, surveyToDownload.title + ' result.txt')
        }
    })
}

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
                "owner": surveyToView.owner,
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