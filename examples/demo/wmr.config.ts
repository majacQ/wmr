import fs from 'fs';

const IMPORT_PREFIX = 'my-json:';
const INTERNAL_PREFIX = '\0my-json:';

const removeNamespaces = (s: string) => {
	let reg = /:\/?[\w]+/g;
	let item: RegExpExecArray;
	while ((item = reg.exec(s))) {}

	if (item) return s.slice(item.index);
	return s;
};

export default function (config) {
	return {
		plugins: [
			{
				name: 'myjson',
				async resolveId(id, importer) {
					console.log('MY JSON', JSON.stringify(id));
					if (id[0] === '\0' || !id.endsWith('.json')) return;

					// always process prefixed imports
					if (id.startsWith(IMPORT_PREFIX)) {
						id = id.slice(IMPORT_PREFIX.length);
						const resolved = await this.resolve(id, importer, { skipSelf: true });
						console.log('RESOLVED', resolved);
						return resolved && INTERNAL_PREFIX + resolved.id;
					}
				},
				async load(id, foo) {
					console.log('MY LOAD?', JSON.stringify(id));
					if (!id.startsWith(INTERNAL_PREFIX)) return null;
					console.log('MY LOAD', JSON.stringify(id));
					console.log(this.cwd, foo);
					const content = fs.readFileSync(id.slice(INTERNAL_PREFIX.length), 'utf-8');
					return {
						code: `export default ${content}`,
						map: null
					};
				}
			}
		]
	};
}
