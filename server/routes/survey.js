/*
Name: Peyman Moshfegh
ID: 301151808
Date: 10/29/2021
*/

let express = require('express');
let router = express.Router();

let passport = require('passport');

// Connect to survey controller
let surveyController = require('../controllers/survey');

// helper function for guard purposes
function requireAuth(req, res, next) {
    // check if the user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

/* GET Route for the Survey List page - READ operation. */
router.get('/', surveyController.displaySurveyList);

/* GET Route for displaying the Add page - CREATE operation. */
router.get('/add', requireAuth, surveyController.displayAddPage);

/* POST Route for processing the Add page - CREATE operation. */
router.post('/add', requireAuth, surveyController.processAddPage);

/* GET Route for displaying the Edit page - UPDATE operation. */
router.get('/edit/:id', requireAuth, surveyController.displayEditPage);

/* POST Route for processing the Edit page - UPDATE operation. */
router.post('/edit/:id', requireAuth, surveyController.processEditPage);

/* GET Route to perform Deletion - DELETE operation. */
router.get('/delete/:id', requireAuth, surveyController.performDelete);


/* GET Route for displaying the View page - ?? operation. */
router.get('/view/:id', surveyController.displayViewPage);

/* POST Route for processing the View page - ?? operation. */
router.post('/view/:id', surveyController.processViewPage);


module.exports = router;