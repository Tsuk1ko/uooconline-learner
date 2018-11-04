/*
 * @Author: Jindai Kirin 
 * @Date: 2018-11-04 15:41:02 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2018-11-04 15:55:22
 */

const Axios = require('axios');
const parseSRT = require('parse-srt')


function srt2txt(url) {
	return Axios.get(encodeURI(url)).then(res => {
		let srt = parseSRT(res.data);
		let txt = '';
		for (let a of srt) {
			txt += a.text + '\n';
		}
		return txt;
	});
}


module.exports = srt2txt;
