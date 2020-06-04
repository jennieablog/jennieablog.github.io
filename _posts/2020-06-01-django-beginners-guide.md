---
layout: post
title: How to Django 💃
subtitle : Creating a simple dictionary app with Django
tags: [django, tutorial]
image: https://images.pexels.com/photos/160107/pexels-photo-160107.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940
displayimage: false
final: false
author: Jennie Ablog
comments : True
---

<!-- INTRODUCTION -->


<strong>Django</strong> is, according to their <a href="https://djangoproject.com/">website</a>, the web framework for perfectionists with deadlines. This is a <strong>guide</strong> for building a simple app using the Django web framework. The only prerequisite besides a familiarity with the terminal is knowing how to code in `python`.<br><br>

<!-- THE SETUP -->

<h3>0. Set-up the development environment.</h3>

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