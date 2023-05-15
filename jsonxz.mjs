import { Compressor, Decompressor } from "xz";
import fs from "fs";

/** Write an XZ compressed JSON file
 * @param {string} path path to file
 * @param {string | Buffer | Uint8Array} data data to write
 * @param {number} compression 1-9 compression level, 9 being the slowest and most compressed
 * @returns {Promise} resolves when file is written
 */
async function writeFile(path, data, compression=6){
	return new Promise((resolve, reject) => {
		const cxz = new Compressor({preset:compression});
		const file = fs.createWriteStream(path);
		const stream = cxz.pipe(file);

		let fulfilled = false;
		function fulfill(success, val){
			if (fulfilled)
				return;
			fulfilled = true;
			cxz.engine.close(); // https://github.com/robey/node-xz/issues/12
			cxz.destroy();
			file.destroy();
			stream.destroy();
			success ? resolve(val) : reject(val);
		}

		stream.on("finish", fulfill.bind(null, true));
		cxz.on("error", fulfill.bind(null, false));
		file.on("error", fulfill.bind(null, false));
		// write the data
		cxz.end(data);
	});
}

/** Read data as a string from an XZ compressed file
 * @param {string} path path to file
 * @returns {Promise<string>} resolves to data contained in file
 */
async function readFile(path){
	return new Promise((resolve, reject) => {
		const cxz = new Decompressor();
		const file = fs.createReadStream(path);
		const stream = file.pipe(cxz);

		let fulfilled = false;
		function fulfill(success, val){
			if (fulfilled)
				return;
			fulfilled = true;
			try{
				cxz.engine.close(); // https://github.com/robey/node-xz/issues/12
			} catch{};
			cxz.destroy();
			file.destroy();
			stream.destroy();
			success ? resolve(val) : reject(val);
		}

		let accum = [];
		stream.on("data", data => {
			accum.push(data);
		});
		stream.on("end", () => {
			fulfill(true, Buffer.concat(accum));
		});
		file.on("error", fulfill.bind(null, false));
		cxz.on("error", fulfill.bind(null, false));
	});
}

const jsonxz = {
	/** Write an XZ compressed JSON file
	 * @param {string} path path to file
	 * @param {any} data data to stringify and write
	 * @param {number} compression 1-9 compression level, 9 being the slowest and most compressed
	 * @returns {Promise<any>} resolves to JSON data
	 */
	async write(path, data, compression=6){
		return await writeFile(path, JSON.stringify(data, compression));
	},
	/** Read an XZ compressed JSON file
	 * @param {string} path path to file
	 * @returns {Promise<any>} resolves to JSON data
	 */
	async read(path){
		return JSON.parse(await readFile(path));
	},
	writeFile,
	readFile
};
export default jsonxz;