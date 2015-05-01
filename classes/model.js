var mongoose = require('mongoose');
var error = require('../classes/error');
var fs = require('fs');
//mongoose.connect("mongodb://iAmUser:iAmStudio1@ds053638.mongolab.com:53638/eventos");
mongoose.connect("mongodb://iAmUser:iAmStudio1@ds037478.mongolab.com:37478/maw");
var express = require('express');

//////////////////////////////////
//DB Schema CRUD starts here//////
//////////////////////////////////
//Admin
var AdminSchema= new mongoose.Schema({
	email: {type: String, required:true, unique:true,},
	password:  {type: String, required:true, unique:false,},
	type: {type: String, required:false, unique:false,},
});
	Admin= mongoose.model('Admin',AdminSchema);
	exports.Admin= mongoose.model('Admin',AdminSchema);

var RecordingsSchema= new mongoose.Schema({
	rec_id: {type: Number, required:false, unique:false,},
	cd_number:  {type: Number, required:false, unique:false,},
	composer:  {type: String, required:false, unique:false,},
	composer_id: {type: String, required:false, unique:false,},
	title: {type: String, required:false, unique:false,},
	artist: {type: String, required:false, unique:false,},
	artist_id: {type: String, required:false, unique:false,},
	instrumentation: {type: String, required:false, unique:false,},
	material_type: {type: String, required:false, unique:false,},
});
	Recording= mongoose.model('Recording',RecordingsSchema);
	exports.Recording= mongoose.model('Recording',RecordingsSchema);
	
var LibrarySchema= new mongoose.Schema({
	lib_id: {type: Number, required:false, unique:false,},
	category: {type: String, required:false, unique:false,},
	composer:  {type: String, required:false, unique:false,},
	composer_id: {type: String, required:false, unique:false,},
	title: {type: String, required:false, unique:false,},
	edition: {type: String, required:false, unique:false,},
	missing_parts: {type: String, required:false, unique:false,},
	condition: {type: String, required:false, unique:false,},
});
	Library= mongoose.model('Library',LibrarySchema);
	exports.Library= mongoose.model('Library',LibrarySchema);
	
var CategorySchema= new mongoose.Schema({
	name: {type: String, required:true, unique:true,},
});
	Category= mongoose.model('Category',CategorySchema);
	exports.Category= mongoose.model('Category',CategorySchema);

var ArtistSchema= new mongoose.Schema({
	name: {type: String, required:true, unique:true,},
});
	Artist= mongoose.model('Artist',ArtistSchema);
	exports.Artist= mongoose.model('Artist',ArtistSchema);

var ComposerSchema= new mongoose.Schema({
	name: {type: String, required:true, unique:true,},
});
	Composer= mongoose.model('Composer',ComposerSchema);
	exports.Composer= mongoose.model('Composer',ComposerSchema);


exports.createAdmin = function (req,res){

	new Admin({
		email: req.body.email,
		password: req.body.password,
		type:  'admin',
	}).save(function(err,user){
		if(err){
			res.json(err);
		}
		else{
			res.format({
				//html: function () { res.redirect('/Dashboard/'+req.body.admin_id); },
				json: function () { res.redirect('/Dashboard/Login'); },
			});	
		}
	});
}

exports.createScore = function (req,res){
	new Library(req.body).save(function(err,score){
		console.log("JSON: "+JSON.stringify(req.body));
		if(score){
			res.redirect('/Dashboard');
		}
		else{
			res.json({error:err, status:false})
		}
	});
}
exports.deleteScore = function(req,res){
	Library.remove({_id:req.body.score_id},function(err){
		if(err){
			res.json(error.notFound);
		}
		else{
			res.redirect('/Dashboard/Scores');
		}
	});
};
exports.createRecording = function (req,res){
	new Recording(req.body).save(function(err,recording){
		if(recording){
			res.redirect('/Dashboard');
		}
		else{
			res.json({error:err, status:false})
		}
	});
}
exports.deleteRecording = function(req,res){
	Recording.remove({_id:req.body.recording_id},function(err){
		if(err){
			res.json(error.notFound);
		}
		else{
			res.redirect('/Dashboard/Recordings');
		}
	});
};