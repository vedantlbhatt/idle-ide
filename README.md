# Idle IDE

**Stay engaged while you orchestrate**

A VS Code/Cursor extension that embeds TikTok directly in your IDE, so you can scroll while your AI agent works. Keep yourself off your phone and stay in the flow.

## Features

- 🎬 **TikTok Integration**: Scroll TikTok's "For You" feed directly in a side panel
- ⌨️ **Keyboard Shortcut**: Toggle the panel with `Cmd+Shift+T` (Mac) or `Ctrl+Shift+T` (Windows/Linux)
- 🎯 **Stay Focused**: Keep your attention on your computer while waiting for AI agents to complete tasks
- 🔄 **Persistent**: Panel state is retained when hidden, so you don't lose your place

## Installation

### Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Compile TypeScript:**
   ```bash
   npm run compile
   ```

3. **Open in VS Code/Cursor:**
   - Press `F5` to launch a new Extension Development Host window
   - Or use the "Run Extension" command from the command palette
   - **Note:** You don't need to open a project folder - the extension works in any VS Code/Cursor window

### Usage

Once the extension is active (in the Extension Development Host window):

1. **Open TikTok Panel:**
   - Press `Cmd+Shift+T` (Mac) or `Ctrl+Shift+T` (Windows/Linux)
   - Or use Command Palette: `Idle IDE: Open TikTok Panel`

2. **Close/Toggle:**
   - Press the same shortcut again to toggle
   - Or use Command Palette: `Idle IDE: Close TikTok Panel`

## Commands

- `Idle IDE: Open TikTok Panel` - Opens the TikTok panel
- `Idle IDE: Close TikTok Panel` - Closes the TikTok panel
- `Idle IDE: Toggle TikTok Panel` - Toggles the panel visibility

## How It Works

The extension uses VS Code's WebView API to embed TikTok's web interface directly in a side panel. The panel:
- Loads TikTok's "For You" feed
- Maintains scroll position when hidden
- Handles loading states and errors gracefully

## Notes

- TikTok may occasionally block embedding in certain contexts. If you see an error, try refreshing the panel.
- The panel works best when docked to a side panel for optimal viewing.
- Login may require opening TikTok in a full browser window.

## Development

```bash
# Watch mode for development
npm run watch

# Build for production
npm run compile
```

## License

MIT
