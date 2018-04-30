import * as vscode from 'vscode';


export class Parser {

    private expression: string = "";
    private delimiter: string = "";
    private multilineComments: boolean = false;
    private config: any = vscode.workspace.getConfiguration('remove-comments').multilineComments;

    public supportedLanguage = true;

    public SetRegex(languageCode: string) {

        this.setDelimiter(languageCode);

        this.expression = "(" + this.delimiter.replace(/\//ig, "\\/") + ")+( |\t)*";
        this.expression += "(";
        this.expression += ")+(.*)";

    }

    public FindSingleLineComments(activeEditor: vscode.TextEditor): any {

        let text = activeEditor.document.getText();
        let uri = activeEditor.document.uri;
        let regEx = new RegExp(this.expression, "ig");
        let match: any;
        let edit = new vscode.WorkspaceEdit();

        while (match = regEx.exec(text)) {

            let startPos = activeEditor.document.positionAt(match.index);
            let endPos = !startPos.character ? new vscode.Position(startPos.line + 1, 0): activeEditor.document.positionAt(match.index + match[0].length);
            let range = new vscode.Range(startPos, endPos);
            edit.delete(uri, range);

        }

        vscode.workspace.applyEdit(edit);

    }

    public FindMultilineComments(activeEditor: vscode.TextEditor, findJSDoc: boolean = false): void {

        // If highlight multiline is off in package.json or doesn't apply to his language, return
        if (!this.multilineComments) {
            return;
        }

        let text = activeEditor.document.getText();

        // Combine custom delimiters and the rest of the comment block matcher
        let commentMatchString: string = "";
        let regEx: RegExp;

        if (findJSDoc) {
            commentMatchString = "(^)+([ \\t]*\\*[ \\t]*)("; // Highlight after leading *
            regEx = /(^|[ \t])(\/\*\*)+([\s\S]*?)(\*\/)/gm; // Find rows of comments matching pattern /** */		
        } else {
            commentMatchString = "(^)+([ \\t]*[ \\t]*)("; // Don't expect the leading *
            regEx = /(^|[ \t])(\/\*[^*])+([\s\S]*?)(\*\/)/gm; // Find rows of comments matching pattern /* */
        }

        commentMatchString += ")([ ]*|[:])+([^*/][^\\r\\n]*)";

        let commentRegEx = new RegExp(commentMatchString, "igm");

        // Find the multiline comment block
        let match: any;
        while (match = regEx.exec(text)) {
            let commentBlock = match[0];

            // Find the line
            let line;
            while (line = commentRegEx.exec(commentBlock)) {
                let startPos = activeEditor.document.positionAt(match.index + line.index + line[2].length);
                let endPos = activeEditor.document.positionAt(match.index + line.index + line[0].length);
                let range: vscode.DecorationOptions = { range: new vscode.Range(startPos, endPos) };
            }
        }
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