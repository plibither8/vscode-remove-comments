import * as vscode from 'vscode';
import { Parser } from './parser';

export function activate(context: vscode.ExtensionContext) {

    let activeEditor: vscode.TextEditor;
    let parser: Parser = new Parser();

    let removeComments = function () {

        if (!activeEditor || !parser.supportedLanguage) {
            return;
        }

        parser.FindSingleLineComments(activeEditor);
        parser.FindMultilineComments(activeEditor);

        vscode.workspace.applyEdit(parser.edit);

    };


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