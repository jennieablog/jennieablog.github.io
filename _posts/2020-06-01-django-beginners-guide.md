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
# Definition model should have pos_tag (part of speech) and definition_text.
class Definition(models.Model):
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    pos_tag = models.CharField(max_length=10)
    definition_text = models.CharField(max_length=200)
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

6. Allow the app's tables to be modifiable by editing `myapp/admin.py`
```python
# myapp/admin.py
from django.contrib import admin
from .models import Word, Definition
admin.site.register(Word)
admin.site.register(Definition)
```

7. Log in at `localhost:8000/admin` and populate initial DB as admin.<br><br>

***
###  🚧 Checkpoint 1: Test admin functionality.
*** 

