var mongoose = require('mongoose')
var db = mongoose.createConnection('localhost','blog');
db.on('error',function(err) {
	console.error(err);
});
var BlogSchema = require('../schemas/blog')
var Blog = db.model('Blog',BlogSchema)
Blog.remove({},function(err,data) {
	console.log('Delect All');
	console.log('data');
})
module.exports = Blog