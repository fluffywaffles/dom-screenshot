(function() {
    "use strict";

    function copyCSS(source, target) {
	var cs = window.getComputedStyle(source);
        for (var prop in cs) {
            if(isNaN(parseInt(prop, 10)) && typeof cs[prop] === "string" && !(/^(cssText|parentRule)$/).test(prop)) {
                target.style[prop] = cs[prop];
            }
        }
    }

    function DomScreenshot(sourceNode) {
        var node = sourceNode.cloneNode(true),
            children = node.querySelectorAll('*'),
            sourceChildren = sourceNode.querySelectorAll('*');

        copyCSS(sourceNode, node);

        // reset root's margin
        ["margin", "marginLeft", "marginTop", "marginBottom", "marginRight"].forEach(function(k) {
            node.style[k] = '';
        });

        for(var i = 0; i < children.length; i++) {
            copyCSS(sourceChildren[i], children[i]);
        }

        node.setAttribute("xmlns", "http://www.w3.org/1999/xhtml"); // SVG can only eat well formed XHTML
        var xml = new XMLSerializer().serializeToString(node);
        this.dataURI = "data:image/svg+xml, <svg xmlns='http://www.w3.org/2000/svg' width='" + node.offsetWidth + "' height='" + node.offsetHeight + "'><foreignObject width='100%' height='100%' x='0' y='0'>" + xml + "</foreignObject></svg>";
    }

    DomScreenshot.prototype.toDataURI = function() {
        return this.dataURI;
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


var dataURI = (new DomScreenshot(document.body)).toDataURI();
console.log(dataURI);
