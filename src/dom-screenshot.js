// maybe using setInterval?

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
        var width = sourceNode.offsetWidth,
            height = sourceNode.offsetHeight;
        console.log([width, height]);
        this.svg = "<svg xmlns='http://www.w3.org/2000/svg' width='" + width + "' height='" + height + "'><foreignObject width='100%' height='100%' x='0' y='0'>" + xml + "</foreignObject></svg>";
    }

    /**
     * Convert to Base64 Data URI
     *
     * @method enableTooltip
     * @private
     */
    DomScreenshot.prototype.toDataURI = function() {
        return "data:image/svg+xml;base64," + window.btoa(this.svg);
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
