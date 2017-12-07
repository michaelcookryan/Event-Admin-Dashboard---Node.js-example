var titleCase = require('title-case');
var express = require('express');
var router = express.Router();

var Event = require('../models/event');

// get register route
router.get('/register', function(req, res) {
    res.render('register');
});


//post event route
router.post('/register', function(req,res){
    var activity = req.body.activity.toLowerCase().trim();
    var date = req.body.date.trim();
    var start = req.body.start.trim();
    var end = req.body.end.trim();


    // validation
    req.checkBody('activity', 'Activity is required').notEmpty();
    req.checkBody('date', 'Date is required').notEmpty();
    req.checkBody('start', 'Start time is required').notEmpty();
    req.checkBody('end', 'End time is required').notEmpty();
 
    req.sanitize('activity').escape();
    req.sanitize('date').escape();
    req.sanitize('start').escape();
    req.sanitize('end').escape();
    req.sanitize('activity').trim();     
    req.sanitize('date').trim();
    req.sanitize('start').trim();     
    req.sanitize('end').trim();

    var errors = req.validationErrors();

    if(errors){
        res.render('register', {
            errors: errors
        })
    
    } else {
         var newEvent = new Event( {
            activity: titleCase(activity),
            date: date,
            start: start,
            end: end,
            isActive: false,
            creationDate: new Date()
         
       });
        newEvent.save(function(err, newEvent){ 
            if(err) throw err;    
        });
        req.flash('success_msg', "Your new event has been added.");
        res.redirect('/search/new'); //redirects and shows the new, single event

    }
});


module.exports = router;
