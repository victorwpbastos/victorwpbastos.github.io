let fs = require('fs-extra');
let path = require('path');
let md = require('markdown-it')({ html: true });
let fm = require('front-matter');
let klaw = require('klaw-sync');

function getSlug(str = '') {
	return path
		.basename(str, '.md')
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/-/g, '')
		.replace(/\s+/g, '-');
}

module.exports = async raw_posts_dir => {
	try {
		let rawPosts = klaw(raw_posts_dir, { nodir: true }).map(rp => rp.path);
		let posts = [];

		for (const rp of rawPosts) {
			let fileContent = await fs.readFile(rp, 'utf8');
			let basename = path.basename(rp, '.md');
			let dirname = path
				.dirname(rp)
				.replace(raw_posts_dir, '')
				.replace(path.sep, '');

			let {
				attributes: { title, tags },
				body
			} = fm(fileContent);
			let [year, month, date] = dirname.split(path.sep);
			let datePost = Date.UTC(year, Number(month) - 1, date);

			tags = tags.split(',').map(t => t.trim());

			posts.push({
				content: md.render(body),
				title,
				date: datePost,
				tags: tags,
				path: path.join(dirname, basename),
				slug: getSlug(title)
			});
		}

		return posts;
	} catch (error) {
		console.log('getPostsObjectsError', error);
	}
};
