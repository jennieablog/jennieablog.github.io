---
layout: post
title: How to django 💃
subtitle : Creating a simple dictionary app with Django
tags: [django, tutorial]
image: https://images.pexels.com/photos/160107/pexels-photo-160107.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940
displayimage: false
final: false
author: Jennie Ablog
comments : True
---

<!-- INTRODUCTION -->


<strong>Django</strong> is, according to their <a href="https://djangoproject.com/">website</a>, the web framework for perfectionists with deadlines. It takes full advantage of `python`'s dynamic functionalities and is therefore quick and conveniently simple specially if you're coding in `python`. If you are interested to know more about its design philosophies, you can read them [here](https://docs.djangoproject.com/en/3.0/misc/design-philosophies/).<br><br>

This is a <strong>guide</strong> for building a simple dictionary app using the Django web framework. The only prerequisite besides a familiarity with the terminal is knowing how to code in `python`.<br><br>

### Set-up your development environment.
***

1. Install the latest version of `python`. I use <a href="https://brew.sh/">Homebrew</a> for this installation.
```bash
brew install python3
``` 
2. Installing `python3` with brew also installs `pip3` in your system. Execute the following command to install `virtualenv`.
```bash
sudo pip3 install virtualenv
```
3. Create a name for your project and a directory for it, then navigate to that directory.
```bash
mkdir mydictionary && cd mydictionary
```

3. Create a `python3 venv` within your project directory and activate it. Use `pip` to install Django.
```bash
virtualenv venv -p python3 # Create virtual environment.
source venv/bin/activate # Activate the created virtualenv.
pip install django # Install Django.
```
<br>

### Create a new Django project and app.
***

1. Activate `venv` (if not already activated) and create a new Django project.
```bash
source venv/bin/activate
django-admin startproject mydictionary
```

2. Create a new app within the created project. We'll call it `entries`.
```bash
cd mydictionary
python manage.py startapp entries
```

3. Tell Django that you have our app installed by adding your app config to the `INSTALLED_APPS` list in `mydictionary/settings.py`.
  ```python
  # mydictionary/settings.py
  INSTALLED_APPS = [
      'entries.apps.EntriesConfig', # Add your app here.
      'django.contrib.admin',
      'django.contrib.auth',
      'django.contrib.contenttypes',
      'django.contrib.sessions',
      'django.contrib.messages',
      'django.contrib.staticfiles',
  ]
  ```
<br>

### Set-up the database.
***

1. Run initial migration to create initial tables for the database.
```bash
python manage.py migrate
```
2. Define models in `/entries/models.py`. 
```python
# app/models.py
from django.db import models
# Word model has only one attribute: word_text.
class Word(models.Model):
  word_text = models.CharField(max_length=200)
  # We'll use the word_text to represent the Word Object for convenience.
  def __str__(self):
        return self.word_text 
# Definition model should have pos_tag (part of speech) and definition_text.
class Definition(models.Model):
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    pos_tag = models.CharField(max_length=10)
    definition_text = models.CharField(max_length=200)
    # We'll use the definition_text to represent the Definition Object for convenience.
    def __str__(self):
        return self.definition_text
```

3. Make a new migration to tell Django that you made some changes to the initial model.
```bash
python manage.py makemigrations entries
```

4. Migrate new changes to create new tables for new models.
```bash
python manage.py migrate
```

5. Create superuser for site admin privileges. This will prompt you to give a name, email, and password.
```bash
python manage.py createsuperuser
```

6. Allow the app's tables to be modifiable by editing `entries/admin.py`
```python
# entries/admin.py
from django.contrib import admin
from .models import Word, Definition
admin.site.register(Word)
admin.site.register(Definition)
```

7. Finally run the server and log in at `localhost:8000/admin` to populate initial DB as admin.
```bash
python manage.py runserver
```
<br><br>


### 🚧 CHECKPOINT 1: Test admin functionality.

> ☑️  Go to `localhost:8000/admin`.
>
> ☑️  Log-in using your site administrator credentials.
>
> ☑️ Add, change, and delete new Words and Definitions.
>
> ☑️ Add, change, and delete Users.
>
> ☑️ Add, change, and delete User Groups.
>
> ☑️ Track recent actions.

<br><br>

### Make the views.
***

1. In `entries/views.py`, import the following packages.
```python
# entries/views.py
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from .models import Word
```

2. Initial views in with basic text `HttpResponse`.
```python
# entries/views.py
# Word index view
def index(request):
  return HttpResponse("You're looking at the word index page.")
# Word details view
def detail(request, word_id):
    return HttpResponse("You're looking at word %s." % word_id)
# Modify word view
def modify(request, word_id):
    return HttpResponse("You're modifying word %s." % word_id)
```
<br>


### Set-up app-level routes.
***

1. Create a file called `urls.py` in the entries app directory.
```bash
cd mydictionary/entries
touch urls.py
```
2. Add `urlpatterns` for index, detail, and modify views.
```python
# entries/urls.py
from django.urls import path
from . import views
urlpatterns = [
    path('', views.index, name='index'), # index
    path('<int:word_id>/', views.detail, name='detail'), # detail
    path('<int:word_id>/modify/', views.modify, name='modify') # modify
]
```
<br>

### Set-up project-level routes.
***

1. In `mydictionary/urls.py`, import include and path.
```python
# mydictionary/urls.py
from django.urls import include, path
```

2. Add app to `urlpatterns` list in the same file.
```python
# mydictionary/urls.py
path('entries/', include("entries.urls")), 
```
<br><br>

### 🚧 CHECKPOINT 2: Test views and routes.

> ☑️  Go to `localhost:8000/entries`.
>
> ☑️  Go to `http://localhost:8000/entries/1/`.
>
> ☑️  Go to `http://localhost:8000/entries/1/modify`.


<br><br>
