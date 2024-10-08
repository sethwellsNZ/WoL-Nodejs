const { exec } = require('child_process');
const express = require('express');
const bodyParser = require('body-parser');

const argv = require('minimist')(process.argv.slice(2));

const app = express();

if (argv['_'][0] === undefined || argv['h'] !== undefined || argv['help'] !== undefined) {
	console.log("Usage: WoL-Nodejs <MAC_ADDRESS> [-p PORT | default 3000]\n\nStarts a Node Express server to send Wake-on-LAN packets.\nSend a POST request to http://localhost:<PORT>/broadcast-wol to wake the specified device.\n\nExample: WoL-Nodejs 00:11:22:33:44:55 -p 8080\n\n");
	process.exit(1);
}

const port = argv['p'] === undefined ? 3000 : argv['p'];

app.post('/broadcast-wol', (req, res) => {
	try {
		console.log(`Post Received! Executing WoL scripts MAC=${argv['_'][0]}`);
		exec(`wakeonlan ${argv['_'][0]}`, (err, stdout, stderr) => {
			if (err) {
				throw new Error(err);
			}
			console.log(stdout);
			console.error(stderr);
		});
		res.status(200).json({ message: 'WoL broadcast succssful' });
	} catch (err) {
		console.error(`Error handling broadcast-wol request : ${err.message}`);
		res.status(500).json({ error: `Internal server error ${err.message}` });
	}
});

app.listen(port, () => {console.log(`listening for post on http://localhost:${port}/`);})
