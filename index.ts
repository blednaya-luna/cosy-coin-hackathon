import crypto from 'crypto';
import express from 'express';
import bodyParser from 'body-parser';
import { data as dataTX, broadcast } from '@waves/waves-transactions';

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;

const nodeUrl = 'https://nodes-testnet.wavesnodes.com';
const oracleSeed = 'six unlock sadness camera scrub above announce mixed elegant front cliff heart video practice alter';

app.get('/hello-world', (req, res) => res.send('FAQ U'));

app.post('/oracle/write', async (req, res) => {
	const hash = crypto
		.createHash('sha256')
		.update(req.body.email)
		.digest('hex');

	const data = Object.entries(req.body).reduce((acc, [key, value]) => {
		acc.push({
			key: `${hash}_${key}`,
			type: typeof value,
			value: value,
		});
		return acc;
	}, []);

	const signerDataTX = dataTX({
		data,
		chainId: 'T',
		fee: 500000,
	}, oracleSeed);

	await broadcast(signerDataTX, nodeUrl)
		.then((r) => res.send(r))
		.catch((e) => res.send(e));
})

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

