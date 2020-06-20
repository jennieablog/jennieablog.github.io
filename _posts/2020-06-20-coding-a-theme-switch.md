---
layout: post
title: Let there be 'dark' 🌗
subtitle : Creating a dark theme switch for a static site generator
tags: [dark-theme, javascript, css, jekyll, fouc]
image: https://images.pexels.com/photos/596132/pexels-photo-596132.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940
displayimage: false
show: True
author: Jennie Ablog
comments : True
---

<!-- INTRO -->

I recently put up a dark theme switch on this site. You can find it on the upper right corner of the page. I wrote this to share what's behind it and what other things you can try do with this switch. I talk for a while about how I came up with my code, but if you want to skip the back story, you can [click here for a TL;DR](#tldr).

<br><br>


## Using dark reader
***

My fascination with using a switch to change between light and dark modes while browsing the web started when I installed [Dark Reader](https://chrome.google.com/webstore/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh) on my browser. The extension inverts the lightness of the colors of web pages and adjusts its properties to reduce eyestrain. It was pretty useful for me because it lets me adjust what kind of colors I see on my browser depending on how I like them to be. I usually prefer dark colors because they are easier on my eyes, but they can get hard to read when at a place with so much sunlight like on parks and in cafes. I love working indoors, but I also love working outside where the sun shines. With that, it really was convenient to always have this extension. Thing is, when I switch to other devices without Dark Reader, this amazing feature disappears. There are a few sites offering dark themes like Twitter but it isn't really easy to flick the switch as with Dark Reader. I'd like to solve that problem on my personal blog site. At first, I wanted to try  putting a Dark Reader switch on it, so I went to Dark Reader's [github repo](https://github.com/darkreader/darkreader) and grabbed the JavaScript from there, and did the following:<br><br>

1. I included it in the `html.head` of my site.

    ```html
    <script type="text/javascript" src="https://unpkg.com/darkreader@4.9.10/darkreader.js"></script>
    ```

2. I put a cute little check box on my site to act as a Dark Reader switch.

    ```html
    <input type="checkbox" id="theme-switch" onclick="changeTheme()">
    ```

3. I write this new js file in `assets/js` called `theme-switcher.js` and put the `changeTheme()` function in it.

    ```jsx
    function changeTheme(){
      const theme_switch = document.getElementById("theme-switch");
      if (theme_switch.checked) {
        DarkReader.enable();
      }
      else {
        DarkReader.disable();
      }
    }
    ```

4. Finally I load this tiny js code in the html head

    ```html
    <head>

      <!-- THEME SWITCHER -->
      <script type="text/javascript" src="{{ '/assets/js/theme-switcher.js' | relative_url }}"></script>

      <!-- The rest of the head content goes here... -->
    ```

<br><br>

## Caching the switch
***

Okay so I already have the switch. The thing is, when I navigate to other pages on my website, the switch turns off again. In order to solve that, I cache the switch so that my browser remembers my theme and retains the value for the checkbox as I navigate through the site. HTML5 has ways of allowing to store up to 5MB of data until the user closes the browser (`sessionstorage`) or clear the cache (`localStorage`). Here, I use `localstorage`.  I enabled caching the switch in two easy steps:

<br>

1. I added a few lines in `assets/js/theme-switcher.js/` to check `localStorage` every time the site is reloaded AND write to memory every time the theme is changed through clicking the checkbox.

    ```jsx
    function changeTheme(){
      const theme_switch = document.getElementById("theme-switch");
      if (theme_switch.checked) {
        DarkReader.enable();
        // Add the ff. line to write to memory.
        localStorage.setItem("my-theme","dark");
      }
      else {
        DarkReader.disable();
        // Add the ff. line to write to memory.
        localStorage.setItem("my-theme",null);
      }
    }

    // Check local storage every reload to know which theme to use.
    if (localStorage.getItem("my-theme")==="dark") {
      // Use dark theme.
      DarkReader.enable();
    }
    else {
      // Use default theme.
      DarkReader.disable();
    }

    ```

2. Finally, I write this js below the checkbox so that even when the site is reloaded, the checkbox always reflects the theme as written in `localStorage`. 

    ```html

    <script type="text/javascript">
      document.getElementById("theme-switch").checked = localStorage.getItem("my-theme")==="dark"
    </script>
    ```

<br><br>

## Coming over to the 'dark-mode-switch'
***

The Dark Reader switch worked. The effect looked pretty decent at the start, but I figured it really didn't work so well with my theme's color scheme. So I looked for ways where I could define my preferred "dark" colors. I came across the [Dark Mode Switch](https://coliff.github.io/dark-mode-switch/) on GitHub. From it, I figured I could use a toggle switch instead of a checkbox instead. I got rid of my Dark Reader code and tried this new `dark-mode-switch` instead. Here's how I did it according to the website:

<br>

1. I loaded the Bootstrap CSS for the toggle switch to work as intended.

    ```jsx
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
    ```

2. I downloaded the `dark-mode-switch` JS to my `assets/js/`. For me, it looked like a hideous line of code.

    ```jsx
    const darkSwitch=document.getElementById("darkSwitch");function initTheme(){const e=null!==localStorage.getItem("darkSwitch")&&"dark"===localStorage.getItem("darkSwitch");darkSwitch.checked=e,e?document.body.setAttribute("data-theme","dark"):document.body.removeAttribute("data-theme")}function resetTheme(){darkSwitch.checked?(document.body.setAttribute("data-theme","dark"),localStorage.setItem("darkSwitch","dark")):(document.body.removeAttribute("data-theme"),localStorage.removeItem("darkSwitch"))}window.addEventListener("load",()=>{darkSwitch&&(initTheme(),darkSwitch.addEventListener("change",()=>{resetTheme()}))});
    ```

3. I inserted this on my site's html. This is the bootstrap toggle switch.

    ```html
    <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input" id="darkSwitch" />
      <label class="custom-control-label" for="darkSwitch">Dark Mode</label>
    </div>
    <script src="dark-mode-switch.min.js"></script>
    ```

4. Finally, I added the basic example of the dark theme in my CSS which I will have to make additions to later on.

    ```css
    [data-theme="dark"] {
      background-color: #111 !important;
      color: #eee;
    }
    ```

<br><br>

## I have issues with the implementation. 🧐
***

The `dark-mode-switch` worked, sadly not the way I wanted it to. I have a few issues which are by the way, due to my personal preferences, **not** because of actual bugs in the code. I state them below along with the improvisations I made to solve these issues.

<br><a id="fouc"></a>

### Issue # 1: FOUC
While I was playing with my new `dark-mode-switch`, I noticed that whenever I navigate to other pages, there is a quick flash just before the page is loaded as it went from white to the darker background color. I personally didn't like how that played out, so I searched about it and learned about **Flash of Unstyled Content** or **FOUC**. I found out that, because I was using a static site generator i.e. Jekyll, I can only apply my preferred theme once a small piece of Javascript executes to determine and set the theme, which results in the delay that causes the flash. I figured the problem was that the preferred theme applies to the `html.body` element, not the `html` element itself. So while waiting for the `html.body` to finish loading and finally be displayed, a blank `html` with white background (default) is displayed for a few milliseconds.

##### Solution: Apply theme to the HTML element itself.
The solution was to apply the theme to the `html` element itself and load whatever JavaScript I have for theme-switching at the html head so it executes sooner as the page content is loading. I figured I needed to edit the JavaScript, which leads to my next and final issue...

<br>

### Issue # 2: Readability of code
To be honest, I cannot make 100% sense of the `dark-mode-switch` code, because my JS skills are not that great and I'm really not a fan of long one-liner codes. Although I believe I could possibly understand it when I put in the time and effort, I trust that I can write from scratch instead code that is more readable and get quicker results. But more importantly, it makes the code understandable and easier to tweak for JS noobs like me.

##### Solution: Write my own code.
I decided to **get rid of the `dark-mode-switch` script altogether and write my own dark theme switch** which I describe in the next and final portion of this blog post below.

<br><br><a id="tldr"></a>

# Coding my own dark theme switch
***
In summary, here is how I implemented my dark theme switch. 💁🏽

<br>

# CSS

1. I defined a `data-theme` with dark colors in my site's CSS and named it `dark`. This will be added as an attribute to the `html` element whenever the switch is toggled. Shown below is a basic dark theme example because my actual CSS is [a bit long](https://raw.githubusercontent.com/jennieablog/jennieablog.github.io/master/_sass/base/_darkgrape.scss).

    ```css
    /* Basic dark theme */
    [data-theme="dark"] {
      background-color: #111 !important;
      color: #eee;
    }
    ```

2. I wrote this CSS for my personalized toggle switch because I didn't want to import [Bootstrap](https://getbootstrap.com/) like in [this implementation]().

    ```css
    /* The switch - the box around the slider */
    .switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }
    /* Hide default HTML checkbox */
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    /* The slider */
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: 2s;
      transition: 2s;
    }
    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: #eee;
      -webkit-transition: 1s;
      transition: 1s;
    }
    input:checked + .slider {
      background-color: #BB78FF;
    }
    input:focus + .slider {
      box-shadow: 0 0 1px #BB78FF;
    }
    input:checked + .slider:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }
    /* Rounded sliders */
    .slider.round {
      border-radius: 34px;
    }
    .slider.round:before {
      border-radius: 50%;
    }
    ```
<br>

# JavaScript

1. I deleted all previously coded JavaScripts and created a new file called `assets/js/theme-switcher.js`.

2. I put this script instead. This caches data in the browser's `localStorage` so that the theme is retained.  It checks the browser's `localStorage` every time the site is reloaded and applies the theme that's written there. It also writes to `localStorage` every time the switch is toggled.

    ```jsx
    // This function runs every time the switch is toggled.
    function changeTheme(){
      const theme_switch = document.getElementById("theme-switch");
      if (theme_switch.checked) {
        document.documentElement.setAttribute("data-theme","dark");
        // Add the ff. line to write to memory.
        localStorage.setItem("my-theme","dark");
      }
      else {
        document.documentElement.removeAttribute("data-theme")
        // Add the ff. line to write to memory.
        localStorage.setItem("my-theme",null);
      }
    }

    // Check local storage every time html is loaded to know which theme to use.
    if (localStorage.getItem("my-theme")==="dark") {
      // Use dark theme.
      document.documentElement.setAttribute("data-theme","dark");
    }
    else {
      // Use default theme.
      document.documentElement.removeAttribute("data-theme")
    }
    ```
<br>

# HTML

1. Inserted this in the `HTML.head` to solve the FOUC issue as explained [above](#fouc).
	```html
	<head>

		<!-- THEME SWITCHER -->
		<script type="text/javascript" src="{{ '/assets/js/theme-switcher.js' | relative_url }}"></script>

		<!-- The rest of the head content goes here... -->
	```

2. Finally, I inserted this `html` for the toggle switch in the `.nav-bar` of my site's html body. The script below the toggle switch ensures that the checkbox always reflects the theme as written in `localStorage` even when the site is reloaded.
	```html
	<label class="switch" for="theme-switch" style="float: right; margin-top: 10px;">
		<input type="checkbox" id="theme-switch" onclick="changeTheme()">
		<span class="slider round"></span>
	</label>
	<script type="text/javascript">
	document.getElementById("theme-switch").checked = localStorage.getItem("my-theme")==="dark"
	</script>
```

<br><br>

And that's how I made my dark theme switch. You can use my code any time to add a dark theme switch to your own site. If you have questions or see bugs, please comment them below!