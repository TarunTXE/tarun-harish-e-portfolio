# TXE Portfolio — UI Sound Assets

This directory provides optional drop-in file overrides for the TXE Portfolio UI sound engine.

The website includes a high-fidelity Web Audio API procedural sound synthesizer by default (requiring 0 external downloads). If custom audio files are dropped here, the system will automatically prefer and play these files with seamless fallback.

## Supported Sound Files:

| File Name | Trigger Event | Recommended Duration |
| :--- | :--- | :--- |
| `tab.mp3` | Navigation tabs (ABOUT, STACK, PROJECTS, etc.) | ~90–140ms crisp tick/blip |
| `toggle-light.mp3` | Theme switch: Dark → Light (Illumination sweep) | ~180–240ms mechanical sweep |
| `toggle-dark.mp3` | Theme switch: Light → Dark (Night ops sweep) | ~180–240ms descending sweep |
| `play.mp3` | Music playback start / resume | ~100–150ms 2-note activation |
| `pause.mp3` | Music playback paused | ~120–160ms descending shutdown |
| `confirm.mp3` | Main CTAs (Explore Projects, Github, Resume) | ~40–70ms confirmation click |

*Note: All audio paths are handled programmatically and never exposed as visible DOM hyperlinks.*
