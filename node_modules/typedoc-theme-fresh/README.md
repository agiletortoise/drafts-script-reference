# typedoc-theme-fresh

[![Demo website](https://i.imgur.com/sRKvsaZ.png)](https://www.ekzhang.com/typedoc-theme-fresh/)

_Fresh_ is a clean and minimalist theme for [TypeDoc](https://typedoc.org/).

The default TypeDoc theme is a bit noisy visually, and the layout seems haphazard in spots. This theme is intended to help _put content first_ and adjusts:

- Color palette
- Icon set and UI coherence
- Typographic size and spacing
- Visual consistency (borders, backgrounds, underlines)

You can also use it as a base upon which to build your own themes.

## Usage

```bash
npm i -D typedoc-theme-fresh
```

Then, you can run TypeDoc with the plugin and theme:

```bash
typedoc --plugin typedoc-theme-fresh --theme fresh [etc...]
```

## Development

If you'd like to fork and make changes to the theme itself, or if you're submitting a change, just clone this repository and run:

```bash
npm install
npm run dev
```

This will listen for changes and automatically rebuild docs for the `example/` project at `http://localhost:8888/index.html`.

## License

By [Eric Zhang](https://www.ekzhang.com/), released under the [MIT license](LICENSE).
