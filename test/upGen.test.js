var UpGen = require('..');

exports.upGen = {
	setUp: function (callback) {
		this.upGen = new UpGen();
		this.objMap = {
			// /users
			users: {
				// users/:uid
				':uid': {
					// /users/:uid/blogs
					blogs: {
						// /users/:id/blogs/:bid
						':bid': {
							// /users/:id/blogs/:bid/posts
							posts: {
								// /users/:id/blogs/:bid/posts/:pid
								':pid': {
									comments: ':cid',
									points: null
								}
							}
						}
					}
				}
			},
			blogs: ':bid'
		}
		callback();
	},
	testExistance: function (test) {
		test.ok(typeof UpGen === 'function');
		test.done();
	},
	testInstanceOf: function (test) {
		test.ok(this.upGen instanceof UpGen);
		test.done();
	},
	testDefaults: function (test) {
		test.equal(this.upGen.protocol, 'http');
		test.equal(this.upGen.hostname, 'localhost');
		test.equal(this.upGen.port, 3000);
		test.equal(this.upGen.root, '/');
		test.done();
	},
	testPaths: function (test) {
		this.upGen.add(this.objMap);
		test.equal(this.upGen.users_path(), '/users');
		test.equal(this.upGen.user_path(1), '/users/1');
		test.equal(this.upGen.user_blogs_path(1), '/users/1/blogs');
		test.equal(this.upGen.user_blog_path(1,2), '/users/1/blogs/2');
		test.equal(this.upGen.user_blog_posts_path(1,2), '/users/1/blogs/2/posts');
		test.equal(this.upGen.user_blog_post_path(1,2,3), '/users/1/blogs/2/posts/3');
		test.equal(this.upGen.user_blog_post_comments_path(1,2,3), '/users/1/blogs/2/posts/3/comments');
		test.equal(this.upGen.user_blog_post_comment_path(1,2,3,4), '/users/1/blogs/2/posts/3/comments/4');
		test.equal(this.upGen.user_blog_post_points_path(1,2,3), '/users/1/blogs/2/posts/3/points');
		
		test.equal(this.upGen.blogs_path(), '/blogs');
		test.equal(this.upGen.blog_path(1), '/blogs/1');
		
		test.done();
	}, 
	testUrls: function (test) {
		this.upGen.add(this.objMap);
		test.equal(this.upGen.users_url(), 'http://localhost:3000/users');
		test.equal(this.upGen.user_url(1), 'http://localhost:3000/users/1');
		test.equal(this.upGen.user_blogs_url(1), 'http://localhost:3000/users/1/blogs');
		test.equal(this.upGen.user_blog_url(1,2), 'http://localhost:3000/users/1/blogs/2');
		test.equal(this.upGen.user_blog_posts_url(1,2), 'http://localhost:3000/users/1/blogs/2/posts');
		test.equal(this.upGen.user_blog_post_url(1,2,3), 'http://localhost:3000/users/1/blogs/2/posts/3');
		test.equal(this.upGen.user_blog_post_comments_url(1,2,3), 'http://localhost:3000/users/1/blogs/2/posts/3/comments');
		test.equal(this.upGen.user_blog_post_comment_url(1,2,3,4), 'http://localhost:3000/users/1/blogs/2/posts/3/comments/4');
		test.equal(this.upGen.user_blog_post_points_url(1,2,3), 'http://localhost:3000/users/1/blogs/2/posts/3/points');
		test.done()
	},
	testUnderscoredKeys: function (test) {
		this.upGen.add({
			about_pages: ':ap_id',
			site_pages: ':sp_id'
		});
		test.equal(this.upGen.about_pages_path(), '/about_pages')
		test.equal(this.upGen.about_page_path(1), '/about_pages/1')

		test.equal(this.upGen.site_pages_path(), '/site_pages')
		test.equal(this.upGen.site_page_path(1), '/site_pages/1')

		test.done()
	},
	testSingularKeys: function (test) {
		this.upGen.add({
			page: ':pid',
			issue: ':iid'
		});
		test.ok(!this.upGen.pages_path)
		test.equal(this.upGen.page_path(1), '/page/1')
		test.ok(!this.upGen.issues_path)
		test.equal(this.upGen.issue_path(1), '/issue/1')

		test.done()
	}
}
exports.testWithCustomOptions = function (test) {
	var upGen = new UpGen({
		protocol: 'https', 
		hostname: "127.0.0.1", 
		port: 80, 
		root: "api"
	});
	upGen.add({
		guides: ':gid'
	});
	test.equal(upGen.guides_url(), 'https://127.0.0.1:80/api/guides');
	test.equal(upGen.guide_url(1), 'https://127.0.0.1:80/api/guides/1');
	
	test.done()
}
exports.testWithHostOption = function (test) {
	var upGen = new UpGen({
		protocol: 'https', 
		host: "127.0.0.1", 
		port: 80, 
		root: "api"
	});
	upGen.add({
		guides: ':gid'
	});
	test.equal(upGen.guides_url(), 'https://127.0.0.1/api/guides');
	test.equal(upGen.guide_url(1), 'https://127.0.0.1/api/guides/1');
	
	test.done()
}

exports.testWithAllUrlOptions = function (test) {
	var upGen = new UpGen({
		protocol: 'https', 
		auth: 'foo:bar', 
		hostname: 'local', 
		port: 80,
		host: 'local',
		search: 'foo=bar', 
		query: 'foo', 
		hash: 'bar',
		root: 'api'
	});
	upGen.add({
		guides: ':gid',
		issues: ':iid'
	});
	test.equal(upGen.guides_url(), 'https://foo:bar@local/api/guides?foo=bar#bar');
	test.equal(upGen.guide_url(1), 'https://foo:bar@local/api/guides/1?foo=bar#bar');
	test.equal(upGen.issues_url(), 'https://foo:bar@local/api/issues?foo=bar#bar');
	test.equal(upGen.issue_url(1), 'https://foo:bar@local/api/issues/1?foo=bar#bar');
	
	test.done()
}

exports.testUpGenAddThroughOptions = function (test) {
	var upGen = new UpGen({
		protocol: 'https', 
		auth: 'foo:bar', 
		hostname: 'local', 
		port: 80,
		host: 'local',
		search: 'foo=bar', 
		query: 'foo', 
		hash: 'bar',
		root: 'api',
		add: {
			guides: ':gid',
			issues: ':iid'
		}
	});
	test.equal(upGen.guides_url(), 'https://foo:bar@local/api/guides?foo=bar#bar');
	test.equal(upGen.guide_url(1), 'https://foo:bar@local/api/guides/1?foo=bar#bar');
	test.equal(upGen.issues_url(), 'https://foo:bar@local/api/issues?foo=bar#bar');
	test.equal(upGen.issue_url(1), 'https://foo:bar@local/api/issues/1?foo=bar#bar');
	
	test.done()
}