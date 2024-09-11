const { exec } = require('child_process');
const express = require('express');
const bodyParser = require('body-parser');

const argv = require('minimist')(process.argv.slice(2));

const app = express();
const port = 5656;

if (argv['_'][0] === undefined) {
	console.log("Usage: WoL-Nodejs <MAC_ADDRESS> [-p PORT]\nStarts an Express server to send Wake-on-LAN packets. Send a POST request to http://localhost:<PORT>/broadcast-wol to wake the specified device. Default port is 3000.\nExample: WoL-Nodejs 00:11:22:33:44:55 -p 8080");
} else {
	console.log(argv['_']);
}

app.post('/broadcast-wol', (req, res) => {
	try {
		console.log('Execting WoL script');
		exec(`wakeonlan ${argv[2]}'}`, (err, stdout, stderr) => {
			if (err) {
				return err;
			}
			console.log(stdout);
			console.error(stderr);
		});
		res.status(200).json({ message: 'WoL broadcast succssful' });
	} catch (err) {
		console.error(`Error handling broadcast-WoL : ${err.message}`);
		res.status(500).json({ error: `Internal server error ${err.message}` });
	}
});

app.listen(port, () => {console.log(`listening for post on http://localhost:${port}/`);})

