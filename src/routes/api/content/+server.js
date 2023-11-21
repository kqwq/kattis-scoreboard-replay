import fs from 'fs';
import {parse} from 'csv-parse';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const comp_file = String(url.searchParams.get('file'))
	let location = `./static/${comp_file}`;
	const data = await new Promise(resolve => {
		const csv_data = [];
		fs.createReadStream(location)
			.pipe(parse())
			.on('data', row => {
				csv_data.push({
					name: row[1],
					problems: row.slice(6).map(s => {
						const match = s.match(/(\d+)\n(\d+) min/);
						if (match)
							return {attempts: parseInt(match[1]), time: parseInt(match[2])};
						return undefined;
					})
				})
			})
			.on('end', () => resolve(csv_data));
	})
	return json(data);
}