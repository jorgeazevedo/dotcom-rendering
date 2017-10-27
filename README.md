# guui

Frontend rendering framework for theguardian.com.

Slack channel: [#dotcom-future](https://theguardian.slack.com/messages/C0JES5PEV)

## Requirements

- [Node.js](https://nodejs.org/en/). We recommend version 8
- [Webpack](https://webpack.js.org/)

## Install

```bash
$ npm install @guardian/guui
```

## Configure

### Provide `h()` for all JSX modules

```bash
$ npm install babel-plugin-provide-modules
```

```json
{
  "plugins": [
    ["provide-modules", {
      "@guardian/guui": ["h"]
    }]
  ]
}
```

### Use Webpack loaders

```js
// webpack.config.js

module.exports = {
    
    // ...
    
    resolveLoader: {
        modules: [
            path.resolve('node_modules', '@guardian', 'guui', 'dist', 'lib', 'loaders'),
            'node_modules'
        ]
    },
    
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: ['guui-svg-loader']
            },
            {
                test: /\.css$/,
                use: ['guui-css-loader']
            }
        ]
    }
}
```

## API

### JSX

Components are written using JSX

```jsx harmony
export default () => <h1>Hello World</h1>
```

### Styling

You may declare your styles in separate `*.css` files. Under the hood, `guui` generates CSS using 
[Emotion](https://emotion.sh/). As a result, you may define your styles using the Emotion API.

```scss
// header.css
 
.heading {
    color: ghostwhite;
    
    &:hover {
        color: palevioletred;
    }
}
```

```jsx harmony
// header.jsx
 
import { heading } from './header.css'
 
export default () => <h1 style={heading}>Hello World</h1>
```

### Exentions to standard CSS

Some Sass-like features are available to use in `.css` files.

#### Custom property and media queries

Both of these are transpiled to more compatible CSS in compilation:

```scss
@custom-media --unusual-breakpoint (max-width: 30em);
 
:root {
    --my-value: 20px;
}
 
.big {
    font-size: var(--my-value);
	 
    @media (--unusual-breakpoint) {
        color: hotpink;
    }
}

```

#### @apply

To avoid too much duplicating of rules in some circumstances, the `@apply` rule can be used: 

```scss
:root {
    --button: {
        border-radius: 28px;
    };
    --news-colour: blue;
}
 
.button {
    @apply --button;
}
 
.button--news {
    @apply --button;
    background-color: --news-colour;
}
```

### SVGs

```js
import MySVG from './my-svg.svg';
```

SVGs are loaded using `guui-svg-loader.js`, which runs them through [`svgo`](https://github.com/svg/svgo) then returns 
them as JSX objects.

You can use the JSXified SVG as a normal JSX import:

```xml
<!-- my-svg.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="60"><path ... /></svg>
```

```jsx harmony
import MySVG from './my-svg.svg'
 
export default () => <div><MySVG /></div>
 
// <div><svg width="320" height="60"><path ... /></svg></div>

```
#### Styling the SVG

```jsx harmony
<MySVG style={{ fill: "red" }} />
```

```jsx harmony
import MySVG from './my-svg.svg'
 
const style = {
    color: 'red'
}
 
export default () => <MySVG style={style} />
 
// <svg style="color: red"><path ... /></svg>

```

### Rendering

#### Server

```jsx harmony
import { server } from '@guardian/guui';
import Application from './components/app';
 
const app = server();
 
export const render = (props) => {
    const body = app.renderToString(<Application {...props} />);
    const css = app.extractCriticalCss(body);
 
    return `
        <!DOCTYPE html>
        <html>
            <head>
                ${css}
                <script>
                    window.props = ${JSON.stringify(props)};
                </script>
            </head>
            <body>
                ${body}
            </body>
        </html>
    `.trim();
};
```

#### Browser

```jsx harmony
import { render } from '@guardian/guui';
 
const container = document.body;
 
const renderApp = () => {
    const props = window.props;

    if (container) {
        render(
            <Application {...props} />,
            container.parentElement,
            container
        );
    }
};
 
renderApp();
```
