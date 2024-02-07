# This is a Web-ready Babel bundle intended for the bunchmark Web presence.Babel

It inculdes the following modules:

```JS
import {parse, template, travers, generator} from "babel-bunchmark-bundle"
```

The default export is a non-minified ES module.

You can also import `"babel-bunchmark-bundle/babel.min.js"`, or load UMDs, respectively `"babel-bunchmark-bundle/babel.umd.js"` and `"babel-bunchmark-bundle/babel.umd.min.js"`. These expose the `Babel` global.