var util = require('util');
var url = require('url');
var path = require('path');
var pluralize = require('pluralize');

function capStr(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function UpGen(options) {
	options = options||{};
	
	this.protocol = options.protocol||'http';
	this.auth = options.auth;
	this.hostname = options.hostname||'localhost';
	this.port = options.port||3000;
	this.host = options.host;
	// this.pathname = options.pathname;
	this.search = options.search;
	this.query = options.query;
	this.hash = options.hash;
	this.root = options.root||'/';
	// this.paths = [];
	if (options.add && typeof options.add === 'object') {
		this.add(options.add);
	}
}

UpGen.prototype.define = function (_path) {
	var parts = [];
	var path_parts = _path.split('/');
	var method_path;
	_path = path.join(this.root, _path);
	
	path_parts.forEach(function (e, i) {
		if (e.length && !e.match(/^(:|\/)/)) {
			if (path_parts[i+1] && path_parts[i+1].match(/^:/)) {
				parts.push(pluralize.singular(e));
			} else {
				parts.push(e);
			};
		};
	});
	// path method name
	method_path = parts.concat('path').join('_');
	// assign path getter
	this[method_path] = function () {
		var	args = Array.prototype.slice.call(arguments),
		match,
		placeholders = [],
		re = /(?:\:\w+)/g;

		while (match = re.exec(_path)) {
			placeholders.push(match[0]);
		};

		placeholders.forEach(function (placeholder, i) {
			if (args[i])
				_path = _path.replace(placeholder, args[i]);
		});

		return _path;
	};
	// assign url getter
	this[parts.concat('url').join('_')] = function () {
		return url.format({
			protocol: this.protocol, 
			auth: this.auth, 
			hostname: this.hostname, 
			port: this.port,
			host: this.host,
			// arguments applied to this path getter
			pathname: path.join(this[method_path].apply(null, arguments)),
			search: this.search, 
			query: this.query, 
			hash: this.hash
		});
	}
}

UpGen.prototype.add = function (obj) {
	for(var k in obj) {
		if (obj.hasOwnProperty(k)) {			
			var _path = path.join('/',k);
			// this.paths.push(_path)
			this.define(_path);
			if (typeof obj[k] === 'object') {
				var _obj = obj[k];
				var __obj = {};
				for(var k in _obj) {
					__obj[path.join(_path, k)] = _obj[k];
				};
				this.add(__obj);
			} else if (typeof obj[k] === 'string') {
				// this.paths.push(path.join(_path, obj[k]))
				this.define(path.join(_path, obj[k]));
			};
		};
	};
}

module.exports = UpGen;
