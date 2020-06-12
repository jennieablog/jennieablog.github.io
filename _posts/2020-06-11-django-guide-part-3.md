---
layout: post
title: Part 3️⃣ of how to django 💃
subtitle : Getting data from Django forms
tags: [django, tutorial]
image: https://images.pexels.com/photos/160107/pexels-photo-160107.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940
displayimage: false
final: true
author: Jennie Ablog
comments : True
---

<!-- INTRODUCTION -->

Absolutely stoked to see you here! This is **part three** of my [four-part guide]({{ site.baseurl }}/2020/06/01/django-beginners-guide.html) for building a simple blog app using the Django web framework.<br><br>

## Outline
***

1. [Create the Django form for the model.](#step1)
2. [Link the form to its corresponding views and templates.](#step2)
3. [Make the site navigation better.](#step3)
4. [Create the base template for all templates.](#step4)

<br>

### 1. Create the Django form for the model.<a name="step1"></a>
***

These are the final features for your site: creating and editing blog posts. For these to work, you will need to create forms. Note that you can do these things from scratch, but for this guide, we'll use the Django form. Let's go ahead and make that.

<br>

1. Django forms have their own file. Create a file named `[forms.py](http://forms.py)` inside the blog directory.
	```bash
	blog
	└── forms.py
	```

2. This form will be concerned with the `Post` model. Open the file and write the following code. 
	```python
	from django import forms
	from .models import Post

	class PostForm(forms.ModelForm):

		class Meta:
			# Tell Django which model is to be used to create the form
			model = Post
			# Enumerate the fields that should be present in the form.
			fields = ('title', 'text')
	```

<br><br>

### 2. Link the form to its corresponding views and templates.<a name="step2"></a>
***

Let's link the form to the last two views and templates, `post_new` and `post_edit`. Going back to our table from part two, both views handle two types of request: **GET** and **POST**. If the request is a **POST** request, then it contains the data submitted from the user. The `post_new` and `post_edit` views should get this data, create a new post through the Django form, and redirect it to the post page of the newly created or edited post. Otherwise, it should generate a new `PostForm` to be filled out and display the new post page.

<br>

1. Go ahead and redefine the `post_new` view first.
	```python
	def post_new(request):

		if request.method == "POST":
			# Get form data from request.
			form = PostForm(request.POST)
			# Check validity of form.
			if form.is_valid():
			post = form.save(commit=False) # This returns a Post model.
			post.author = request.user
			post.published_date = timezone.now()
			post.save()
			# Redirect to the newly created post's page using post_detail view..
			return redirect('post_detail', pk=post.pk)

		else:
			# Initialize form.
			form = PostForm()

		# Go to new post page with the empty form.
		context = { 'form' : form }
		return render(request, 'blog/post_new.html', context)
	```

2.  Now is the time to put something in the `post_new.html` template. Go ahead and do that.
{% raw %}
	```html
	<h2>New Post</h2>

	<form method="POST" class="post-form">
		{% csrf_token %}
		{{ form.as_p }}
		<button type="submit" class="save btn btn-default">Save</button>
	</form>
	```
{% endraw %}

3. Finally, redefine the `post_edit` view in the same way you did for `post_new`. Because you are to modify an existing post, add the `instance=post` argument when `PostForm()` is called.
	```python
	def post_edit(request, pk):

		# Check if there really is an object with the pk.
		post = get_object_or_404(Post, pk=pk)

		# When submitting edited Post:
		if request.method == "POST":
		
			# Add instance=post argument. 
			form = PostForm(request.POST, instance=post)

			if form.is_valid():
				post = form.save(commit=False)
				post.author = request.user
				post.published_date = timezone.now()
				post.save()
				# Go to edited post page.
				return redirect('post_detail', pk=post.pk)

		# When about to edit a Post:
		else:
			# Load form with current instance of post.
			form = PostForm(instance=post)
		
		# Render post_edit with the form containing current instance of the Post.
		return render(request, 'blog/post_edit.html', {'form': form})
	```

4. Put this in the `post_edit.html` template.
{% raw %}
	```html
	<h2>Editing Post</h2>

	<form method="POST" class="post-form">
		{% csrf_token %}
		{{ form.as_p }}
		<button type="submit" class="save btn btn-default">Save</button>
	</form>
	```
{% endraw %}

5. Okay let's do a quick check up. Visit the new post page and submit a new post through the URL `[localhost:4000/post/new/](http://localhost:4000/post/new/)`.
	> PICTURE

6. Try editing your very first Post through the URL `[localhost:4000/post/1/edit](http://localhost:4000/post/1/edit)`.
	> PICTURE

7. Go back to the index page and you will see the posts are updated. Now, you don't see any link from any view going to the new post page or the edit post page. Let's do that in the next steps.
	> PICTURE

<br><br>

### 3. Make the site navigation easier through Bootstrap.<a name="step3"></a>
***

It would be best to add a **link to the new post page** in the index page. A link would suffice but let's try and make it look prettier. Let's make use of Bootstrap and add a navigation bar with a button for creating a new post at the home page, as well as a footer at the bottom of the page.

<br>

1. Open the `post_list.html` template and add the following code just before the `<body>` tag.
	```html
	<head>

		<title>My Blog</title>

		<!-- Bootstrap -->
		<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
		<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">

	</head>
	```

2. To add a simple navbar, add the following code. Put the button linking to the new post page after the nav-header. Now, put the link within liquid tags with the format `url '<path_name>'`. Our path name in this case is `post_new`.
{% raw %}
	```html
	<nav class="navbar navbar-inverse navbar-fixed-top">
		<div class="container-fluid">
			<div class="navbar-header">
			<a class="navbar-brand" href="#">My Blog</a>
			</div>
			<!-- Add button here. -->	
			<a href="{% url 'post_new' %}">
				<button class="btn navbar-btn">New Post</button>
			</a>
		</div>
	</nav>
	```
{% endraw %}

3. Now let's add the footer just before the closing tag for body.
	```html
	<!-- Footer -->
	<footer class="page-footer font-small black">
		<!-- Copyright -->
		<div class="footer-copyright text-center py-3">© 2020 Copyright:
			<a href="https://jennieablog.github.io/"> jennieablog</a>
		</div>
		<!-- Copyright -->
	</footer>
	<!-- Footer -->
	```

4. Reload the page and you should see the changes.

<br><br>

### 4. Create the base template for all templates.<a name="step4"></a>
***

Notice that if you click new post, the nav bar and footer disappears. To sustain these elements, you could copy and paste their code in your other templates. However, there is a smarter and more sustainable way to do that: create a base template.

<br>

1. Under the templates folder, create a file called `base.html` and cut-and-paste in the code for the navigation bar and footer from `post_list.html`.  `base.html` should have this.
{% raw %}
    ```html
	<html>

		<head>
			
			<title>My Blog</title>
		
			<!-- Bootstrap -->
			<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
			<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">
		
		</head>

		<body>

			<!-- Nav Bar -->
			<nav class="navbar navbar-inverse navbar-fixed-top">
				<div class="container-fluid">
				    <div class="navbar-header">
						<a class="navbar-brand" href="#">My Blog</a>
					</div>
			
					<!-- Create new post button -->		
					<a href="{% url 'post_new' %}">
						<button class="btn navbar-btn">New Post</button>
					</a>
				</div>
    		</nav>
    		<!-- Nav Bar -->
    	
			<!-- Content -->
			<div class="content container">
				<div class="row">
					<div class="col-md-8">
						<!-- This is where django puts the content -->
						{% block content %}
						{% endblock %}
					</div>
				</div>
			</div>
			<!-- Content -->
    	
			<!-- Footer -->
			<footer class="page-footer font-small black">
				<!-- Copyright -->
				<div class="footer-copyright text-center py-3">© 2020 Copyright:
					<a href="https://jennieablog.github.io/"> jennieablog</a>
				</div>
				<!-- Copyright -->
			</footer>
			<!-- Footer -->

    	</body>

    </html>
    ```
{% endraw %}

2. How is this going to work? Go to the other templates and add the following lines of code.
{% raw %}
	```html
	<!-- First Line -->
	{% extends 'blog/base.html' %}

	{% block content %}
		<!-- PUT THE ORIGINAL CONTENT HERE -->
	{% endblock %}
	```
{% endraw %}

3. Click the New Post button or any post in the index page and you should  still see the nav bar and footer.
4. Finally let's add an edit button to the posts just beside the post title. Go ahead and edit `post_detail.html`.
{% raw %}
	```html
	{% extends 'blog/base.html' %}

	{% block content %}
		<div class="post">
			{% if post.published_date %}
			<div class="date">
			{{ post.published_date }}
			</div>
			{% endif %}
			<h2>
				{{ post.title }}
				<a class="btn btn-default" href="{% url 'post_edit' pk=post.pk %}"><span class="glyphicon glyphicon-pencil"></span></a>
			</h2>
			<p>{{ post.text|linebreaksbr }}</p>
		</div>
	{% endblock %}
	```
{% endraw %}

5. Test the edit feature by clicking the button, and that's it!
	> PICTURE

<br><br>

#### Great job! 🥳 
Hey, you're simply amazing for making it this far. By now you should be able to run a functional blog site. On the next and final part, you will finally see what you made live on the internet.
