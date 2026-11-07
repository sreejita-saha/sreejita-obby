# Editing the visible parts of the site

Open the feature you can see first. Its component imports the exact stylesheet it uses at the top, so there is no need to guess whether it is "HUD", "world UI", or something else.

| What you see | Change wording / behaviour | Change its look |
| --- | --- | --- |
| Your avatar's floating **Talk to me** bubble | `src/components/avatar/AvatarSpeechBubble.tsx` | `src/styles/avatar/AvatarSpeechBubble.css` — named colours are at the top |
| Round profile logo and the little **Hii, how are you?** bubble | `src/components/ui/Hud.tsx` | `src/styles/ui/Hud.css` |
| Progress dots, Skip, Popups, and Portfolio button | `src/components/ui/Hud.tsx` | `src/styles/ui/Hud.css` and `GameControls.css` |
| **Ask AI** button and chat window | `src/components/ui/PortfolioChat.tsx` | `src/styles/ui/PortfolioChat.css` |
| Individual assistant message / avatar beside replies | `src/components/chat/ChatMessageRow.tsx` | `src/styles/ui/PortfolioChat.css` |
| First **Hi, I'm Sreejita!** screen | `src/components/ui/WelcomeScreen.tsx` | `src/styles/ui/WelcomeScreen.css` |
| Checkpoint pop-up cards, About Me image, and Portfolio overview | `src/components/ui/SectionCard.tsx` or `PortfolioMenu.tsx` | `src/styles/ui/PortfolioPanels.css` |
| Music, Skip/Popups, and phone controls | matching file in `src/components/ui/` | `src/styles/ui/GameControls.css` — shared because these are one controls system |
| Rating dialog | `src/components/ui/RatingWidget.tsx` | `src/styles/ui/RatingWidget.css` |
| Loading screen | `src/components/ui/LoadingScreen.tsx` | `src/styles/ui/LoadingScreen.css` |
| World checkpoint labels and speech labels | matching file in `src/components/scene/` | `src/styles/scene/WorldLabels.css` |
| Sky / canvas-wide defaults | `src/App.tsx` | `src/styles/global.css` |

## Organisation rule

For any new visible feature, create its component in `src/components/` and give it a matching stylesheet in the mirrored `src/styles/` folder. The only exception is an intentionally shared feature (for example all game controls), which gets one accurately named shared stylesheet. Import styles from every component that uses them; do not add unexplained feature styles in `App.tsx`.

`App.tsx` is now only responsible for the app-wide stylesheet and game flow. Each visible component imports its own feature styles, which makes the connection explicit when you open the component.
