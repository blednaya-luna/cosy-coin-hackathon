import crypto from 'crypto';
import express from 'express';
import bodyParser from 'body-parser';
import { data as dataTX, broadcast, invokeScript } from '@waves/waves-transactions';

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;

const nodeUrl = 'https://nodes-testnet.wavesnodes.com';
const oracleSeed = 'six unlock sadness camera scrub above announce mixed elegant front cliff heart video practice alter';
const assetId = '27DyPeKHyRjKH4XjVeVa9uLYvUJvLTecT51P7c38vPaG';

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

	const signedDataTX = dataTX({
		data,
		chainId: 'T',
		fee: 500000,
	}, oracleSeed);

	await broadcast(signedDataTX, nodeUrl)
		.then((r) => res.send(r))
		.catch((e) => res.send(e));

	const signedTransferTX = invokeScript({
		dApp: '3N6ANu5s8SGmgQMsSpsAvhpS3XCDfcLdvfX',
		call: {
			function: 'transfer',
			args: []
		},
		payment: [
			{
				amount: 1,
				assetId,
			}
		],
		senderPublicKey: '4rc8Aajc7YNqQXTNrzVvsTiZKzZwzKWZ4JXr4N34wxTJ',
		chainId: 'T',
	}, 'grief february pool cherry venue bonus mule love other guard donkey live apple fall jewel');

	await broadcast(signedTransferTX, nodeUrl)
		.then((r) => console.info(r))
		.catch((e) => console.error(e));
})

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

