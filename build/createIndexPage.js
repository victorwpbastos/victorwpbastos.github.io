let fs = require('fs-extra');

module.exports = async (postList, layout, index_path) => {
	try {
		let items = postList.map(p => p.item).join('');

		let html = layout
			.replace('@@title', 'Home')
			.replace('@@content', `<ul class="post-list">${items}</ul>`);

		await fs.writeFile(index_path, html);
	} catch (error) {
		console.log('createIndexPageError', error);
	}
};
