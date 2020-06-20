---
layout: post
title: Part 3️⃣ of how to django 💃
subtitle : Getting data from Django forms
tags: [django, tutorial]
image: 
displayimage: false
show: False
author: Jennie Ablog
comments : True
---

<!-- INTRODUCTION -->

Absolutely stoked to see you here! This is **part three** of my [four-part guide]({{ site.baseurl }}/2020/06/01/django-beginners-guide.html) for building a simple blog app using the Django web framework.<br><br>

## Outline
***

[Part 1: Initializing your Django application]({{ site.baseurl }}/2020/06/09/django-guide-part-1.html)

[Part 2: Creating the Django application interface]({{ site.baseurl }}/2020/06/10/django-guide-part-2.html)

**[Part 3: Getting data from Django forms](#)** ⬅️ You are here!

1. [Create the Django form for the model.](#step1)
2. [Link the form to its corresponding views and templates.](#step2)
3. [Enable user authentication.](#step3)
4. [Make the site navigation better.](#step4)
5. [Create the base template for all templates.](#step5)

[Part 4: Deploying your Django app]({{ site.baseurl }}/2020/06/14/django-guide-part-4.html)

<br>

### 1. Create the Django form for the model.<a name="step1"></a>
***

These are the final features for your site: creating and editing blog posts. For these to work, you will need to create forms. Note that you can do these things from scratch, but for this guide, we'll use the Django form. Let's go ahead and make that.

<br>

1. Django forms have their own file. Create a file named `forms.py` inside `mysite/blog`.
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

Let's link the form to the last two views and templates, `post_new` and `post_edit`. Going back to our table from part two, both views handle two types of request: **GET** and **POST**. If the request is a **POST** request, then it contains the data submitted from the user. The `post_new` and `post_edit` views should get this data, create or edit post through the Django form, and redirect it to the post page of the newly created or edited post. Otherwise, it should generate a new `PostForm` and render the new post page that has the form.

<br>

1. Go ahead and include the `PostForm` you just created as well as the `redirect` shortcut in `views.py`. Then redefine the `post_new` view.
	```python
	# Import PostForm and redirect shortcut first

	import .forms import PostForm
	import django.shortcuts import redirect

	# ...

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

2.  Now is the time to put something in the `post_new.html` template. Go ahead and do that. In here we use the HTML form and add the {% raw %} `{% csrf_token %}` {% endraw %} tag for security.
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

3. Okay let's do a quick check up. Visit the new post page and submit a new post through the URL `localhost:4000/post/new/`.
	><strong>Rendering post_new template at</strong> `localhost:4000/post/new/`
	![post_new template 1]({{ site.baseurl }}/assets/img/django11.png)

4. Go back to the index page and you should see your new post. 
	><strong>New post in post_list template at</strong> `localhost:4000/`
	![post_list template]({{ site.baseurl }}/assets/img/django12.png)

5. Finally, redefine the `post_edit` view in the same way you did for `post_new`. Because you are to modify an existing post, add the `instance=post` argument when `PostForm()` is called.
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

5. Put this in the `post_edit.html` template.
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

6. Try editing your very first Post by appending a `/edit` to the post_page URL of any post.
	><strong>Rendering post_edit template at</strong> `localhost:4000/post/1/edit`
	![post_edit template 1]({{ site.baseurl }}/assets/img/django13.png)

7. Go back to the index page and you will see the posts are updated. Now, you don't see any link from any view going to the new post page or the edit post page. Let's do that in the next steps.

<br><br>

### 3. Enable user authentication.<a name="step3"></a>
***

You've now completed the blog's features. Now, think about restricting some of it. You couldn't let just anyone create new posts and edit previous posts on your site. You need to authenticate the user first. How do we restrict the use of these features?

<br>

1. You already created your first user using `createsuperuser` from part one. What you need to do now is to set up the login page. First, add Django site authentication urls in `mysite/urls.py`.
```python
path('accounts/', include('django.contrib.auth.urls')),
```

2. The good thing with including `django.contrib.auth.urls`. is that Django will set things up for you which include: login, logout, and password management. The next thing that you have to do is to create a template for the login page. Create a new folder under the `templates/` folder named `registration/` and create a new file called `login.html`. Put this in it to create a simple login page.
{% raw %}
	```html
	{% if form.errors %}
	<p>Your username and password didn't match. Please try again.</p>
	{% endif %}

	{% if next %}
		{% if user.is_authenticated %}
		<p>Your account doesn't have access to this page. To proceed,
		please login with an account that has access.</p>
		{% else %}
		<p>Please login to see this page.</p>
		{% endif %}
	{% endif %}

	<form method="post" action="{% url 'login' %}">
		{% csrf_token %}
		<table>
			<tr>
			<td>{{ form.username.label_tag }}</td>
			<td>{{ form.username }}</td>
			</tr>
			<tr>
			<td>{{ form.password.label_tag }}</td>
			<td>{{ form.password }}</td>
			</tr>
		</table>
		<input type="submit" value="login" />
		<input type="hidden" name="next" value="{{ next }}" />
	</form>
	```
{% endraw %}

3. Now you need update the `TEMPLATES` section in `mysite/settings.py` and put the template directory of your project to make all its templates visible to the template loader.
```python
TEMPLATES = [
{
	...
	'DIRS': [os.path.join(BASE_DIR, 'templates')],
	...
```

4. Next is to tell Django where to redirect after logging-in and out. Do that through adding this line in `settings.py`.
    ```python
	# Redirect to home URL after login/logout (Default redirects to /accounts/profile/)
	LOGIN_REDIRECT_URL = '/'
	LOGOUT_REDIRECT_URL = '/'
    ```

5. Finally restrict some of the site's features. Go to `views.py`. Import `login_required` from `django.contrib.auth.decorators` and add the following line before `post_edit` and `post_new`.
{% raw %}
	```python
	from django.contrib.auth.decorators import login_required
		...
	@login_required
	def post_edit(request, pk):
		...

	@login_required
	def post_new():
		...
	```
{% endraw %}

6. Okay, now try testing it through these URLs:
    - `localhost:8000/accounts/login/`
    - `localhost:8000/accounts/logout/`

<br><br>

### 4. Make the site navigation better.<a name="step4"></a>
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

2. To add a simple navbar, add the following code. Put the buttons linking to the new post page, login, and logout. If the user is logged in, provide buttons to create new post and to logout. Otherwise, provide a button for loggin in.
{% raw %}
	```html
	<!-- Nav Bar -->
	<nav class="navbar navbar-inverse navbar-fixed-top">
		<div class="container-fluid">
		<div class="navbar-header">
		<a class="navbar-brand" href="/">My Blog</a>
		</div>
		<!-- Add button here. -->
		{% if user.is_authenticated %}
			<a href="{% url 'logout' %}">
			<button class="btn navbar-btn btn-danger navbar-right">Log Out</button>
			</a>
			<a href="{% url 'post_new' %}">
			<button class="btn navbar-btn navbar-right">New Post</button>
			</a>
		{% else %}
			<a href="{% url 'login' %}">
			<button class="btn navbar-btn navbar-right">Log-in</button>
			</a>
		{% endif %}
		</div>
	</nav>
	<!-- Nav Bar -->
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

### 5. Create the base template for all templates.<a name="step5"></a>
***

Notice that it doesn't look good enough yet since the navbar is covering some elements. Also notice that if you click new post, the nav bar and footer disappears. To solve these issues, you will have to create a base template.

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
			<a class="navbar-brand" href="/">My Blog</a>
			</div>
			<!-- Add button here. -->
			{% if user.is_authenticated %}
				<a href="{% url 'logout' %}">
				<button class="btn navbar-btn btn-danger navbar-right">Log Out</button>
				</a>
				<a href="{% url 'post_new' %}">
				<button class="btn navbar-btn navbar-right">New Post</button>
				</a>
			{% else %}
				<a href="{% url 'login' %}">
				<button class="btn navbar-btn navbar-right">Log-in</button>
				</a>
			{% endif %}
			</div>
		</nav>
		<!-- Nav Bar -->

		<!-- Content -->
		<div class="content container" style="padding-top: 12rem">
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
	>><strong>Rendering new post_list with new base template</strong> `localhost:4000`
	![post_list template x]({{ site.baseurl }}/assets/img/django14.png)

4. Finally let's add an edit button to the posts just beside the post title. Again, this must only be available for logged-in users only. Go ahead and edit `post_detail.html`.
{% raw %}
	```html
	{% extends 'blog/base.html' %}

	{% block content %}
	<h2>
		{{ post.title }}
		{% if user.is_authenticated %}
			<a class="btn btn-default" href="{% url 'post_edit' pk=post.pk %}"><span class="glyphicon glyphicon-pencil"></span></a>
		{% endif %}
	</h2>
		<div class="date">
			{{ post.published_date }}
		</div>
		<p>{{ post.text|linebreaksbr }}</p>
	</div>
	{% endblock%}

	```
{% endraw %}

5. Test the edit feature by clicking the button, and that's it!
	><strong>Rendering post_detail with base template at</strong> `localhost:4000/post/1/`
	![post_detail template x]({{ site.baseurl }}/assets/img/django15.png)

<br><br>

## Great job! 🥳 
Hey, you're simply amazing for making it this far. By now you should be able to run a functional blog site. On the next and final part, you will finally see what you made live on the internet. Click [here]({{ site.baseurl }}/2020/06/14/django-guide-part-4.html) to proceed!
