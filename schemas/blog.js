var mongoose = require('mongoose')
var markdown = require('markdown').markdown

var BlogSchema = new mongoose.Schema({
	title: String,
//	categories: String, //分类
//	tags: [],			//标签
	time: String,
	timecn: String,
	year: String,
	date: String,
	content: String,
	updatetime: String
})

BlogSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('time')
			.exec(cb)
	},
	findOne: function(title,cb) {
		this.find({"title": title},function(err,doc){
			if(err) return cb(err);
			if(doc) {
//				doc.content = markdown.toHTML(doc.content);
				cb(null, doc);
			}
		});


	}

}

module.exports = BlogSchema