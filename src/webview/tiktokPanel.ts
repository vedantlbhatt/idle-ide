import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class TikTokPanel {
    public static currentPanel: TikTokPanel | undefined;
    public static readonly viewType = 'idle-ide.tiktokView';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it
        if (TikTokPanel.currentPanel) {
            TikTokPanel.currentPanel._panel.reveal(column);
            return;
        }

        // Otherwise, create a new panel
        const panel = vscode.window.createWebviewPanel(
            TikTokPanel.viewType,
            'TikTok - Idle IDE',
            column || vscode.ViewColumn.Two,
            {
                enableScripts: true,
                localResourceRoots: [extensionUri],
                retainContextWhenHidden: true,
                enableFindWidget: true
            }
        );

        TikTokPanel.currentPanel = new TikTokPanel(panel, extensionUri);
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        TikTokPanel.currentPanel = new TikTokPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        // Set the webview's initial html content
        this._update();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showErrorMessage(message.text);
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public close() {
        if (this._panel) {
            this._panel.dispose();
        }
    }

    public isVisible(): boolean {
        return this._panel ? this._panel.visible : false;
    }

    public dispose() {
        TikTokPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Try to read from file first, fallback to embedded HTML
        const htmlPath = path.join(__dirname, 'tiktok.html');
        
        try {
            if (fs.existsSync(htmlPath)) {
                return fs.readFileSync(htmlPath, 'utf8');
            }
        } catch (error) {
            // Fall through to embedded HTML
        }

        // Embedded HTML as fallback
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TikTok - Idle IDE</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #000;
        }

        #tiktok-container {
            width: 100%;
            height: 100%;
            position: relative;
        }

        #tiktok-iframe {
            width: 100%;
            height: 100%;
            border: none;
            background: #000;
        }

        .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 1000;
        }

        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .error-message {
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid rgba(255, 0, 0, 0.3);
            padding: 20px;
            border-radius: 8px;
            color: #ff6b6b;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            text-align: center;
            z-index: 1001;
        }

        .error-message.show {
            display: block;
        }

        .refresh-button {
            margin-top: 10px;
            padding: 8px 16px;
            background: #ff0050;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }

        .refresh-button:hover {
            background: #ff1a66;
        }
    </style>
</head>
<body>
    <div id="tiktok-container">
        <div class="loading-overlay" id="loading-overlay">
            <div>
                <div class="loading-spinner"></div>
                <p style="margin-top: 20px; font-size: 14px;">Loading TikTok...</p>
            </div>
        </div>
        
        <div class="error-message" id="error-message">
            <p>TikTok couldn't be loaded in this context.</p>
            <p style="font-size: 12px; margin-top: 8px; opacity: 0.8;">Try opening TikTok in your browser instead.</p>
            <button class="refresh-button" onclick="loadTikTok()">Retry</button>
        </div>

        <iframe 
            id="tiktok-iframe"
            src="https://www.tiktok.com/foryou?lang=en"
            allow="autoplay; encrypted-media; fullscreen"
            allowfullscreen
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
        ></iframe>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const iframe = document.getElementById('tiktok-iframe');
        const loadingOverlay = document.getElementById('loading-overlay');
        const errorMessage = document.getElementById('error-message');

        function hideLoading() {
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
        }

        function showError() {
            if (errorMessage) {
                errorMessage.classList.add('show');
            }
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
        }

        function loadTikTok() {
            if (errorMessage) {
                errorMessage.classList.remove('show');
            }
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
            }
            
            // Try to reload the iframe
            if (iframe) {
                iframe.src = iframe.src;
            }
        }

        // Handle iframe load events
        if (iframe) {
            iframe.addEventListener('load', () => {
                // Give it a moment to render
                setTimeout(() => {
                    hideLoading();
                }, 1000);
            });

            iframe.addEventListener('error', () => {
                showError();
            });
        }

        // Fallback: hide loading after 5 seconds if still showing
        setTimeout(() => {
            if (loadingOverlay && loadingOverlay.style.display !== 'none') {
                hideLoading();
            }
        }, 5000);

        // Handle messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'dim':
                    document.body.style.opacity = '0.5';
                    break;
                case 'undim':
                    document.body.style.opacity = '1';
                    break;
            }
        });
    </script>
</body>
</html>`;
    }
}

