---
layout: post
title: A blog is born 👶
subtitle : Creating a website in under an hour & hosting it for free
tags: [jekyll, github, grape-theme]
image: https://images.pexels.com/photos/160107/pexels-photo-160107.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940
author: Jennie Ablog
comments : True
---
<strong>Welcome!</strong> I just made this website with `Jekyll`, an open source static page generator, and I'm hosting it using `GitHub Pages`. All the services I used are 100% <strong>free</strong>. I'm currently using this <a href="https://github.com/naye0ng/Grape-Theme">`grape-theme`</a> with only a few modifications to the original code. You can find my source code <a href="https://github.com/jennieablog/jennieablog.github.io">here</a>.<br><br>

<strong>Alright.</strong> Now I'm going to show you how to do it. 👩🏾‍💻<br><br>

<h3>Prerequisites</h3>

> Skills
- Basic HTML and CSS
- Git

> Installations
- <a href="https://www.ruby-lang.org/en/downloads/">Ruby</a> (programming language)
- <a href="https://git-scm.com/">Git</a> (version control)
- <a href="https://github.com/">GitHub</a> (you need an account)
- <a href="https://bundler.io/">Bundler</a>
- <a href="https://jekyllrb.com/docs/installation/macos/#install-command-line-tools">Here</a> is a complete installation guide from the Jekyll website.

<br>

<h3>Getting Started with GitHub</h3>
1. Sign in to your GitHub account. <a href="https://github.com/new">Create</a> a new repository and name it `[username].github.io`, replacing `[username]` with your GitHub username. 

	>Be sure the first part of the repo name exactly matches your username and that you set your repository to <strong>`public`</strong>. Otherwise, it will not work.
<br>
2. Create a `.gitignore` file and add the following line: `_site/`

	> This file tells `git` to ignore the `_site` directory that Jekyll automatically generates each time a commit is made.
<br>
3. Open your terminal and create a local copy of your website on your computer using the command: `git clone https://github.com/[username]/[username].github.io.git`. That way you can always preview your Jekyll site first before pushing it to GitHub pages.

<br>

<h3>Finding A Theme For Your Jekyll Site</h3>
1. You can find, preview, and download themes for your Jekyll site on different galleries found online such as the following:
	- [JamStack](https://jamstackthemes.dev/ssg/jekyll/)
	- [Jekyll Themes dot org](https://jekyllthemes.org)
<br>
2. Once you've chosen a theme, download and extract the file to your local git repository at `~../[username].github.io/`.
	> You can always choose to write your own HTML and CSS [independently](https://jekyllrb.com/tutorials/convert-site-to-jekyll/). I just find it much more convenient and time-efficient to pick a pre-made theme and personalize it to my liking.
<br>
3. Run `bundle install` on your local git repository to install dependencies for your Jekyll site.
<br>
4. Finally, run `bundle exec jekyll serve` to test your site locally. It should be up and running at `http://localhost:4000/`.

<br>

<h3>Personalizing Your Jekyll Site</h3>

{% highlight python %}
# Site Settings
baseurl: ""
url : "https://jennieablog.github.io"

# Blog Settings
theme_settings :
  title : "Jennie Ablog"
  favicon : "assets/favicon.ico"

  # Profile Settings
  profile :
    image : "assets/img/profile.jpg"
    username : "Jennie Ablog"
    description : "A BSc CS student who loves to teach herself a lot of stuff. 👩🏾‍💻"
{% endhighlight %}

1. Your Jekyll site's configuration variables can be found at the file called `config.yml`. You can fill out missing fields or replace unwanted variables completely, and it will look a lot like the code block above.
2. Once you're already satisfied with the way it looks on your `localhost`, you can proceed to deployment to GitHub Pages.

<br>

<h3>Deploying to GitHub Pages</h3>
1. Fire up your terminal and navigate to your local git repository. Simply enter `git add .` to add all files to be deployed.
2. Next, type in `git commit -m "initial commit for jekyll site"` to commit these changes.
	> You can always change the commit message according to your preference.
3. Finally, type in `git push origin master` to deploy your site to GitHub pages.
4. After a while, you can view your Jekyll Site running at `[username].github.io`.

<br>

<h3>Writing Your First Blog Post</h3>
1. Downloaded Jekyll themes usually come with sample blog posts which are located in a folder named `posts/`.
2. Navigate to that folder. You will see files that are likely named in this format `YYYY-MM-DD-sample-blog-post.md`. When you open it it will look something like an `html` file except that it has something else in the beginning.
3. What you see in the beginning of the file is called a `yaml` Front Matter block. Between the triple-dashed lines, you can set predefined variables or even define your own. They will then be made available for access using Liquid tags in the file. For more information on Front Matter, visit this [page](https://jekyllrb.com/docs/front-matter/).
{% highlight python %}
---
layout: post
title: title
subtitle : subtitle
tags: [tag1, tag2]
author: 
comments : 
---
{% endhighlight %}


<br>

After writing your blog post, you can `git commit` and `git push` again to the master branch of your `git` repository. Your website shall be updated accordingly.

<br>

> When in doubt, you can always consult the Jekyll [documentation](https://jekyllrb.com/docs/), or the `README.md` of the GitHub repository of your chosen Jekyll theme, like [this one](https://github.com/naye0ng/Grape-Theme/blob/master/README.md) or [this one](https://github.com/sergiokopplin/indigo/blob/gh-pages/README.md).

<br>

<strong>Voila!</strong> You now have your own portfolio/blog website hosted for free for-ever. That wasn't so hard, was it? 🤙