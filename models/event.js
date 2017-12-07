var mongoose = require('mongoose');


var EventSchema   = new mongoose.Schema({
    activity: String,   
    date: String,
    start: String,
    end:  String,
    isActive: Boolean,
    creationDate: Object

});

var Event = module.exports = mongoose.model('Event', EventSchema);

