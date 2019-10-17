'use strict'
const express = require('express')
let bodyParser = require('body-parser')
let multer = require('multer');
let upload = multer({ storage: multer.memoryStorage() });
const app = express()

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/nuk";
let dbo;

MongoClient.connect(url, 
  function(err, db) {
	if (err) throw err;
	console.log("Database created!");
	dbo = db.db('nuk');
});


app.post('/', upload.single('image'), (req, res) => {
	// console.log(req.body);

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

	let payload = JSON.parse(req.body.jsonstr)

	const d = new Date();
	const dd = d.getDate();  
	const mm = d.getMonth() + 1;  
	const yy = d.getFullYear();
	let date = dd + '-' + mm + '-' +yy

	let timestamp = d.getHours() + ':' +d.getMinutes() + ':' + d.getSeconds();
	
	let arr = payload.FaceRec.face_array;

	for(let i=0; i<arr.length; i++){

		//payload.FaceRec.face_array[i].name
		
		console.log(payload.FaceRec.face_array[i].rect)

		dbo.collection('Attendeance').insertOne({
			name: payload.FaceRec.face_array[i].name,
			date: date,
			time: timestamp,
			image: 'test'
		});
		
		console.log("1 document inserted")

		
	}	

	res.setHeader('ok', 'True');
	res.setHeader('jsonstr', '{}');
	res.setHeader('image_encode', 'jpg');
	res.end(0, 'binary');

});
console.log('############################')
// console.log(app.listen('1337'));
app.listen('1337')
