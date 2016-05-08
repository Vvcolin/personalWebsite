var mongoose = require('mongoose')

var BlogSchema = new mongoose.Schema({
	title: String,
//	categories: String, //分类
//	tags: [],			//标签
	time: String,
	timecn: String,
	year: String,
	date: String,
	content: String
})

BlogSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('time')
			.exec(cb)
	}
}

module.exports = BlogSchema