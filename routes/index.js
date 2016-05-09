var express = require('express');
var router = express.Router();
var marked = require('marked');
var Blog = require('../models/blog')
var moment = require('../public/js/moment')
var markdown = require('markdown').markdown;

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

router.get('/blog',function(req,res, next) {
	Blog.fetch(function(err,blogs){
		if (err) {
			console.log(err)
		}
		console.log(blogs)
		res.render('blog',{blogs: blogs})
	})
});

router.get('/login',checkNotLogin);
router.get('/login', function(req, res, next) {
	res.render('login',{
  	success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
router.get('/admin',checkLogin);
router.get('/admin', function(req, res, next) {
  res.render('admin',{
  	success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
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

router.post('/admin',function(req,res, next) {
	var blog = new Blog;
		blog.title = req.body.title,
		blog.content = markdown.toHTML(req.body.content); 
		blog.time = moment().format('L'), //01/01/2016
		blog.timecn = moment().format('LL'),//May 8,2016
		blog.date = blog.time.slice(0,5),
		blog.year = blog.time.slice(6);
	blog.save(function(err) {
	if (err) throw err;
	else {
		router.get('/blog/:title',function(req,res,next) {
			Blog.findOne(req.params.title,function(err,doc){
			if (err) {
				console.log(err)
			}
			console.log('doc :');
			console.log(doc);
			res.render('blogpage',{blog: doc});
		})
		})		
		req.flash('success','上传成功！');
		return res.redirect('/');
	}
	});	
})

function checkLogin(req, res, next) {
    if (!req.session.user) {
      	req.flash('error', '未登录!'); 
      	return res.redirect('/login');
    }
    next();
}

function checkNotLogin(req, res, next) {
    if (req.session.user) {
      	req.flash('error', '已登录!'); 
      	return res.redirect('/admin');//返回之前的页面
    }
    next();
}
module.exports = router;
