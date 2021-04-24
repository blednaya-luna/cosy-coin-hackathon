import express from 'express';
import fetch from 'node-fetch'; // TODO
import { data as dataTX, broadcast } from '@waves/waves-transactions';

const app = express();

const PORT = 8000;

app.get('/hello-world', (req, res) => res.send('FAQ U'));

app.get('/oracle/write', async (req, res) => {
	const oracleSeed = 'cross vapor tornado material learn other amount soon still analyst inch unknown vessel aware feed';
	const nodeUrl = 'https://nodes-testnet.wavesnodes.com';

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

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

