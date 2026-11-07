# Sreejita's Obby

## Quick visual edits

- **Bubble above the in-world avatar:** change the five named colour values at the top of [AvatarSpeechBubble.css](src/styles/avatar/AvatarSpeechBubble.css). That is the only file for this bubble.
- **Anything else visual:** start with [UI_EDITING_MAP.md](UI_EDITING_MAP.md). It maps every on-screen feature to its exact code and stylesheet.

# React + TypeScript + Vite

## Compressing 3D models

Run the batch script from the project root:

```powershell
python scripts/compress_glb.py
```

It finds every `.glb` under `public/models` and replaces each with its
Meshopt-compressed version. A temporary file is used, so a model is replaced
only after compression succeeds. The first run downloads the free, open-source
`@gltf-transform/cli` package through `npx`; later runs reuse its npm cache.

```powershell
python scripts/compress_glb.py
```

To write compressed copies somewhere else instead, use `--output`:

```powershell
python scripts/compress_glb.py --output public/models-compressed
```

## Compressing images

This conservatively recompresses PNGs in place without changing any pixels,
dimensions, or transparency. Install its free dependency once, then run it:

```powershell
python -m pip install Pillow
python scripts/compress_images.py
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Keep the Supabase project active on Vercel

This project includes a daily Vercel Cron Job at `/api/keep-supabase-awake`.
It makes one small authenticated database query, preventing a low-traffic
Supabase Free project from being paused for inactivity.

In **Vercel → Project → Settings → Environment Variables**, add these values
for the Production environment:

| Variable              | Value                                                                |
| --------------------- | -------------------------------------------------------------------- |
| `CRON_SECRET`         | A newly generated random string (at least 16 characters)             |
| `SUPABASE_URL`        | Your project URL, e.g. `https://abc123.supabase.co`                  |
| `SUPABASE_SECRET_KEY` | The server-only Secret key from Supabase Project Settings → API Keys |

Never add `SUPABASE_SECRET_KEY` to a `VITE_` variable or commit it to the
repository. Deploying to production creates the cron job; confirm its daily
runs under **Vercel → Project → Settings → Cron Jobs**.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
