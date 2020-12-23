const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const multerConfig = require('./config/multer');
const multer = require('multer');

app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.get('/', function (req, res) {
	res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
})

app.get('/video/:name', function (req, res) {
	const { name } = req.params;
	const videoPath = path.resolve(__dirname, '..', 'assets', name + '.mp4');
	const stat = fs.statSync(videoPath);
	const fileSize = stat.size;
	const range = req.headers.range;

	if (range) {
		const parts = range.replace(/bytes=/, "").split("-");
		const start = parseInt(parts[0], 10);
		const end = parts[1]
			? parseInt(parts[1], 10)
			: fileSize - 1;

		if (start >= fileSize) {
			res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
			return;
		}

		const chunksize = (end - start) + 1;
		const file = fs.createReadStream(videoPath, { start, end });
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		}

		res.writeHead(206, head);
		file.pipe(res);
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		};
		res.writeHead(200, head);
		fs.createReadStream(videoPath).pipe(res);
	}
})

app.post('/video', multer(multerConfig).single('video'), async (req, res) => {
	console.log('Video has been uploaded');
	return res.send({ sucess: 'Video has been uploaded' });
});

app.listen(3000, function () {
	console.log('Listening on port 3000!');
})
