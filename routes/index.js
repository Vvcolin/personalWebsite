var express = require('express');
var router = express.Router();
var marked = require('marked');
var Blog = require('../models/blog')
var moment = require('../public/js/moment')
var markdown = require('markdown').markdown;

/* GET home page. */
router.get('/', function(req, res, next) {
	Blog.fetch(function(err,blogs){
		if (blogs ==0) {
			console.log(err)
		}
		//console.log(blogs)
		res.render('index',{blogs: blogs})
	})
  	
});

/* GET blog page. */
router.get('/blog',function(req,res, next) {
	Blog.fetch(function(err,blogs){
		if (blogs ==0) {
			console.log(err)
		}
		//console.log(blogs)
		res.render('blog',{blogs: blogs})
	})
});

/* GET single blog page. */
router.get('/blog/:title',function(req,res,next) {
		Blog.findOne(req.params.title,function(err,doc){
			if (doc == 0) {
				console.log('NO article');
				console.log(err);
			}
			//console.log('doc :');
			//console.log(doc);
			res.render('blogpage',{blog: doc});
		})
})

/* GET login page. */
router.get('/login',checkNotLogin);
router.get('/login', function(req, res, next) {
	res.render('login',{
  	success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

/* GET admin page. */
router.get('/admin',checkLogin);
router.get('/admin', function(req, res, next) {
  	Blog.fetch(function(err,blogs){
		if (blogs ==0) {
			console.log(err)
		}
		//console.log(blogs)
		res.render('admin',{
		  	blogs: blogs,
		  	success: req.flash('success').toString(),
		    error: req.flash('error').toString()
		  });
	});
});
/* GET upload page. */
router.get('/admin/upload',checkLogin);
router.get('/admin/upload', function(req, res, next) {

  res.render('upload',{
  	success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

/* GET 更新 page. */
router.get('/admin/update/:title',checkLogin);
router.get('/admin/update/:title', function(req, res, next) {
	console.log(req.params.title);
	console.log(req.params.title.toString());
	Blog.findOne(req.params.title.toString(),function(err,doc){
		if(doc == 0){
			console.log(err);
		} else {
			//console.log(doc);
			res.render('update',{
				blog: doc[0],
			  	success: req.flash('success').toString(),
			    error: req.flash('error').toString()
			  });
		}
	})
});

router.post('/admin/update/:title',checkLogin);
router.post('/admin/update/:title',function(req,res,next){
	console.log("更新");
	var _content = markdown.toHTML(req.body.content);
	console.log(req.body.content);
	var _updatetime = moment().format('L');
	Blog.update({title: req.params.title},{
		content: _content,
		updatetime: _updatetime
		},function(err){
		if(err) {
			console.log(err);
		} else {
			req.flash('success','更新成功！');
			return res.redirect('/');
		}
	})
})
/*删除 */
router.delete('/admin/blog',checkLogin);
router.delete('/admin/blog',function(req,res, next){
	var _title = req.query.title;
	if(_title){
		Blog.remove({title: _title},function(err, doc){
			if(err) {
				console.log(err);
				res.json({success: 0});
			} else {
				res.redirect('/admin');
			}
		})
	}
})

/* POST login page. */
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
router.get('/upload',checkLogin);
router.get('/upload',function(req,res,next) {
	res.render('upload',{
			  	success: req.flash('success').toString(),
			    error: req.flash('error').toString()
			  });
})

/* POST upload page. */
router.post('/upload',function(req,res, next) {
	console.log(req.body.title);
	Blog.findOne(req.body.title,function(err,doc){
			if (doc ==0) {//如果没找到，添加
				console.log(err);
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
					req.flash('success','上传成功！');
					return res.redirect('/');
				}
				});
			} else {//如果之前有了，更新
				console.log("更新");
				var _content = markdown.toHTML(req.body.content);
				console.log(req.body.content);
				var _updatetime = moment().format('L');
				Blog.update({title: req.body.title},{
					content: _content,
					updatetime: _updatetime
					},function(err){
					if(err) {
						console.log(err);
					} else {
						req.flash('success','更新成功！');
						return res.redirect('/');
					}
				})
			}
			
	});
});	


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
