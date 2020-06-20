---
layout: post
title: Loading la vida local 🤪
subtitle : Loading local js & css files in the browser console
tags: [javascript, chrome-console, copy-pasta]
image: 
displayimage: false
show: True
author: Jennie Ablog
comments : True
---

<!-- INTRO -->

I use the following codes on the browser console when I'm testing local js and css files on websites. May also be used to import said files from other servers. Wrote this blog entry to keep the code for copy-pasta purposes.

<br>

### Load CSS from console
***

Loading local css file as link element.
```javascript
// Create empty link element
var link_element = document.createElement("link");
// Define css file path
var css_path = "[path_to_css_file]"
// Define attributes for link element
link_element.setAttribute("rel","stylesheet");
link_element.setAttribute("href",css_path);
document.head.appendChild(link_element);

```
<br>

### Load JS from console
***

Loading local js file as script element.
```javascript
// Create empty script element
var script_element = document.createElement("script");
// Define js file path
var js_path = "[path_to_js_file]"
// Define attributes for script element
script_element.setAttribute("src",js_path);
script_element.setAttribute("type","text/javascript");
document.head.appendChild(script_element);
```