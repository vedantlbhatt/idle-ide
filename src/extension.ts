import * as vscode from 'vscode';
import { TikTokPanel } from './webview/tiktokPanel';

export function activate(context: vscode.ExtensionContext) {
    console.log('Idle IDE extension is now active!');

    // Register commands
    const openCommand = vscode.commands.registerCommand('idle-ide.openTikTok', () => {
        console.log('Opening TikTok panel...');
        try {
            TikTokPanel.createOrShow(context.extensionUri);
        } catch (error) {
            console.error('Error opening TikTok panel:', error);
            vscode.window.showErrorMessage(`Failed to open TikTok panel: ${error}`);
        }
    });

    const closeCommand = vscode.commands.registerCommand('idle-ide.closeTikTok', () => {
        console.log('Closing TikTok panel...');
        if (TikTokPanel.currentPanel) {
            TikTokPanel.currentPanel.close();
        }
    });

    const toggleCommand = vscode.commands.registerCommand('idle-ide.toggleTikTok', () => {
        console.log('Toggling TikTok panel...');
        try {
            if (TikTokPanel.currentPanel && TikTokPanel.currentPanel.isVisible()) {
                TikTokPanel.currentPanel.close();
            } else {
                TikTokPanel.createOrShow(context.extensionUri);
            }
        } catch (error) {
            console.error('Error toggling TikTok panel:', error);
            vscode.window.showErrorMessage(`Failed to toggle TikTok panel: ${error}`);
        }
    });

    context.subscriptions.push(openCommand, closeCommand, toggleCommand);
    
    console.log('Idle IDE commands registered successfully');
}

export function deactivate() {}

