const path = require('path');
const fs = require('fs');

function requiredEnv(name) {
    const value = process.env[name];

    if (!value || !value.trim()) {
        throw new Error(
            `Missing required environment variable: ${name}`
        );
    }

    return value.trim();
}

function optionalFile(name) {
    const value = process.env[name];

    if (!value || !value.trim()) {
        console.log(
            `Optional file not configured: ${name}`
        );

        return null;
    }

    const resolvedPath = path.isAbsolute(value)
        ? value
        : path.resolve(process.cwd(), value);

    if (!fs.existsSync(resolvedPath)) {
        console.log(
            `Optional file does not exist and will be skipped: ` +
            `${name} -> ${resolvedPath}`
        );

        return null;
    }

    const fileStatus = fs.statSync(resolvedPath);

    if (!fileStatus.isFile()) {
        console.log(
            `Optional path is not a file and will be skipped: ` +
            `${name} -> ${resolvedPath}`
        );

        return null;
    }

    console.log(
        `Test file found: ${name} -> ${resolvedPath}`
    );

    return resolvedPath;
}

module.exports = {
    requiredEnv,
    optionalFile
};