let fs = require('fs-extra');

let months = [
	'Janeiro',
	'Fevereiro',
	'Março',
	'Abril',
	'Maio',
	'Junho',
	'Julho',
	'Agosto',
	'Setembro',
	'Outubro',
	'Novembro',
	'Dezembro'
];

function formatTags(tags = []) {
	tags = tags
		.map(tag => `<a href="/tags/${tag}" class="post-tag">${tag}</a>`)
		.join('');

	return tags;
}

module.exports = async (postObjects, layout, posts_dir) => {
	try {
		for (const po of postObjects) {
			let d = new Date(po.date);

			let html = layout.replace('@@title', po.title).replace(
				'@@content',
				[
					`<div class="post-header">
							<h1 class="post-title">${po.title}</h1>
						</div>`,
					`<div class="post-content">
							${po.content}
						</div>`,
					`<div class="post-footer">
					<p class="post-date">Publicado em: <span>${d.getDate()} de ${
						months[d.getMonth()]
					} de ${d.getFullYear()}</span></p>
					<p class="post-tags">Tags: <span>${formatTags(po.tags)}</span></p>
						</div>`
				].join('\n')
			);

			await fs.outputFile(`${posts_dir}/${po.path}/index.html`, html);
		}
	} catch (error) {
		console.log('createPostFilesError', error);
	}
};
