# TikTok Scroller

**Watch TikTok videos in VS Code sidebar while coding**

## Features

- 📱 TikTok video embeds using official TikTok Embed API
- ⌨️ Quick toggle with `Cmd+Shift+T` (Mac) or `Ctrl+Shift+T` (Windows/Linux)
- 🔄 Reload button
- 🌐 Open TikTok in browser button

## How It Works

This extension uses **TikTok's Official Embed API** (the same system used to embed TikTok videos on websites) instead of trying to iframe the entire TikTok site.

```html
<blockquote class="tiktok-embed" data-video-id="VIDEO_ID">
</blockquote>
<script src="https://www.tiktok.com/embed.js"></script>
```

## Usage

1. Press `Cmd+Shift+T` (Mac) or `Ctrl+Shift+T` (Windows/Linux)
2. Or use Command Palette: `TikTok: Open TikTok`
3. Videos will load in the sidebar
4. Scroll to see more videos

## Add Your Own Videos

1. Find a TikTok video you like
2. Copy the URL: `tiktok.com/@username/video/7298472916372018438`
3. The number at the end is the **Video ID**
4. Edit `src/extension.ts` and add to the `videos` array:

```typescript
const videos = [
    { user: 'username', id: '7298472916372018438' },
    // Add more here...
];
```

## Development

```bash
npm install
npm run compile
# Press F5 to launch Extension Development Host
```

## Note

If embeds don't load, TikTok may be blocking embedded content in the VS Code WebView context. Use the "Open TikTok" button to view in your browser instead.

## License

MIT
