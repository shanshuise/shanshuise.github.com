$(function(){
	var blog = {};
	blog.builder = {};
	blog.views = {};
	//页面生成器
	blog.builder.MainModel = function(data) {
		var model = {};
		var monthsName = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','DES','OCT','NOV','DEC'];
		model.site_name = data.site_name;
		model.copyright = data.copyright;
		model.pages = data.pages;
		//按照yyyy-mm对文章进行按时分类 eg: {'2012-04':[{},{}], '2012-05':[{},{}]}
		model.months = _.groupBy(data.articles, function(article) {
			return article.file.substring(0, 7);
		});
		//更新months的内容为{month:**,articles:{{link:***, title:***},{link:***, title:***}}}
		model.months = _.map(model.months, function(value, key){
			return {
				month: monthsName[key.substring(6, 7) - 1] + ' ' + key.substring(0, 4),
				articles: _.map(value, function(article){
					return {link: article.file, title: article.file.substring(8, 10) + ' &raquo; ' + article.title}
				})
			}
		});
		return model;
	};
	//文章HTM生成器
	blog.builder.Mustache = new Showdown.converter();
	
	//生成文章
	blog.views.Article = Backbone.View.extend({
		initialize: function(option) {
			var that = this;
			this.article = option.article;
			_.bindAll(this, 'render');
			$.get('post/' + that.article + '.txt', function(data) {
				that.model = data;
				that.render();
			})
		},
		render: function() {
			if (!this.model) return this;
			var ariticleHtml = blog.builder.Mustache.makeHtml(this.model);
			$(this.el).html(ariticleHtml);//显示文章

			$('#disqus_thread').empty();
			if (this.article != 'index') {
                new BlogFun.Comment();
            }
		}
	});

	//第三方评论系统disqus
	var BlogFun = {
		Comment: function() {
			var disqus_shortname = 'yanqw'; // required: replace example with your forum shortname
		    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
		    dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
		    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
		}
	}

	//初始运行函数，渲染页面数据
	blog.views.Main = Backbone.View.extend({
		el: $('#main_body'),
		template: $('#tpl_main').html(),
		initialize: function() {
			_.bindAll(this, 'sync');
			_.bindAll(this, 'render');
		},
		sync: function() {
			var that = this;
			$.getJSON('meta.js', function(data){
				that.data = data;
				that.render();
			})
		},
		render: function() {
			if (!this.data) {
				this.sync();
				return this;
			}

			var mainModel = blog.builder.MainModel(this.data);
			var mainHtml = Mustache.to_html(this.template, mainModel);
			$(this.el).empty().append(mainHtml);

			if (this.article) {
				var article_view = new blog.views.Article({article:this.article});
				$('#article').empty().append(article_view.render().el);
			}
		}
	});
	//主APP，URL驱动
	blog.App = Backbone.Router.extend({
		routes: {
			'' 					: 'index',
			'!post/:article'	: 'post'
		},
		//首页
		index: function() {
			this.makeContent('index');
		},
		//显示文章
		post: function(article) {
			this.makeContent(article);
		},
		//生成内容
		makeContent: function(article) {
			if (!this.main) {
				this.main = new blog.views.Main();
			}
			this.main.article = article;
			this.main.render();
		}
	});
	var app = new blog.App();
	Backbone.history.start();
});