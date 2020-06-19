// Check local storage for which theme to activate.
if (localStorage.getItem("grape-color")==="dark") {
	// Set data-theme to dark.
	document.documentElement.setAttribute("data-theme","dark");
}
else {
	// Set data-theme to default.
	document.documentElement.removeAttribute("data-theme");
}

// This function is called everytime you click the toggle button.
function changeGrape(){
	// Change to dark if 
	if (localStorage.getItem("grape-color")==="dark") {
	  document.documentElement.removeAttribute("data-theme")
	  localStorage.setItem("grape-color",null);
	}
	else {
	  document.documentElement.setAttribute("data-theme","dark");
	  localStorage.setItem("grape-color","dark");
	}
}
