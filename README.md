# dom-screenshot

This is a forked version of domvas.
Seemes that the original repo was no longer maintained.
So I forked it.

## Usage

```javascript
var dataURI = (new DomScreenshot(document.body)).toDataURI();
console.log(dataURI);
```

## ChangeLog (since forked form domvas)

- `"use strict";` statement transferred into the anonymous function's body

    See also: https://github.com/pbakaus/domvas/pull/6

- Add API: domScreenshot.toDataURI()

- Remove API: toImage()

- uData package compatibility

- copyCSS: use for loop to dump computed styles and cssText to set

    See also: https://developer.mozilla.org/en-US/docs/Web/API/Window.getComputedStyle

- DataURI now in base64

- Ignore `<script>` in target

- UTF-8 Support

- No longer copy css to `<g>, <defs>, <animate>` to avoid issues when parsing generated SVG.

    See also: https://github.com/zenozeng/dom-screenshot/issues/5

## Note

- IE 9 / 10 / 11 was not supported. (as it doesn't support the foreignObject tag in SVG)

    See also http://msdn.microsoft.com/en-us/library/hh834675%28v=vs.85%29.aspx

# Domvas

## Overview

__Domvas implements the missing piece that connects the DOM and Canvas__. It gives to the ability to take arbitrary DOM content and paint it to a Canvas of your choice.

## Usage
```js
var canvas = document.getElementById("test");
var context = canvas.getContext('2d');

domvas.toImage(document.getElementById("dom"), function() {
    context.drawImage(this, 20, 20);
});
```

## Syntax
```js
domvas.toImage(domElement, readyCallback, width, height, left, top);
```
readyCallback's 'this' and first argument points to a valid, preloaded image node that you can simply draw to your canvas context.

## How it works

Domvas uses a feature of SVG that allows you to embed XHTML content into the SVG – and as you might know, the actual SVG can be used as a data uri, and therefore behaves like a standard image.

I have written about this technique in 2008 [when I brought CSS transforms to browsers that did not have them](http://paulbakaus.com/2008/08/19/css-transforms-for-firefox/). It took a little more experimentation to transform it into a reusable plugin: HTML content needs to be serialized to XML, and all styles have to be inlined.	

## Caveats

- __Internet Explorer is not supported__, as it doesn't support the foreignObject tag in SVG.
- For whatever reason, Opera is failing. I am not sure why. If a Opera pal is reading this, get in touch!
- SVG's foreignObject is subject to strong security – meaning any external content will likely fail (i.e. iframes, web fonts)
- The DOM object is __not linked, but copied__ – if you change the style of the DOM object, it will not automatically update in Canvas
- Content outside the bounding box of the element will be cut of per default if painted to Canvas. Don't worry though, simply pass a more comfortable offset to the toImage function (see above)

## Credits / License

©2012 Paul Bakaus. Licensed under MIT. Reach out on [Twitter](http://twitter.com/pbakaus)!
