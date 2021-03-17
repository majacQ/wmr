import path from 'path';

/**
 * Normalize a file path across OSes.
 * @param {string} file
 * @returns {string}
 */
export const normalizePath = file => file.split(path.sep).join(path.posix.sep);
