//config.js

var env = process.env.NODE_ENV || 'development';

var config = {
	port: 3000,
	db: 'mongodb://localhost:27017/mathquiz',
	host: 'localhost',
	root: '../public',
	secret: 'fNLNUZ1YxXU1v1Cdb0sAAjGr3yS9uNOKDkQgMxoOsGDjcNES6wLlAQ6aSJE05kT'
};

if (env === 'production') {
	config.db = 'mongodb://dkolarev:dkolarev2016@ds013024.mlab.com:13024/projects';
	config.port = process.env.PORT;
}

module.exports = config;