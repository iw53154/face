'use strict'
const express = require('express')
var bodyParser = require('body-parser')
let multer = require('multer');
let upload = multer({ storage: multer.memoryStorage() });

const rosnodejs = require('rosnodejs');

rosnodejs.initNode('/cira_rest_server');

const CiraFlowService = rosnodejs.require('cira_msgs').srv.CiraFlowService;
const CompressedImage = rosnodejs.require('sensor_msgs').msg.CompressedImage;

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

	const nh = rosnodejs.nh;
	nh.waitForService(req.body.service_name, 1000)
		.then((available) => {
			if (available) {

				const serviceClient = nh.serviceClient(req.body.service_name, CiraFlowService);
				const req_ = new CiraFlowService.Request();

				req_.flow_in.jsonstr = req.body.jsonstr

				if (req.body.have_image == 'True') {
					let cm = new CompressedImage();
					cm.format = req.body.image_encode;
					cm.data = req.file.buffer
					req_.flow_in.img = cm
				}

				try {
					serviceClient.call(req_).then((resp_) => {
						if (resp_.flow_out.jsonstr) {
							res.setHeader('ok', 'True');
							res.setHeader('jsonstr', resp_.flow_out.jsonstr);
							res.setHeader('image_encode', resp_.flow_out.img.format);
							res.end(resp_.flow_out.img.data, 'binary');
						} else {
							const msg = 'Service call error';
							res.setHeader('ok', 'False');
							res.setHeader('msg', msg);
							rosnodejs.log.info(msg);
							res.send()
						}
					});
				} catch (error) {
					const msg = 'Service call error';
					res.setHeader('ok', 'False');
					res.setHeader('msg', msg);
					rosnodejs.log.info(msg);
					res.send()
				}

			} else {
				const msg = 'Service [' + req.body.service_name + '] not available';
				res.setHeader('ok', 'False');
				res.setHeader('msg', msg);
				rosnodejs.log.info(msg);
				res.send()
			}
		});
});

app.listen('1337')
