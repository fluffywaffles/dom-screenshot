(function() {
    "use strict";

    function copyCSS(source, target) {
        // Note: get cs.cssText does not work in firefox
	var cs = window.getComputedStyle(source),
            cssText = '';
        for(var i = 0; i < cs.length; i++) {
            var style = cs[i];
            cssText += style + ':' + cs.getPropertyValue(style) + ';';
        }
        target.style.cssText = cssText;
    }

    /**
     * @class DomScreenshot
     * @constructor
     */
    function DomScreenshot(sourceNode) {
        var node = sourceNode.cloneNode(true),
            children = node.querySelectorAll('*:not(script)'),
            sourceChildren = sourceNode.querySelectorAll('*:not(script)');

        var scripts = node.querySelectorAll('script');
        for(var i = 0; i < scripts.length; i++) {
            scripts[i].remove();
        }

        copyCSS(sourceNode, node);

        // reset root's margin
        ["margin", "marginLeft", "marginTop", "marginBottom", "marginRight"].forEach(function(k) {
            node.style[k] = '';
        });

        for(var j = 0; j < children.length; j++) {
            copyCSS(sourceChildren[j], children[j]);
        }

        node.setAttribute("xmlns", "http://www.w3.org/1999/xhtml"); // SVG can only eat well formed XHTML
        var xml = new XMLSerializer().serializeToString(node);
        var width = sourceNode.offsetWidth,
            height = sourceNode.offsetHeight;
        this.svg = "<svg xmlns='http://www.w3.org/2000/svg' width='" + width + "' height='" + height + "'><foreignObject width='100%' height='100%' x='0' y='0'>" + xml + "</foreignObject></svg>";
    }

    /**
     * Convert to Base64 Data URI
     *
     * @method toDataURI
     */
    DomScreenshot.prototype.toDataURI = function() {
        return "data:image/svg+xml;base64," +  window.btoa(unescape(encodeURIComponent(this.svg)));
    }

    if(typeof KISSY !== "undefined") {
        if(typeof require !== "undefined") {
            // udata package
            module.exports = DomScreenshot;
        } else {
            // kissy package
            KISSY.add(function(S, require, exports, module) {
                module.exports = DomScreenshot;
            });
        }
    } else {
        window.DomScreenshot = DomScreenshot;
    }
})();
