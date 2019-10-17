'use strict'
const express = require('express')
var bodyParser = require('body-parser')
let multer = require('multer');
let upload = multer({ storage: multer.memoryStorage() });


var DATABASEUSERNAME = 'admin2'
var DATABASEPASSWORD = '12345678'
var DATABASEHOST = '192.168.2.38'
var DATABASEPORT = 27017
var DATABASENAME = 'MTLINKi'


var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;    
MongoClient.connect('mongodb://'+DATABASEUSERNAME+':'+DATABASEPASSWORD+'@'+DATABASEHOST+':'+DATABASEPORT+'/'+DATABASENAME,function(err, db){  
      if(err) 
        console.log(err);
      else
      {
        console.log('Mongo Conn....');

      }
    });


const app = express()

app.post('/', upload.single('image'), (req, res) => {
	//console.log(req.body);

	if (typeof req.body.service_name === 'undefined' ||
		typeof req.body.jsonstr === 'undefined' ||
		typeof req.body.have_image === 'undefined' ||
		typeof req.file.buffer === 'undefined') {

		res.setHeader('ok', 'False');
		const msg = 'Some parameters undefined'
		res.setHeader('msg', msg);
		res.send()
		return
	}

	var payload = JSON.parse(req.body.jsonstr)
	console.log(payload)

	res.setHeader('ok', 'True');
	res.setHeader('jsonstr', '{}');
	res.setHeader('image_encode', 'jpg');
	res.end(0, 'binary');

});

app.listen('1337')
