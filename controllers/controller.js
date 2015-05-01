var express = require('express')
  , http = require('http')
  , path = require('path')
  , model = require('../classes/model');
  
exports.login = function(req,res){
model.Admin.findOne({email:req.body.email, password:req.body.password}, function(err,admin){
		if(admin){
			req.session.lastPage = '/Dashboard';
			res.redirect('/Dashboard/'+admin._id);
		}
		else{
			res.render("login",{title:"Admin Login", session:false, error:"Wrong username or password. Please try again."});
			//res.json({response:"no admin found", error:1});
		}
	});	
};
exports.logout = function(req,res){
model.Admin.findOne({email:req.body.email, password:req.body.password}, function(err,admin){
		req.session.destroy(function() {
			res.redirect('/');
		});
	});	
};

exports.verifyUser = function(req,res){
	model.Admin.findOne({email:req.body.email, password:req.body.password}, function(err,admin){
		if(admin){
			req.session.name = admin._id;
			req.session['username'] = admin.email;
			res.redirect('/');
		}
		else{
			res.render("login",{title:"Admin Login", session:false, error:"Wrong username or password. Please try again."});
			//res.json({response:"no admin found", error:1});
		}
	});		
};

exports.dashboard = function (req,res){
	if(req.session.name){
		req.session.lastPage = '/Dashboard';
		res.render("dashboard",{title:"Welcome to the MAW Search tool", session:true, email:req.session['username']});	
	}
	else{
		res.render("dashboard",{title:"Welcome to the MAW Search tool", session:false});
	}
};
exports.searchScores = function (req,res){
	//console.log(res.session.lastPage);
	req.session.lastPage = '/Dashboard/Scores';
	model.Category.find({}, null, {sort: {name: 1}}, function(err,categories){
		var query = model.Library.find({}, null, {sort: {lib_id: 1}}).limit(10); 
		query.exec(function(err,libraries){
			if(categories.length>0){
				res.render("scores_search",{
											title:"Searching in: Scores", 	
											categories:categories, 
											session:req.session.name? true:false,
											email:req.session['username']
				});
			}
			else{
				res.json({response:"not found", error:1});
			}
		});
	});	
};

exports.getScore = function (req,res){
	model.Library.findOne({_id:req.params.id}, function(err,score){
		model.Category.find({}, null, {sort: {name: 1}}, function(err,categories){
			if(score){
				res.render('edit_item', {
					title:"Editing - " + score.title, 	
					session:req.session.name? true:false,
					email:req.session['username'],
					type:"score",
					categories: categories,
					score: score,
				});
			}
			else{
				res.redirect('/');
			}
		});
	});
};
exports.newScore = function (req,res){
	model.Category.find({}, null, {sort: {name: 1}}, function(err,categories){
		model.Library.findOne().sort('-lib_id').exec(function(err, score) {
			res.render('create_item', {
										title:"New Score", 	
										session:req.session.name? true:false,
										type: "score",
										categories:categories,
										email:req.session['username'],
										id:score.lib_id+1
			});
		});
	});
};
exports.updateScore = function(req,res){
	model.Library.findOneAndUpdate({_id:req.body.score_id},
		   {$set:{
		   			category:req.body.category,
		   			composer: req.body.composer,
		   			title: req.body.title,
		   			edition:req.body.edition,
		   		}
		   	}, 
		   	function(err,score){
			   	if(score){
					res.redirect('/Dashboard/Scores');
			   	}
			   	else{
			   		res.json({response:"no score found", status:false, error:err});
				}
	});
};
exports.searchRecordings = function (req,res){
	req.session.lastPage = '/Dashboard/Recordings';
	res.render("recordings_search",{
									title:"Searching in: Recordings", 	
									session:req.session.name? true:false,
									type: "score",
									email:req.session['username']
				});
};

exports.getRecording = function (req,res){
	Recording.findOne({_id:req.params.id}, function(err,recording){
		if(recording){
			res.render('edit_item', {
				title:"Editing - " + recording.title, 	
				session:req.session.name? true:false,
				recording: recording,
				type: "recording",
				email:req.session['username']
			});
		}
		else{
			res.redirect('/');
		}
	});
};
exports.newRecording = function (req,res){
	model.Recording.findOne().sort('-rec_id').exec(function(err, recording) {
		res.render('create_item', {
									title:"New Recording", 	
									session:req.session.name? true:false,
									type: "recording",
									email:req.session['username'],
									id: recording.rec_id+1
		});
	});
};
exports.updateRecording = function(req,res){
	model.Recording.findOneAndUpdate({_id:req.body.recording_id},
		   {$set:{
		   			cd_number:req.body.cd_number,
		   			composer: req.body.composer,
		   			title: req.body.title,
		   			artist:req.body.artist,
		   		}
		   	}, 
		   	function(err,recording){
			   	if(recording){
					res.redirect('/Dashboard/Recordings');
			   	}
			   	else{
			   		res.json({response:"no recording found", status:false, error:err});
				}
	});
};
exports.searchScoresRequest = function (req,res){
	console.log("category: "+JSON.stringify(req.body));
	var find_query = {};
	/*var query_type = "$or";
	find_query[query_type]=[];
	if(req.body.category!=0){
		find_query[query_type].push({"category":req.body.category});
	}
	if(req.body.composer.length>0){
		find_query[query_type].push({"composer":new RegExp(req.body.composer, "i")});
	}
	if(req.body.title.length>0){
		find_query[query_type].push({"title":new RegExp(req.body.title, "i")});
	}*/
	
	if(req.body.category!=0){
		find_query["category"] = req.body.category;
	}
	if(req.body.composer.length>0){
		find_query["composer"] = new RegExp(req.body.composer, "i");
	}
	if(req.body.title.length>0){
		find_query["title"] = new RegExp(req.body.title, "i");
	}
	if(req.body.lib_id.length>0){
		find_query["lib_id"] = req.body.lib_id;
	}

	console.log(find_query);
	var query;
	query = model.Library.find(find_query, null, {sort: {category: 1, title:1}}).limit(10000000000); 
	query.exec(function(err,libraries){
		if(libraries){
				res.json({
							status:"200", 
							response:libraries.length? libraries.length:0, 
							list:libraries, type:"score", 
							session:req.session.name? true:false,
				});
		}
		else{
			res.json({status:"200", response:0});
		}
	});
};

exports.searchRecordingsRequest = function (req,res){
	console.log("category: "+JSON.stringify(req.body));
	var find_query = {};

	if(req.body.composer.length>0){
		find_query["composer"] = new RegExp(req.body.composer, "i");
	}
	if(req.body.title.length>0){
		find_query["title"] = new RegExp(req.body.title, "i");
	}
	if(req.body.artist.length>0){
		find_query["artist"] = new RegExp(req.body.artist, "i");
	}

	console.log(find_query);
	var query;
	query = model.Recording.find(find_query, null, {sort: {title: 1}}).limit(10000000000); 
	query.exec(function(err,recordings){
		if(recordings){
				res.json({
							status:"200", 
							response:recordings.length? 
							recordings.length:0, 
							list:recordings, 
							type:"recording", 
							session:req.session.name? true:false,
				});
		}
		else{
			console.log("no hay");
		}
	});
};
