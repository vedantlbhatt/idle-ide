import * as vscode from 'vscode';

let panel: vscode.WebviewPanel | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('tiktok.open', () => {
            if (panel) {
                panel.reveal(vscode.ViewColumn.Beside);
                return;
            }

            panel = vscode.window.createWebviewPanel(
                'tiktokEmbed',
                '📱 TikTok Videos',
                vscode.ViewColumn.Beside,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );

            panel.webview.html = getWebviewContent();

            panel.onDidDispose(() => {
                panel = undefined;
            });

            panel.webview.onDidReceiveMessage(
                message => {
                    switch (message.command) {
                        case 'openBrowser':
                            vscode.env.openExternal(vscode.Uri.parse(message.url));
                            break;
                    }
                },
                undefined,
                context.subscriptions
            );

            vscode.window.showInformationMessage('TikTok Videos opened! Cmd+Shift+T to toggle.');
        })
    );
}

function getWebviewContent(): string {
    // Popular coding TikTok videos - these are real video IDs
    // Users can replace these with their own favorite videos
    const videos = [
        { user: 'tiktok', id: '7580764160359697678' },
    ];

    const embedsHtml = videos.map(v => `
        <div class="video-container">
            <blockquote class="tiktok-embed" 
                cite="https://www.tiktok.com/@${v.user}/video/${v.id}" 
                data-video-id="${v.id}"
                style="max-width: 605px; min-width: 325px;">
                <section>
                    <a target="_blank" href="https://www.tiktok.com/@${v.user}">@${v.user}</a>
                </section>
            </blockquote>
        </div>
    `).join('\n');

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body, html {
            height: 100%;
            background: #000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: #fff;
            overflow-x: hidden;
        }
        
        #header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 50px;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(20px);
            display: flex;
            align-items: center;
            padding: 0 16px;
            z-index: 9999;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        #title {
            font-size: 16px;
            font-weight: 600;
            margin-right: auto;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        #controls {
            display: flex;
            gap: 8px;
        }
        
        #controls button {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: #fff;
            padding: 8px 14px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s;
        }
        
        #controls button:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.02);
        }
        
        #controls button.primary {
            background: #fe2c55;
        }
        
        #controls button.primary:hover {
            background: #ff4d6d;
        }
        
        #content {
            padding-top: 60px;
            padding-bottom: 20px;
            min-height: 100vh;
        }
        
        .video-container {
            display: flex;
            justify-content: center;
            margin: 20px 0;
            padding: 0 10px;
        }
        
        .tiktok-embed {
            margin: 0 auto !important;
        }
        
        #loading {
            text-align: center;
            padding: 40px;
            color: #888;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.2);
            border-top-color: #fe2c55;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        #info {
            text-align: center;
            padding: 20px;
            background: rgba(30, 30, 30, 0.8);
            border-radius: 12px;
            margin: 20px;
            font-size: 14px;
            color: #aaa;
            line-height: 1.6;
        }
        
        #info a {
            color: #fe2c55;
            text-decoration: none;
        }
        
        #info a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div id="header">
        <div id="title">
            <span style="font-size: 20px;">📱</span>
            TikTok Videos
        </div>
        <div id="controls">
            <button onclick="location.reload()">🔄 Reload</button>
            <button class="primary" onclick="openTikTok()">Open TikTok</button>
        </div>
    </div>
    
    <div id="content">
        <div id="loading">
            <div class="spinner"></div>
            <p>Loading TikTok embeds...</p>
        </div>
        
        <div id="info">
            <p><strong>💡 How to add your own videos:</strong></p>
            <p>1. Find a TikTok video you like</p>
            <p>2. Copy the URL: tiktok.com/@user/video/<strong>VIDEO_ID</strong></p>
            <p>3. Edit the extension source to add video IDs</p>
            <p><a href="#" onclick="openTikTok(); return false;">Browse TikTok →</a></p>
        </div>
        
        ${embedsHtml}
    </div>
    
    <script async src="https://www.tiktok.com/embed.js"></script>
    
    <script>
        const vscode = acquireVsCodeApi();
        
        function openTikTok() {
            vscode.postMessage({
                command: 'openBrowser',
                url: 'https://www.tiktok.com/foryou'
            });
        }
        
        // Hide loading spinner once embeds start loading
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loading = document.getElementById('loading');
                if (loading) {
                    loading.style.display = 'none';
                }
            }, 3000);
        });
        
        // Check if embeds loaded
        setTimeout(() => {
            const embeds = document.querySelectorAll('.tiktok-embed');
            let anyLoaded = false;
            embeds.forEach(embed => {
                if (embed.querySelector('iframe')) {
                    anyLoaded = true;
                }
            });
            
            if (!anyLoaded) {
                document.getElementById('loading').innerHTML = \`
                    <p style="color: #fe2c55;">⚠️ Embeds may take a moment to load</p>
                    <p style="margin-top: 10px; font-size: 13px;">If videos don't appear, TikTok may be blocking embeds in this context.</p>
                    <button onclick="openTikTok()" style="margin-top: 15px; background: #fe2c55; border: none; color: white; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px;">
                        Open TikTok in Browser
                    </button>
                \`;
            } else {
                document.getElementById('loading').style.display = 'none';
            }
        }, 5000);
    </script>
</body>
</html>`;
}

export function deactivate() {
    if (panel) {
        panel.dispose();
    }
}
