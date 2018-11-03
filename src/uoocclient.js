/*
 * @Author: Jindai Kirin 
 * @Date: 2018-11-02 20:55:42 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2018-11-03 15:51:41
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

function sleep(s) {
	return new Promise(resolve => setTimeout(resolve, s * 1000));
}

class UoocClient {
	async learn(cookie, cid, speed) {
		const API = new UoocAPI(cookie);

		let list;
		speed *= 0.97;

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
						video_url = encodeURI(resource.video_url[key].source);
						break;
					}
					await getDuration(video_url).then(duration => video_length = duration.toFixed(2));
					let video_pos = parseFloat(resource.video_pos); //video_pos is a "number"
					let vmax = parseFloat(video_length);

					//模拟学习进度
					let finished = false;
					while (true) {
						clogln('\t' + video_pos.toFixed(2) + '/' + video_length);

						await API.markVideoLearn(cid, chapter.id, section.id, resource.id, video_length, video_pos.toFixed(2)).then(ret => {
							if (ret.code != 1) throw new Error(ret.msg);
							finished = ret.data.finished;
						});

						if (finished) break;
						video_pos += 60 * speed + Math.random();

						let reduce = 0;
						if (video_pos > vmax) {
							reduce = (video_pos - vmax) / speed;
							video_pos = vmax;
						}

						await sleep(65 - reduce);
					}
				}
			}
		}
	}
}


module.exports = UoocClient;
