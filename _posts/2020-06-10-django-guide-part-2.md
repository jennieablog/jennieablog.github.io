---
layout: post
title: Part 2️⃣ of how to django 💃
subtitle : Creating the Django application interface
tags: [django, tutorial]
image: https://i.imgur.com/o5RBSDm.png
displayimage: True
show: False
author: Jennie Ron Ablog
comments : True
---

<!-- INTRODUCTION -->

Hi, it's good to see you again! This is **part two** of my [four-part guide]({{ site.baseurl }}/2020/06/01/django-beginners-guide.html) for building a simple blog app using the Django web framework. Click [here]({{ site.baseurl }}/2020/06/09/django-guide-part-1.html) to go back to part one in case you missed something.<br><br>

### Outline
***

[Part 1: Initializing your Django application]({{ site.baseurl }}/2020/06/09/django-guide-part-1.html)

**[Part 2: Creating the Django application interface](#)** ⬅️ You are here!

1. [List the app's features.](#step1)
2. [Set-up the URLs and initialize the views.](#step2)
3. [Set-up the templates folder.](#step3)
4. [Create the index page.](#step4)
5. [Create the post page.](#step5)

[Part 3: Getting data from Django forms]({{ site.baseurl }}/2020/06/11/django-guide-part-3.html)

[Part 4: Deploying your Django app]({{ site.baseurl }}/2020/06/14/django-guide-part-4.html)

<br>

### 1. List the app's features.<a name="step1"></a>
***
One thing that I find to be very helpful before getting my hands dirty with code is to tabulate all the information that will be relevant in creating the application interface. In this step, I'm going to show you how I do that.<br><br>

| App Features  | Feature Name | Path | Request Type |
| :-------: | :-------: | :-------: | :-------: |
| List all posts. | `post_list` | / | GET |
| Display a post. | `post_detail` | /post/`<post_id>` | GET |
| Edit a previous post. | `post_edit` | /post/`<post_id>`/edit | GET, POST |
| Create a new post. | `post_new` | /post/new | GET, POST |

<br>

1. On the first column, list all the **features** you would want your application to have. A simple blog site has to have at least four which are:
    - To list all posts on one page.
    - To display a certain post.
    - To edit a previous post.
    - To create a new post.

2. Now, think of a **unique name** to identify each feature. Write those names on the second column. It shouldn't contain any spaces and must be entirely in lowercase because we'll use this in our code.

3. For each feature, you have to think of a **unique path**, the one you think is most fit to be appended to the base URL of your site if you want to make use of this feature.
    - We put `/` for `post_list` since we want our home page to be the index page listing all our blog posts.
    - We put `/post/<post_id>` for `post_detail` because in order to access a particular post we need to know its unique `post_id`.
    - We put `post/<post_id>/edit` for `post_edit` because we need to first retrieve the `Post` through its `post_id` before we can edit it.
    - We put `post/new/` for `post_new`. Notice here that we don't put a `post_id`. That's because it doesn't exist yet. The `post_id` is generated automatically by the system when we create a new post.

4. The final column then should contain what **type of request** is being made when this feature is being used. The two most common types are **GET** and **POST**. **GET** is used to request data from a specified resource while **POST** is used to send data to a server to create/update a resource. Please don't confuse this **POST** with our Django model `Post`!
    - Both `post_list` and `post_detail` are **GET** requests since it requests `Post` data from the server.
    - Both `post_new` and `post_edit` involves an **html form** to be filled out by the user. Therefore they can either be **GET** or **POST** requests depending on the context. It is a **GET** request when we display the form. It becomes a **POST** request when we submit the form.

5. You can now use this table to understand design model, views, and templates of your application. Django uses the **Model-View-Template (MVT)** design pattern to display webpages. A **model** is basically a Python object that helps us handle the database. A **template** is what the user sees in their screen (basically HTML files). A **view** is the interface that connects the model and the template. It makes sense of the data being passed from the model to the template and vice-versa. To explain why the table we just made could help us in designing our app, I describe the process below.<br>
	> [Django MVT-based Control Flow](https://www.javatpoint.com/django-mvt)
	> ![Django MVT-based Control Flow](https://www.javatpoint.com/django/images/django-mvt-based-control-flow.png){: .width-80}

    - A user **requests** for a resource from the Django application. **Column 4** of our table tells us about the nature of the request.
    - Django looks for the resource using its **URL** and checks if there is a **path** to it. **Column 3** tells us what that URL should look like so that it points to a path.
    - If there is a **path**, Django calls a **view** and passes to it the **request**. The view can access the database as well as decide which template is to be rendered as response to the request. We will use **Column 2** to name the views that will connect our Post model with a template.
    - Django responds back to the user sending a **template** as response. Templates are simply HTML which we'll create and style later.
<br><br>

### 2. Set-up the URLs and initialize the views.<a name="step2"></a>
***
You have three things to consider for each feature: **model, view, and template**. We already defined our Post model in part one of this guide. Now we're left with view and template. However, whenever we send a request to a Django application, the first thing it really does is to make sense of the URL and check if there's a **path** for it. Otherwise, it will raise an error. In this section you define the paths in your application. The path defines which view should be used for the URL. We'll use the information from columns 2 and 3 of our table.<br><br>

1. Create a new file called `urls.py` in `blog/` . This is where you will set-up app-level URLs.

2. Import `path` from `django.urls` as well as all `views`. We pass three parameters to `path()`: the URL string format (column 3 of our table), the corresponding view for the URL (column 2 of our table), and a convenient name for the path which is usually the same as the view name.

    ```python
	from django.urls import path
	from . import views

	urlpatterns = [
		# Assign a view called post_list to the Root URL.
		path('', views.post_list, name='post_list'),
		# Assign a view called post_detail when displaying a post.
		path('post/<int:pk>/', views.post_detail, name='post_detail'),
		# Assign a view called post_new when creating a new post.
		path('post/new/', views.post_new, name='post_new'),
		# Assign a view called post_edit when editing a previous post.
		path('post/<int:pk>/edit', views.post_edit, name='post_edit'),
	]
    ```
3. Go to `urls.py` in `mysite/`. Remember that a project can have multiple apps inside of it. This is where you will set-up project-level URLs. You need **include** (import include) the urls of your app in the project's urls. By default the admin URL is included so you didn't have to worry about that in part one.

    ```python
	from django.contrib import admin
	from django.urls import path, include # add include

    urlpatterns = [
		# Include path for admin
		path('admin/', admin.site.urls),
		# Include all URLs defined in blog/urls.py
		path('', include('blog.urls')),
    ]
    ```

4. To check if our paths are working, let's set up **dummy** **views** in `blog/views.py`. Go ahead and add a simple `HttpResponse()` to render plain text signifying where you are in the app. We'll know more about views in the latter part.

	```python
	from django.http import HttpResponse

	def post_list(request):
		return HttpResponse("You are at the index page.")

	def post_detail(request, pk):
		return HttpResponse("You are at post: %s." % pk) 

    def post_edit(request, pk):
		return HttpResponse("You are editing post: %s." % pk) 

    def post_new(request):
		return HttpResponse("You are creating a new post.") 

	```

5. Run the server and go to `http://localhost:8000`. You should be able to see the index page.
	><strong>Rendering post_list template at</strong> `http://localhost:8000`
	![post_list template 1]({{ site.baseurl }}/assets/img/django4.png)

6. Trying going to a post with any id e.g. `localhost:8000/post/99/`. You shall see the id number you chose in the webpage: "You are at post: 99." Note that your dummy view doesn't care about whether or not the Object with that id really exists, so at this point you can input any id as long as it's an integer.
	><strong>Rendering post_detail template at</strong> `localhost:8000/post/99/`
	![post_detail template 1]({{ site.baseurl }}/assets/img/django5.png)

7. Trying editing a post with any id e.g. `localhost:8000/post/11/edit/`, and you should see the text: "You are editing post: 11." on your browser.
	><strong>Rendering post_edit template at</strong> `localhost:8000/post/11/edit/`
	![post_edit template 1]({{ site.baseurl }}/assets/img/django6.png)

8. Finally, try creating a new post by visiting `localhost:8000/post/new/`, and you should see "You are creating a new post." on your browser.
	><strong>Rendering post_new template at</strong> `localhost:8000/post/new/`
	![post_new template 1]({{ site.baseurl }}/assets/img/django7.png)

<br><br>

### 🚧 Hey there, just a checkpoint!

Having too much fun or is it just too much? Regardless, I just wanted to congratulate you for your accomplishments so far. At this point, you now have an understanding of how Django processes URLs and a faint idea about how views work. Take time to process it. If you want to take a break before going to the next part, then go on ahead, you deserve it. 👍🏽 <br><br>
Now that you already have your paths working, you can now move on to creating views and templates to display each of our webpages. We'll set up a **view and template** for each of our app features. But first, let's have a recap. 🤔

> 🔍 **What's in a view?**
>
>> - A **view** is where you put the **logic** of the app.
>> - All views **receive** at least one parameter named **request** which contains data passed **from the template**. Parameters can also be passed to a view **via the URL** as you will see in `post_detail`  and `post_edit`.
>> - Views can **modify the database** through **models**.
>> - Views can **send** **information** back to their templates or **redirect** to another template. We store this **information** in a variable called `context` for cleaner code.
>
> 🔍 **What's in a template?**
>
>> - A template is the **interface** that the user sees in their computer screen.
>> - A template is both defined by its **URL** and its **content**.
>> - A template can be rendered by **any view**.
>> - A template can receive data **from the view**. A template can also receive data **from the user** through an **HTML form**.
>> - A template can send data to a view through a **POST** request.

Our approach would be to construct our app's features one by one. For each feature, we will create a view then its corresponding template. The next section is important in keeping our templates organized and our workflow smoother. Now, back to regular programming! 😉

<br><br>


### 3. Set-up the templates folder.<a name="step3"></a>
***

You already have an initial set-up for your views.  So far, you've constructed dummy views for your app's features. Now, let's set-up dummy template files to be rendered by our views.<br><br>

1. Create a new folder under the `blog/` directory named `templates/` and within it create another directory named `blog/` .

    ```bash
    blog
    └───templates
        └───blog
    ```

2. Navigate to `blog/templates/blog` and create files with the names of your views.
    - post_list.html
    - post_detail.html
    - post_new.html
    - post_edit.html
3. To see if it's working, put plaintext in it like we did in the dummy views.
    - `post_list.html`: "You are at the index page."
    - `post_detail.html`: "You are at post detail page. "
    - `post_new.html`: "You are at new post page."
    - `post_edit.html`: "You are editing a post."
4. Then, go ahead and update the views so that it renders your newly created template files. Add first the line importing `render` from `django shortcuts` as we'll use it to render the templates.

    ```python
    from django.http import HttpResponse
    from django.shortcuts import render # Add this line.

    def post_list(request):
    	return render(request, 'blog/post_list.html')

    def post_detail(request, pk):
    	return render(request, 'blog/post_detail.html')

    def post_edit(request, pk):
    	return render(request, 'blog/post_edit.html')

    def post_new(request):
    	return render(request, 'blog/post_new.html')

    ```

5. To check if you did things right, go ahead and run the server and visit `localhost:8000` and test the URLs. It should display the templates.

<br><br>

### 4. Create the index page.<a name="step4"></a>
***
Alrighty! Now we begin to create the REAL views. Let's do it chronologically, starting with `post_list`, your app's index page. Your app already knows which templates should be rendered for each view. You can now construct the webpages and pass values from views to templates. In this guide will always store those values in a variable called `context` and pass it through the `render()` shortcut. 
<br><br>

1. All of your app views are in `blog/views.py`. Open it and paste the following lines of code after the old imports. The function of these new imports will be clear while you define the views yet again.

	```python
	
	from django.http import HttpResponse
	
	# New imports:
	from .models import Post # To have access to our Posts.
	from django.utils import timezone # To help us rearrange posts according to publishing date.
	from django.shortcuts import render, get_object_or_404 # To render templates and get existing objects.

	```

2. Delete the contents of your previous dummy view for `post_list`, and construct a new one. This new `post_list` view will render all posts in a **page** that called `blog/post_list.html`. 

	```python

	def post_list(request):

		# Get all published posts and sort by published_date.
		posts = Post.objects.filter(published_date__lte=timezone.now()).order_by('published_date')

		# We store in context things from here that we want to send to the template.
		context = { 'posts' : posts }

		# Render post_list.html template.
		return render(request, 'blog/post_list.html', context)

	```

3. Now, it's time to construct the template `post_list.html` . Remember that you passed data from the view called `posts` . The nice thing about Django templates is that you can put `python` code in it in between `{ %` and `% }` or `{ {` and `} }`. Go ahead and display all of the posts through a `for` loop.
{% raw %}
	```html

	<div>
		<h1><a href="/">My Blog</a></h1>
	</div>

	{% for post in posts %}
		<div>
		    <h2><a href="">{{ post.title }}</a></h2>
		    <p>published: {{ post.published_date }}</p>
			<p>{{ post.text|linebreaksbr }}</p>
		</div>
	{% endfor %}

	```
{% endraw %}

4. To check this, go ahead and run the server. When you go to `http://localhost:8000` , you should see a list of posts like so.
	><strong>Rendering post_list template at</strong> `http://localhost:8000`
	![post_list template 2]({{ site.baseurl }}/assets/img/django8.png)


<br><br>

### 5. Create the post page.<a name="step5"></a>
***

You'd want to link those Post titles in the index page to their respective Post pages. To do that, first you must construct the `post_detail` view that should render a template displaying the contents of a certain `Post`.<br><br>

1. Redefine the `post_detail` view as follows. This new view receives the **request (request)** from the user as well as a **primary key (pk)** from the URL as what was pointed to . This key is the unique identifier of a `Post` in our database. Use `get_object_or_404()` to handle the error if the `pk` does not correspond to any `Post`. Otherwise, pass the retrieved `Post` object to the template called `blog/post_detail.html` .

	```python
	def post_detail(request, pk):
		# Get post using the primary key from the URL
		# Return 404 if it doesn't exit
		post = get_object_or_404(Post, pk=pk)
		context = {'post' : post}
		return render(request, 'blog/post_detail.html', context)
	```

2. Unlike the previous dummy view, the `post_id` is now used by the view to retrieve a `Post` object from the database. Now recreate the `post_detail.html` template.

{% raw %}
	```html
	<div class="post">
		<h2>{{ post.title }}</h2>
		<div class="date">
			{{ post.published_date }}
		</div>
		<p>{{ post.text|linebreaksbr }}</p>
	</div>
	```
{% endraw %}

3. Now that you have a view and template for `post_detail`, you can now go back to the `post_list` template and make the Post titles link to the `post_detail` template. This line of code tells you that link points to the `post_detail` path, which should call the `post_detail` view passing to it the Post's primary key `pk`, and finally rendering the `post_detail` template.
{% raw %}
	```html
	<h2><a href="{% url 'post_detail' pk=post.pk %}">{{ post.title }}</a></h2>
	```
{% endraw %}

4. Now, you can test if that is true by going to the first `Post` you have created previously using the Django shell. Go to that page through the index page.
	><strong>Rendering post_detail template at</strong> `localhost:8000/post/1/`
	![post_detail template 2]({{ site.baseurl }}/assets/img/django9.png)

5. You can also try going to a non-existent post through the URL and you should see a 404 error.
	><strong>Rendering default error_404 template at</strong> `localhost:8000/post/20/` as there are no post with `id=2`.
	![error_404 template]({{ site.baseurl }}/assets/img/django10.png)

<br><br>

## Wow! You've made it this far! 👏🏽
Hey, you've reached the end of part two! Give yourself a pat on the back and take time to process what you've learned so far. At this point you now have an index page and a post page. That's proof that you've obtained a deeper understanding of how models, views, and templates work. In the next part, we'll discuss how to receive information from the user's end through Django forms. Click <a href='{{ site.baseurl }}/2020/06/11/django-guide-part-3.html'>here</a> to continue.