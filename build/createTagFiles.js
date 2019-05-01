let fs = require('fs-extra');

function extractTags(postList) {
	let tags = [];

	postList.forEach(p => {
		p.tags.forEach(t => {
			if (!tags.includes(t)) {
				tags.push(t);
			}
		});
	});

	return tags;
}

module.exports = async (postList, layout, tags_dir) => {
	try {
		let tags = extractTags(postList);

		for (const tag of tags) {
			let items = postList
				.filter(p => p.tags.includes(tag))
				.map(p => p.item)
				.join('');

			let html = layout
				.replace('@@title', tag)
				.replace(
					'@@content',
					[
						`<p>Posts marcados com a tag <span class="post-tag">${tag}</span></p>`,
						`<ul class="post-list">${items}</ul>`
					].join('\n')
				);

			await fs.outputFile(`${tags_dir}/${tag}/index.html`, html);
		}
	} catch (error) {
		console.log('createTagFilesError', error);
	}
};
