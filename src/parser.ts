import * as vscode from 'vscode';


export class Parser {

    private delimiters: string[] = [];
    private removeRanges: boolean[] = [];
    private multilineComments: boolean = false;
    private config: any = vscode.workspace.getConfiguration('remove-comments').multilineComments;

    public edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    public uri: any;
    public supportedLanguage = true;

    public SetRegex(activeEditor: vscode.TextEditor, languageCode: string) {

        if (this.setDelimiter(languageCode)) {
            this.edit = new vscode.WorkspaceEdit();
            this.uri = activeEditor.document.uri;
        } else {
            vscode.window.showInformationMessage("Cannot remove comments : unknown language (" + languageCode + ")");
        }
    }

    public FindSingleLineComments(activeEditor: vscode.TextEditor): any {
        for (var l = 0; l < activeEditor.document.lineCount; l++) {
            let line = activeEditor.document.lineAt(l);
            let matched = false;
            for (var i = 0; i < this.delimiters.length; i++) {
                if (!matched) {
                    let expression = this.delimiters[i].replace(/\//ig, "\\/");
                    let removeRange = this.removeRanges[i];
                    let regEx = new RegExp(expression, "ig");
                    let match = regEx.exec(line.text);
                    if (match) {
                        if (removeRange) {
                            let startPos = new vscode.Position(l, match.index);
                            let endPos = new vscode.Position(l, line.text.length);
                            let range = new vscode.Range(startPos, endPos);
                            this.edit.delete(this.uri, range);
                            let n = activeEditor.document.getText(range);
                            console.log("Removing : " + n);
                        } else {
                            let startPos = new vscode.Position(l, match.index);
                            let endPos = new vscode.Position(l + 1, 0);
                            let range = new vscode.Range(startPos, endPos);
                            this.edit.delete(this.uri, range);
                        }
                        
                        matched = true;
                    }
                }
            }
        }
    }

    public FindMultilineComments(activeEditor: vscode.TextEditor): void {

        if (!this.multilineComments) {
            return;
        }

        let text = activeEditor.document.getText();
        let uri = activeEditor.document.uri;
        let regEx: RegExp = /(^|[ \t])(\/\*[^*])+([\s\S]*?)(\*\/)/gm;
        let match: any;

        while (match = regEx.exec(text)) {

            let startPos = activeEditor.document.positionAt(match.index);
            let endPos = activeEditor.document.positionAt(match.index + match[0].length);
            let range = new vscode.Range(startPos, endPos);
            this.edit.delete(uri, range);

        }

    }

    private setDelimiter(languageCode: string): boolean {

        this.supportedLanguage = true;
        this.delimiters = [];
        this.removeRanges = [];

        switch (languageCode) {
            case "al":
            case "c":
            case "cpp":
            case "csharp":
            case "css":
            case "dart":
            case "fsharp":
            case "go":
            case "haxe":
            case "java":
            case "javascript":
            case "javascriptreact":
            case "jsonc":
            case "kotlin":
            case "less":
            case "pascal":
            case "objectpascal":
            case "php":
            case "rust":
            case "scala":
            case "swift":
            case "typescript":
            case "typescriptreact":
                this.delimiters.push("//");
                this.removeRanges.push(true);
                this.multilineComments = this.config;
                break;

            case "coffeescript":
            case "dockerfile":
            case "elixir":
            case "graphql":
            case "julia":
            case "makefile":
            case "perl":
            case "perl6":
            case "powershell":
            case "python":
            case "r":
            case "ruby":
            case "shellscript":
            case "yaml":
                this.delimiters.push("#");
                this.removeRanges.push(true);
                break;

            case "ada":
            case "haskell":
            case "plsql":
            case "sql":
            case "lua":
                this.delimiters.push("--");
                this.removeRanges.push(true);
                break;

            case "vb":
                this.delimiters.push("'");
                this.removeRanges.push(true);
                break;

            case "erlang":
            case "latex":
                this.delimiters.push("%");
                this.removeRanges.push(true);
                break;

            case "clojure":
            case "racket":
            case "lisp":
                this.delimiters.push(";");
                this.removeRanges.push(true);
                break;

            case "terraform":
                this.delimiters.push("#");
                this.removeRanges.push(true);
                this.multilineComments = this.config;
                break;

            case "ACUCOBOL":
            case "OpenCOBOL":
            case "COBOL":
                this.delimiters.push("\\*>");
                this.removeRanges.push(true);
                this.delimiters.push("^......\\*");
                this.removeRanges.push(false);
                this.multilineComments = false;
                break;
            default:
                this.supportedLanguage = false;
                break;
        }

        return this.supportedLanguage;
    }

}
