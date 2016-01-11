var express = require('express');
var request = require('request');
var gpio = require('pi-gpio');

var app = express();

var router = express.Router();

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public')); 
app.set('view engine', 'html');


app.use(function(req, res, next){
	console.log('%s %s', req.method, req.url);
	next();
});

app.get('/', function(req, res) {
	res.render('body', {
		responseObj : 0,
		title : "Project Wavelength",
		header : "Welcome to Project Wavelength : "
	});
});

app.get('/process', function(req, res) {
	var mototOnTime = req.query.MototOnTime;
	var mototOffTime = req.query.MototOffTime;
	var blobTime = req.query.BlobTime;
	var numberOffPics = req.query.NumberOffPics;
	var delay = req.query.Delay;
	
	var obj = {};
	obj.mototOnTime = mototOnTime;
	obj.mototOffTime = mototOffTime;
	obj.blobTime = blobTime*1000;
	obj.numberOffPics = numberOffPics;
	obj.delay = delay*1000;
	
	var picsTaken = 0;

	gpio.open(19, "output",function(err){
		if(err){
			console.log(err);
		}
	});

	gpio.open(26, "output",function(err){
		if(err){
			console.log(err);
		}
	});
	var intervalID = setInterval(function(){
		
		console.log("Number of Pictures taken : "+picsTaken);
		console.log("1");
		
		gpio.write(19,0,function(){
			console.log("Pic Turning On");
		});
		console.log("2");
		gpio.write(26,0,function(){
			console.log("Motor Turning Off");
		});
		console.log("3");
		setTimeout(function(){
			console.log("4");
			gpio.write(19,1,function(){
				console.log("Pic Turning Off");
			});
			gpio.write(26,1,function(){
				console.log("Motor Turning On");
			});
			console.log("5");
		},obj.blobTime);
		console.log("6");
		picsTaken++;
		if(picsTaken > numberOffPics){
			console.log("DONE...");
			clearInterval(intervalID);
			gpio.write(19,1,function(){
				gpio.close(19);
			});
			console.log("7");
			gpio.write(26,0,function(){
				gpio.close(26);
			});
			console.log("8");
		}
		console.log("9");
	}, obj.blobTime + obj.delay);
	

	res.render('body', {
		responseObj : obj,
		title : "Project Wavelength",
		header : "Welcome to Project Wavelength : "
	});
});


app.listen(80);
console.log('Express app started on port %d', 80);
