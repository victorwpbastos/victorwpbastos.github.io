module.exports = (postObjects, posts_href, predicate = po => po) => {
	try {
		return postObjects.filter(predicate).map(po => {
			return {
				...po,
				item: `<li><a href="${posts_href}/${po.path}">${
					po.title
				}</a></li>`
			};
		});
	} catch (error) {
		console.log('getPostListError', error);
	}
};
