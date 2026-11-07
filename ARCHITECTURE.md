# Project structure

The code is organised by what it owns, not by random technical labels.

```text
src/
  components/
    avatar/       # Sreejita's 3D model and her in-world bubble
    chat/         # Ask AI panel, messages, composer, chat helpers
    scene/        # 3D obby world: player, platforms, decorations, checkpoints
    portfolio/    # Checkpoint information cards and portfolio overview
    screens/      # Loading and start screens
    feedback/     # Rating form
    ui/           # Shared controls: HUD, music, touch controls, tooltips
    maintenance/  # Optional maintenance page
  data/           # Portfolio text and world/checkpoint data — edit content here
  styles/
    avatar/ chat/ scene/ portfolio/ screens/ feedback/ ui/ maintenance/
                  # Mirrors the component folders; each CSS file matches a feature
    global.css    # Page-level defaults only
    ui-primitives.css # Shared panel, button, and tooltip foundations only
  config/         # App-wide events and constants
  types/          # Shared TypeScript shapes
  App.tsx         # Wires the game together; should not contain feature UI
```

## Where to make changes

- **Change text, images, links, checkpoint colours:** `src/data/portfolio.ts` and `src/data/checkpoints/`.
- **Change how a feature behaves:** open its matching file under `src/components/`.
- **Change how it looks:** open the matching folder and filename under `src/styles/`.
- **Change the avatar model or avatar bubble:** start in `src/components/avatar/`.

## Rules for future changes

1. Add a feature to the folder that owns it; do not put feature logic directly in `App.tsx`.
2. Give visible components a matching stylesheet in the mirrored `styles` folder.
3. Only use `global.css` for true page defaults and `ui-primitives.css` for reusable foundations.
4. Delete unused components rather than leaving obsolete versions behind.
