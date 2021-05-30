module.exports = {
	mode: "production",
    entry: './assets/js/index.js',
    output: {
        path: __dirname + '/assets/js',
        filename: 'dist.js'
    }
};