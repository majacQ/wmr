import path from 'path';
import { promises as fs } from 'fs';

/**
 * Convert JSON imports to ESM. Uses a prefix `\0json:./foo.json`.
 * In dev mode, this creates URLs like `/@json/path/to/foo.json`.
 *
 * @example
 *   import foo from './foo.json';
 *   import foo from 'json:./foo.json';
 *
 * @param {object} options
 * @param {string} options.cwd
 * @returns {import('rollup').Plugin}
 */
export default function jsonPlugin({ cwd }) {
	const IMPORT_PREFIX = 'json:';

	return {
		name: 'json-plugin',
		async resolveId(id, importer) {
			if (!id.startsWith(IMPORT_PREFIX)) return;

			id = id.slice(IMPORT_PREFIX.length);
			const resolved = await this.resolve(id, importer, { skipSelf: true });
			return resolved && IMPORT_PREFIX + resolved.id;
		},
		transform(code, id) {
			if (!id.startsWith(IMPORT_PREFIX)) return;

			return {
				code: `export default ${code}`,
				map: null
			};
		}
	};
}
