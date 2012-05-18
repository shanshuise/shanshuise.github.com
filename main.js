$(function(){
	var blog = {};
	blog.builder = {};
	blog.views = {};
	//ҳ��������
	blog.builder.MainModel = function(data) {
		var model = {};
		var monthsName = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','DES','OCT','NOV','DEC'];
		model.site_name = data.site_name;
		model.copyright = data.copyright;
		model.pages = data.pages;
		//����yyyy-mm�����½��а�ʱ���� eg: {'2012-04':[{},{}], '2012-05':[{},{}]}
		model.months = _.groupBy(data.articles, function(article) {
			return article.file.substring(0, 7);
		});
		//����months������Ϊ{month:**,articles:{{link:***, title:***},{link:***, title:***}}}
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
	//����HTM������
	blog.builder.Mustache = new Showdown.converter();
	
	//��������
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
			$(this.el).html(ariticleHtml);//��ʾ����

			$('#disqus_thread').empty();
			if (this.article != 'index') {
                new BlogFun.Comment();
            }
		}
	});

	//����������ϵͳdisqus
	var BlogFun = {
		Comment: function() {
			var disqus_shortname = 'yanqw'; // required: replace example with your forum shortname
		    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
		    dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
		    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
		}
	}

	//��ʼ���к�������Ⱦҳ������
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
	//��APP��URL����
	blog.App = Backbone.Router.extend({
		routes: {
			'' 					: 'index',
			'!post/:article'	: 'post'
		},
		//��ҳ
		index: function() {
			this.makeContent('index');
		},
		//��ʾ����
		post: function(article) {
			this.makeContent(article);
		},
		//��������
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