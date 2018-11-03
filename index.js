//cookie
const cookie = ''

//课程ID
const cid = 0;

//播放倍速
const speed = 2;



/**
 * main
 */
new(require('./src/uoocclient'))().learn(cookie, cid, speed).catch(e => console.error(e));
