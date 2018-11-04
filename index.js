//cookie
const cookie = ''

//课程ID
const cid = 0;

//播放倍速
const speed = 2;



/**
 * main
 */
const args = process.argv.splice(2);
const uooc = new(require('./src/uoocclient'))(cookie);
if (args[0] && args[0] == "subtitle") uooc.downloadSubtitles(cid);
else uooc.learn(cid, speed).catch(e => console.error(e));
