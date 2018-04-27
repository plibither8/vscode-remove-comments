import * as vscode from 'vscode';
import { Parser } from './parser';

export function activate(context: vscode.ExtensionContext) {

    let activeEditor: vscode.TextEditor;
    let parser: Parser = new Parser();

    let removeComments = function () {

        if (!activeEditor) {
            return;
        }
        if (!parser.supportedLanguage) {
            return;
        }

        parser.FindSingleLineComments(activeEditor);

    }


    let removeCommentsCommand = vscode.commands.registerCommand('extension.removeComments', () => {

        if (vscode.window.activeTextEditor) {

            activeEditor = vscode.window.activeTextEditor;
            parser.SetRegex(activeEditor.document.languageId);
            removeComments();

        }

    });

    context.subscriptions.push(removeCommentsCommand);

}


export function deactivate() { }