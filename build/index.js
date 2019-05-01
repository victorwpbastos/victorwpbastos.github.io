let path = require('path');
let fs = require('fs-extra');

let getPostObjects = require('./getPostObjects');
let getPostList = require('./getPostList');
let createPostFiles = require('./createPostFiles');
let createTagFiles = require('./createTagFiles');
let createIndexPage = require('./createIndexPage');

let paths = {
	LAYOUT: path.resolve(__dirname, './layout.html'),
	INDEX: path.resolve(__dirname, '../index.html'),
	RAW_POSTS_DIR: path.resolve(__dirname, '../raw_posts'),
	POSTS_DIR: path.resolve(__dirname, '../posts'),
	POSTS_HREF: '/posts',
	TAGS_DIR: path.resolve(__dirname, '../tags')
};

(async () => {
	try {
		// clean posts dir
		await fs.remove(paths.POSTS_DIR);

		// get layout content
		let layout = await fs.readFile(paths.LAYOUT, 'utf8');

		// get rawPosts as post objects
		let postObjects = await getPostObjects(paths.RAW_POSTS_DIR);

		// sort post objects asc
		postObjects.reverse();

		// generate post files
		await createPostFiles(postObjects, layout, paths.POSTS_DIR);

		// get post list to populate index page
		let postList = getPostList(postObjects, paths.POSTS_HREF);

		// generate tag files
		await createTagFiles(postList, layout, paths.TAGS_DIR);

		// generate index file
		await createIndexPage(postList, layout, paths.INDEX);

		console.log('blog generated!');
	} catch (error) {
		console.log('Error', error);
	}
})();
