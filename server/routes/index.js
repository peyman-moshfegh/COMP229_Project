/*
Name: Peyman Moshfegh
ID: 301151808
Date: 10/29/2021
*/

let express = require('express');
let router = express.Router();

let indexController = require('../controllers/index');

/* GET home page. */
router.get('/', indexController.displayHomePage);

/* GET home page. */
router.get('/home', indexController.displayHomePage);

/* GET About page. */
router.get('/about', indexController.displayAboutPage);

/* GET Projects page. */
router.get('/projects', indexController.displayProjectsPage);

/* GET Services page. */
router.get('/services', indexController.displayServicesPage);

/* GET Contact Us page. */
router.get('/contact', indexController.displayContactPage);

/* GET Route for displaying the Login page. */
router.get('/login', indexController.displayLoginPage);

/* POST Route for processing the Login page. */
router.post('/login', indexController.processLoginPage);

/* GET Route for displaying the Register page. */
router.get('/register', indexController.displayRegisterPage);

/* POST Route for processing the Register page. */
router.post('/register', indexController.processRegisterPage);

/* GET Route to perform user Logout */
router.get('/logout', indexController.performLogout);


let passport = require('passport');

// helper function for guard purposes
function requireAuth(req, res, next) {
    // check if the user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

/* GET Route for displaying the Update Profile page. */
router.get('/updateProfile', requireAuth, indexController.displayUpdateProfilePage);

/* POST Route for processing the Update Profile page. */
router.post('/updateProfile', requireAuth, indexController.processUpdateProfilePage);


module.exports = router;
