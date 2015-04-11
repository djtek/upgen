exports.objMap = {
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
};
