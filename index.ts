import crypto from 'crypto';
import express from 'express';
import bodyParser from 'body-parser';
import { data as dataTX, broadcast } from '@waves/waves-transactions';

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;

const nodeUrl = 'https://nodes-testnet.wavesnodes.com';
const oracleSeed = 'cross vapor tornado material learn other amount soon still analyst inch unknown vessel aware feed';

app.get('/hello-world', (req, res) => res.send('FAQ U'));

app.get('/oracle/write', async (req, res) => {
	const data = {
		data: [
			{
				key: 'test_key',
				type: 'integer',
				value: 1,
			},
		],
		chainId: 'T',
	}

	const signerDataTX = dataTX(data, oracleSeed);

	await broadcast(signerDataTX, nodeUrl)
		.then((r) => res.send(r))
		.catch((e) => res.send(e));
})

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
	}, oracleSeed);

	await broadcast(signerDataTX, nodeUrl)
		.then((r) => {
			res.send(r);
			console.info('response sent: ', r);
		})
		.catch((e) => {
			res.send(e);
			console.error('error sent: ', e);
		});
})

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

