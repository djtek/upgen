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
	var path_parts = _path.split('/');
	var parts = [];
	
	path_parts.forEach(function (e, i) {
		if (e.length && !e.match(/^(:|\/)/)) {
			if (path_parts[i+1] && path_parts[i+1].match(/^:/)) {
				parts.push(pluralize.singular(e));
			} else {
				parts.push(e);
			}
		}
	});
	// path method name
	var method_path = parts.concat('path').join('_');
	// assign path getter
	this[method_path] = function () {
		var	args = Array.prototype.slice.call(arguments);
		var placeholders = [];
		var regex = /(?:\:\w+)/g;
		var match;
		var template_path = path.join(this.root, _path);

		while ((match = regex.exec(_path)) !== null) {
			placeholders.push(match[0]);
		}

		placeholders.forEach(function (placeholder, i) {
			if (args[i])
				template_path = template_path.replace(placeholder, args[i]);
		});

		return template_path;
	};
	// url method name
	var method_url = parts.concat('url').join('_');
	// assign url getter
	this[method_url] = function () {
		return url.format({
			protocol: this.protocol, 
			auth: this.auth, 
			hostname: this.hostname, 
			port: this.port,
			host: this.host,
			// arguments applied to this path getter
			pathname: this[method_path].apply(this, arguments),
			search: this.search, 
			query: this.query, 
			hash: this.hash
		});
	};
};

UpGen.prototype.add = function (obj) {
	for(var k in obj) {
		if (obj.hasOwnProperty(k)) {			
			var _path = path.join('/',k);
			// this.paths.push(_path)
			this.define(_path);
			if (typeof obj[k] === 'object') {
				var _obj = obj[k];
				var __obj = {};
				for(var _k in _obj) {
					__obj[path.join(_path, _k)] = _obj[_k];
				}
				this.add(__obj);
			} else if (typeof obj[k] === 'string') {
				// this.paths.push(path.join(_path, obj[k]))
				this.define(path.join(_path, obj[k]));
			}
		}
	}
};

module.exports = UpGen;
