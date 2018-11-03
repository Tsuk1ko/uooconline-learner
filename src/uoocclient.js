/*
 * @Author: Jindai Kirin 
 * @Date: 2018-11-02 20:55:42 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2018-11-03 11:02:12
 */

const getDuration = require('get-video-duration');
const UoocAPI = require('./uoocapi');

const VIDEO_MODE = 10;

function clog(str) {
	process.stdout.write(str);
}

function clogln(str = '') {
	console.log(str);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

class UoocClient {
	async learn(cookie, cid, speed) {
		const API = new UoocAPI(cookie);

		let list;

		clog("获取课程视频列表");
		await API.getCatalogList(cid).then(ret => {
			if (ret.code != 1) throw new Error(ret.msg);
			list = ret.data;
		});
		clogln(" √");

		//章节
		for (let chapter of list) {
			clog('\n' + chapter.name.replace(/^ +/, ''));
			if (chapter.finished || chapter.learn_mode != VIDEO_MODE) {
				clogln(" √");
				continue;
			}
			clogln();

			//小节
			for (let section of chapter.children) {
				clog(section.number + ' ' + section.name.replace(/^ +/, ''));
				if (section.finished || section.learn_mode != VIDEO_MODE) {
					clogln(" √");
					continue;
				}
				clogln();

				//资源点
				let resources;
				await API.getUnitLearn(cid, chapter.id, section.id).then(ret => {
					if (ret.code != 1) throw new Error(ret.msg);
					resources = ret.data;
				});

				for (let resource of resources) {
					clog('\t' + resource.title.replace(/^ +/, ''));
					if (resource.finished || !resource.is_task || resource.type != VIDEO_MODE) {
						clogln(" √");
						continue;
					}
					clogln();

					//资源信息
					let video_url, video_length;
					for (let key in resource.video_url) {
						video_url = resource.video_url[key].source;
						break;
					}
					await getDuration(video_url).then(duration => video_length = duration.toFixed(2));
					let video_pos = parseFloat(resource.video_pos);

					//模拟学习进度
					let finished = false;
					while (true) {
						await API.markVideoLearn(cid, chapter.id, section.id, resource.id, video_length, video_pos).then(ret => {
							if (ret.code != 1) throw new Error(ret.msg);
							finished = ret.data.finished;
						});
						clogln('\t' + video_pos + '/' + video_length);
						if (finished) break;
						video_pos += 60 * speed - Math.random();
						video_pos = Number(video_pos).toFixed(2);

						let reduce = 0;
						if (video_pos > video_length) {
							reduce = Number((video_pos - video_length) / speed - 3).toFixed(2);
							video_pos = video_length;
						}
						await sleep(60 * 1000 - reduce);
					}
				}
			}
		}
	}
}


module.exports = UoocClient;
