var titleCase = require('title-case');
var express = require('express');
var router = express.Router();
var Event = require('../models/event');

router.get('/search', function(req, res) {
    res.render('search');
});
router.get('/edit', function(req, res) {
    res.render('edit');
});
router.get('/update', function(req, res) {
    res.render('update');
});
router.get('/custom', function(req, res) {
    res.render('custom');
});


//retrieve all user provided event criteria for custom searching or updating
//removes all whitespace and coverts to title case
//only collects new data, any blank or untouched data will not be collected
//*** NOTE-any punctuation characters (eg :, ;, /, <, etc) will be replaced by a space ***

function allEventInfo(bodyData){
    var data = bodyData;
    let newData = {};
    Object.keys(data).forEach(function(prop){
        if(!(data[prop])){
            return;
        }else{
            newData[prop] = titleCase(data[prop].toLowerCase().trim());
        };
    }) 
    return newData;
}


//fires on submmit from register/index page - shows one new object
router.get('/new',function(req,res){
    Event.find({}).sort({_id : -1 }).limit(1).exec(function(err,docs){
        req.flash('success-msg', "Your new event has been added.");
        res.locals.message = req.flash();
        res.render('search',  {docs: docs});
    }); 
});


//get all in events collection essentially this is for when someone
//navigates to simply search for an event
router.get('/list',function(req,res){
    Event.find({},function(err,docs){
        if (err) res.send(err);
        res.render('search',  {docs: docs});       
    }); 
});

//get a custom search result based on user input criteria
router.post('/custom',function(req,res){
    var customData = allEventInfo(req.body);
    Event.find(customData,function(err,docs){
        if (err) res.send(err);
        res.render('custom',  {docs: docs});       
    }); 
});

//get event to edit
router.post('/edit',function(req,res){
    var id = req.param('toBeUpdated');
    Event.findOne({"_id": id}).limit(1).exec(function(err,docs){
        if (err) res.send(err);
        res.render('edit',  {docs: docs});       
    }); 
});

// update particular event
router.post('/update',function(req, res){
    var id = req.body.objID;                //id # is assigned on view-edit so as to display and use for query of actual _id
    var data = req.body;                    //required for table population in view-update
    var customData = allEventInfo(data);
    Event.updateOne({"_id": id}, {$set: customData}, function(err,docs){
        if (err) res.send(err);
        res.render('update', {data: data});           
        }) 
}); 

//remove particular event from database
router.get('/delete', function(req, res) {
    var id = req.query.id;
    Event.remove({"_id": id}, function(err, event) {
        if (err) res.send(err);
        res.redirect('/search/list');
    });
});


module.exports = router;