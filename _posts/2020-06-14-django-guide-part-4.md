---
layout: post
title: Part 4️⃣ of how to django 💃
subtitle : Deploying your django app
tags: [deployment, django, tutorial]
image: 
displayimage: false
show: False
author: Jennie Ablog
comments : True
---

<!-- INTRODUCTION -->

Let's wrap it up! This is **the final part** of my [four-part guide]({{ site.baseurl }}/2020/06/01/django-beginners-guide.html) for building a simple blog app using the Django web framework.<br><br>

## Outline
***

[Part 1: Initializing your Django application]({{ site.baseurl }}/2020/06/09/django-guide-part-1.html)

[Part 2: Creating the Django application interface]({{ site.baseurl }}/2020/06/10/django-guide-part-2.html)

[Part 3: Getting data from Django forms]({{ site.baseurl }}/2020/06/11/django-guide-part-3.html)

**[Part 4: Deploying your Django app](#)** ⬅️ You are here!

1. [Set up Heroku](#step1)
2. [Set up static assets and database configuration.](#step2)
3. [Create the heroku app.](#step3)
4. [Configure the git repository within the project and deploy!](#step4)

<br><a name="step1"></a>

### 1. Set up Heroku.
***
We will use the Heroku CLI to deploy your app. First you will need to create an account. After doing so, you need to set up the configurations in your Django project for deployment.

<br>

1. Create a heroku account [here](https://signup.heroku.com/) if you haven't already.

2. Install the Heroku CLI. I use brew to install heroku. Click here for instructions for other OS.
```bash
brew tap heroku/brew && brew install heroku
```

3. Log-in to heroku through the terminal and enter your credentials.
```bash
heroku login
```

4. Add a Procfile in the project root directory through the terminal. Use the name of your project, in this guide, we use `mysite`.
```bash
echo web: gunicorn mysite.wsgi --log-file - > Procfile
```

5. Create the file `runtime.txt` and add your version of python.
```bash
echo python-3.7.1 > runtime.txt
```

6. Install these packages in your virtual environment.
```bash
source djangoenv/bin/activate
pip install gunicorn dj-database-url whitenoise psycopg2
```

7. Edit the  `requirements.txt` and add contents to it using the following command.
```bash
pip freeze > requirements.txt
```

<br><br><a name="step2"></a>

### 2. Set up static assets and database configuration.
***
Next is you'll need to set up the configuration for your static assets and database. Here, assume that you have a static folder within your project directory. You can also create it and put some custom `CSS` and other static files in it. Either way, you need to edit `settings.py` to make it work both in development and production.

<br>

1. Open `[settings.py](http://settings.py)` and paste the following block of code at the bottom of the file.
```python
	# Extra lookup directories for collectstatic to find static files
	STATICFILES_DIRS = (
		os.path.join(BASE_DIR, 'static'),
	)
	#Add configuration for static files storage using whitenoise
	STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
	import dj_database_url 
	prod_db  =  dj_database_url.config(conn_max_age=500)
	DATABASES['default'].update(prod_db)
```

2. Also in the same file, add `whitenoise` middleware in the `MIDDLEWARE` list.
```python
'whitenoise.middleware.WhiteNoiseMiddleware',
```
<br><br><a name="step3"></a>

### 3. Create the heroku app.
***

1. Choose a unique name for your application and create it via terminal.
```python
heroku create myblogsite
```

2. Heroku will let you know if it's a success. Add your app domain name to `ALLOWED_HOSTS` in `settings.py`.
```python
ALLOWED_HOSTS = ['localhost', 'myherokuappname.herokuapp.com']
```

3. Set `DEBUG = False` in `settings.py`. so that the page renders the standard Error 404 and not a bug message.

<br><br><a name="step4"></a>

### 4. Configure git repository within the project folder and deploy!
***

1. Initialize a git repository within your project folder if you haven't already.
```bash
git init
```

2. Add your heroku app as a remote branch.
```bash
heroku git:remote -a myblogsite
```

3. Add all your project files and do an initial commit.
```bash
git add .
git commit -m "Initial commit"
```

4. Disable collect static for your app. Finally, push it to heroku master branch to deploy and migrate the db.
```bash
heroku config:set DISABLE_COLLECTSTATIC=1
git push heroku master
heroku run python manage.py migrate
```

<br><br>

## And that's it! 🏁
Congratulations! You now have your first ever Django application. I hope you had a good time and that I made it easier for you somehow. Go forth and make more Django applications!