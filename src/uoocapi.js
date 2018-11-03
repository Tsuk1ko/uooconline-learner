/*
 * @Author: Jindai Kirin 
 * @Date: 2018-11-02 16:51:03 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2018-11-03 11:01:17
 */

const Axios = require('axios');
const Qs = require('qs');

Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

const BASE_URL = 'http://www.uooconline.com/home/learn/';


class UoocAPI {
	constructor(cookie) {
		this.headers = {
			'Referer': BASE_URL + 'index',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
			'Cookie': cookie
		};
	}

	callAPI(path, params) {
		const url = BASE_URL + path;
		return Axios.get(url, {
			headers: this.headers,
			params
		}).then(res => res.data);
	}

	callAPI_POST(path, data) {
		const url = BASE_URL + path;
		return Axios.post(url, Qs.stringify(data), {
			headers: this.headers
		}).then(res => res.data);
	}

	getCatalogList(cid) {
		return this.callAPI('getCatalogList', {
			cid,
			hidemsg_: true,
			show: ''
		});
	}

	getUnitLearn(cid, chapter_id, section_id) {
		return this.callAPI('getUnitLearn', {
			cid,
			chapter_id,
			section_id,
			catalog_id: section_id,
			hidemsg_: true,
			show: ''
		});
	}

	markVideoLearn(cid, chapter_id, section_id, resource_id, video_length, video_pos) {
		return this.callAPI_POST('markVideoLearn', {
			cid,
			chapter_id,
			section_id,
			resource_id,
			source: 1,
			network: 1,
			subsection_id: 0,
			video_length,
			video_pos,
			hidemsg_: true
		});
	}
}


module.exports = UoocAPI;
