/** @param {import('rollup').RollupOutput} bundle */
export function bundleStats(bundle) {
	let total = 0;
	const assets = bundle.output
		.filter(asset => !/\.map$/.test(asset.fileName))
		.sort((a, b) => scoreAsset(b) - scoreAsset(a));

	const assetsText = assets.reduce((str, output) => {
		const content = output.type === 'asset' ? output.source : output.code;
		const size = content.length;
		total += content.length;
		return `${str}\n  ${output.fileName} ${prettyBytes(size)}`;
	}, '');

	const totalText = prettyBytes(total);

	return { assets, total, totalText, assetsText };
}

/** @param {import('rollup').OutputChunk | import('rollup').OutputAsset} asset */
function scoreAsset(asset) {
	if (asset.type === 'chunk') {
		return asset.isEntry ? 10 : asset.isDynamicEntry ? 8 : 6;
	}
	// List HTML files first, sorted by path depth
	if (/\.html$/.test(asset.fileName)) {
		return 30 - asset.fileName.split('/').length;
	}
	return 1;
}

/** @param {number} size */
export function prettyBytes(size) {
	let unit = 'b';
	if (size > 1500) {
		size /= 1000;
		unit = 'Kb';
	}
	if (size > 1500) {
		size /= 1000;
		unit = 'Mb';
	}
	return `${size < 1 ? size.toFixed(2) : size < 10 ? size.toFixed(1) : size}${unit}`;
}