/*
 * @Author: Jindai Kirin 
 * @Date: 2018-11-04 15:41:02 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2018-11-11 17:49:22
 */

const Axios = require('axios');
const parseSRT = require('parse-srt')
const Iconv = require('iconv-lite');
const abtb = require('arraybuffer-to-buffer');

function srt2txt(url) {
	return Axios.get(encodeURI(url), {
		responseType: 'arraybuffer'
	}).then(res => {
		let buffer = abtb(res.data);
		let srt, success = true;

		//解决编码问题
		try {
			srt = parseSRT(buffer.toString());
		} catch (e) {
			success = false;
		}
		if (!success) {
			try {
				srt = parseSRT(Iconv.decode(buffer, 'utf16'));
			} catch (e) {
				throw new Error('字幕编码非 UTF-8 / UTF-16，如有能力可自行获取正确编码并修改程序 or 提交issue');
			}
		}

		let txt = '';
		for (let a of srt) {
			txt += a.text + '\n';
		}
		return txt;
	});
}


module.exports = srt2txt;
