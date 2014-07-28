(function() {
    "use strict";

    function copyCSS(source, target) {
	var cs = window.getComputedStyle(source);
        for (var key in cs) {
            if(typeof key === "string" && typeof cs[key] == "string" && !(/^(cssText|parentRule)$/).test(key)) {
                target.style[key] = cs[key];
            }
        }
    }

    function inlineStyles(elem, origElem) {

	var children = elem.querySelectorAll('*');
	var origChildren = origElem.querySelectorAll('*');

	// copy the current style to the clone
	copyCSS(elem, origElem, 1);

	// collect all nodes within the element, copy the current style to the clone
	Array.prototype.forEach.call(children, function(child, i) {
	    copyCSS(child, origChildren[i]);
	});

	// strip margins from the outer element
	elem.style.margin = elem.style.marginLeft = elem.style.marginTop = elem.style.marginBottom = elem.style.marginRight = '';

    }

    var domScreenshot = {

        toDataURI: function(origElem, width, height, left, top) {
	    left = (left || 0);
	    top = (top || 0);

	    var elem = origElem.cloneNode(true);

	    // inline all CSS (ugh..)
	    inlineStyles(elem, origElem);

	    // unfortunately, SVG can only eat well formed XHTML
	    elem.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

	    // serialize the DOM node to a String
	    var serialized = new XMLSerializer().serializeToString(elem);

	    // Create well formed data URL with our DOM string wrapped in SVG
	    var dataUri = "data:image/svg+xml," +
		    "<svg xmlns='http://www.w3.org/2000/svg' width='" + ((width || origElem.offsetWidth) + left) + "' height='" + ((height || origElem.offsetHeight) + top) + "'>" +
		    "<foreignObject width='100%' height='100%' x='" + left + "' y='" + top + "'>" +
		    serialized +
		    "</foreignObject>" +
		    "</svg>";

        },

	toImage: function(origElem, callback, width, height, left, top) {

            var dataUri = this.toDataURI(origElem, width, height, left, top);

	    // create new, actual image
	    var img = new Image();
	    img.src = dataUri;

	    // when loaded, fire onload callback with actual image node
	    img.onload = function() {
		if(callback) {
		    callback.call(this, this);
		}
	    };

	}

    };

    if(typeof KISSY !== "undefined") {
        if(typeof require !== "undefined") {
            // udata package
            module.exports = domScreenshot;
        } else {
            // kissy package
            KISSY.add(function(S, require, exports, module) {
                module.exports = domScreenshot;
            });
        }
    } else {
        window.domScreenshot = domScreenshot;
    }

})();

