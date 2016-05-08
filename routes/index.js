var express = require('express');
var router = express.Router();
var marked = require('marked');
var Blog = require('../models/blog')
var moment = require('../public/js/moment')

var blog1 = new Blog;
blog1.title = '23333';
// blog1.categories = '23333';
// blog1.tags = ['2333','34444'];
blog1.time = moment().format('L'); //01/01/2016
blog1.timecn = moment().format('LL');//May 8,2016
blog1.date = blog1.time.slice(0,5);
blog1.year = blog1.time.slice(6);
blog1.content = '这是内容';
blog1.save(function(err) {
	if (err) throw err;
})


/* GET home page. */
router.get('/', function(req, res, next) {
	Blog.fetch(function(err,blogs){
		if (err) {
			console.log(err)
		}
		console.log(blogs)
		res.render('index',{blogs: blogs})
	})
  	
});


router.get('/login', function(req, res, next) {
	res.render('login',{
  	success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.get('/admin', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
	var _pwd = req.body.password;
	if(_pwd === 'xiao555') {
		console.log('欢迎主人！');
		req.flash('success','登陆成功');
		req.session.user = '主人';
		return res.redirect('/admin');
	}else {
		console.log('何方妖孽!');
		req.flash('error','你走开，我不认识你！');
		return  res.redirect('/login');
	} 
	
});
module.exports = router;
