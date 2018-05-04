import * as vscode from 'vscode';


export class Parser {

    private expression: string = "";
    private delimiter: string = "";
    private multilineComments: boolean = false;
    private config: any = vscode.workspace.getConfiguration('remove-comments').multilineComments;
    private edit: any = new vscode.WorkspaceEdit();

    public supportedLanguage = true;

    public SetRegex(languageCode: string) {

        this.setDelimiter(languageCode);

        this.expression = "(" + this.delimiter.replace(/\//ig, "\\/") + ")+( |\t)*(.*)";

    }

    public FindSingleLineComments(activeEditor: vscode.TextEditor): any {

        let text = activeEditor.document.getText();
        let uri = activeEditor.document.uri;
        let regEx = new RegExp(this.expression, "ig");
        let match: any;

        while (match = regEx.exec(text)) {

            let startPos = activeEditor.document.positionAt(match.index);
            let endPos = !startPos.character ? new vscode.Position(startPos.line + 1, 0): activeEditor.document.positionAt(match.index + match[0].length);
            let range = new vscode.Range(startPos, endPos);
            this.edit.delete(uri, range);

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

        vscode.workspace.applyEdit(this.edit);

    }

    private setDelimiter(languageCode: string): void {
        
        this.supportedLanguage = true;

        switch (languageCode) {
            case "al":
            case "c":
            case "cpp":
            case "csharp":
            case "css":
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
                this.delimiter = "//";
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
                this.delimiter = "#";
                break;

            case "ada":
            case "haskell":
            case "plsql":
            case "sql":
            case "lua":
                this.delimiter = "--";
                break;

            case "vb":
                this.delimiter = "'";
                break;

            case "erlang":
            case "latex":
                this.delimiter = "%";
                break;

            case "clojure":
            case "racket":
            case "lisp":
                this.delimiter = ";";
                break;

            case "terraform":
                this.delimiter = "#";
                this.multilineComments = this.config;
                break;

            default:
                this.supportedLanguage = false;
                break;
        }

    }

}