/**
 * @type {typeof import("wmr").defineConfig}
 */
export function defineConfig(config) {
	return async options => (typeof config === 'function' ? config(options) : config);
}
