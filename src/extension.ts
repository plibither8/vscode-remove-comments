import * as vscode from 'vscode';
import { Parser } from './parser';

export function activate(context: vscode.ExtensionContext) {

    let activeEditor: vscode.TextEditor;
    let parser: Parser = new Parser();

    let removeComments = function (n: number) {

        if (!activeEditor || !parser.supportedLanguage) {
            return;
        }

        if (n === 0) {
            parser.FindSingleLineComments(activeEditor);
        }
        else if (n === 1) {
            parser.FindMultilineComments(activeEditor);
        } else {
            parser.FindSingleLineComments(activeEditor);
            parser.FindMultilineComments(activeEditor);
        }

        vscode.workspace.applyEdit(parser.edit);

    };


    let removeAllCommentsCommand = vscode.commands.registerCommand('extension.removeAllComments', () => {

        if (vscode.window.activeTextEditor) {

            activeEditor = vscode.window.activeTextEditor;
            parser.SetRegex(activeEditor.document.languageId);
            removeComments(2);

        }

    });

    context.subscriptions.push(removeAllCommentsCommand);

    let removeSingleLineCommentsCommand = vscode.commands.registerCommand('extension.removeSingleLineComments', () => {

        if (vscode.window.activeTextEditor) {

            activeEditor = vscode.window.activeTextEditor;
            parser.SetRegex(activeEditor.document.languageId);
            removeComments(0);

        }

    });

    context.subscriptions.push(removeSingleLineCommentsCommand);

    let removeMultilineCommentsCommand = vscode.commands.registerCommand('extension.removeMultilineComments', () => {

        if (vscode.window.activeTextEditor) {

            activeEditor = vscode.window.activeTextEditor;
            parser.SetRegex(activeEditor.document.languageId);
            removeComments(1);

        }

    });

    context.subscriptions.push(removeMultilineCommentsCommand);

}


export function deactivate() { }