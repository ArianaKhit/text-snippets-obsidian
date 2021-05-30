import {
	App,
	Plugin,
	PluginSettingTab,
	Setting,
	TextAreaComponent,
	MarkdownView,
} from "obsidian";

export default class TextSnippets extends Plugin {
	settings: TextSnippetsSettings;

	onInit() {}

	async onload() {
		console.log("Loading snippets plugin");
		await this.loadSettings();

		this.addCommand({
			id: "text-snippets",
			name: "Run snippet replacement",
			callback: () => this.onTrigger("replace"),
			hotkeys: [{
				modifiers: ["Mod"],
				key: "tab"
			}],
		});

		this.addSettingTab(new TextSnippetsSettingsTab(this.app, this));
	}

	onunload() {
		console.log("Unloading text snippet plugin");
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}


	UpdateSplit(newlineSymbol: string) {
		var nlSymb = newlineSymbol;
		var nlSymb = nlSymb.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
		var rg = '(?<!' + nlSymb +')\\n';
		const regex = new RegExp(rg);
		var splited = this.settings.snippets_file.split(regex);
		splited = splited.filter(item => item);
		this.settings.snippets = splited;
	}

	getSelectedText(editor: CodeMirror.Editor) {
		if (editor.somethingSelected()) {
			return editor.getSelection();
		} else {
			var wordBoundaries = this.getWordBoundaries(editor);
			editor.getDoc().setSelection(wordBoundaries.start, wordBoundaries.end);
			return editor.getSelection();
		}
	}

	getWordBoundaries(editor: CodeMirror.Editor) {
		var cursor = editor.getCursor();
		var line = cursor.line;
		var word = editor.findWordAt({
			line: line,
			ch: cursor.ch
		});
		var wordStart = word.anchor.ch;
		var wordEnd = word.head.ch;

		return {
			start: {
				line: line,
				ch: wordStart
			},
			end: {
				line: line,
				ch: wordEnd
			},
		};
	}

	onTrigger(mode: string) {
		let activeLeaf: any = this.app.workspace.activeLeaf;
		let editor = activeLeaf.view.sourceMode.cmEditor;
		var cursorOrig = editor.getCursor();
		var selectedText = this.getSelectedText(editor);
		var cursor = editor.getCursor('from');
		var wordBoundaries = this.getWordBoundaries(editor);
		var snippets =  this.settings.snippets;
		var endSymbol = this.settings.endSymbol;
		var nlSymb = this.settings.newlineSymbol;

		var selectedWoSpaces = selectedText.split(' ').join('');

		if (selectedWoSpaces == '' && cursorOrig.ch == cursor.ch) {

			editor.execCommand('goWordLeft');
			editor.execCommand('goWordLeft');
			selectedText = this.getSelectedText(editor);
			cursor = editor.getCursor('from');
		}

		var newStr = "";

		var i;
		for (i in snippets){
			var snippet = snippets[i].split(' : ');

			if (selectedText == snippet[0]) {
				newStr = snippet[1];
			}
		}

		newStr = newStr.split('\n').join('');
		var nlinesCount = 0;
		
		var rawEnd = newStr.indexOf(endSymbol);
		if (rawEnd == -1) {
			rawEnd = newStr.length;
		}
		var lastNl = newStr.substring(0, rawEnd).lastIndexOf(nlSymb);
		if (lastNl != -1) {
			var endPosIndex = rawEnd - lastNl - nlSymb.length - cursor.ch;
			
		} else {
			var endPosIndex = rawEnd;
		}

		nlSymb = nlSymb.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');	//no special symbols in nlSymb
		var rg = nlSymb + '\\n' + '|' + nlSymb;
		const regex = new RegExp(rg);
		const regexF = new RegExp(rg, 'g');

		nlinesCount = (newStr.substring(0, rawEnd).match(regexF) || []).length;
		newStr = newStr.split(regex).join('\n');

		newStr = newStr.replace(endSymbol,'');

		if(newStr == "") {
			editor.setCursor({
				line: cursorOrig.line,
				ch: cursorOrig.ch
			});
		} else {
			editor.replaceSelection(newStr);
			editor.setCursor({
				line: cursor.line + nlinesCount,
				ch: cursor.ch + endPosIndex
			});

			editor.focus();
		}
	}

	adjustCursor(editor: CodeMirror.Editor, cursor: CodeMirror.Position, newStr: string, oldStr: string) {
		var cursorOffset = newStr.length - oldStr.length;
		this.adjustCursorOffset(editor, cursor, cursorOffset);
	}

	adjustCursorOffset(editor: CodeMirror.Editor, cursor: CodeMirror.Position, cursorOffset: any) {
		editor.setCursor({
			line: cursor.line,
			ch: cursor.ch + cursorOffset
		});
	}
}

interface TextSnippetsSettings {
	snippets_file: string;
	snippets: string[];
	endSymbol: string;
	newlineSymbol: string;
}

const DEFAULT_SETTINGS: TextSnippetsSettings = {
	snippets_file: "snippets : It is an obsidian plugin, that replaces your selected text.",
	snippets : ["snippets : It is an obsidian plugin, that replaces your selected text."],
	endSymbol: '$end$',
	newlineSymbol: '$nl$',
}

class TextSnippetsSettingsTab extends PluginSettingTab {
	plugin: TextSnippets;

	constructor(app: App, plugin: TextSnippets) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {
			containerEl
		} = this;

		containerEl.empty();
		containerEl.createEl('h2', {text: 'Text Snippets - Settings'});

		new Setting(containerEl)
		.setName("Snippets")
		.setDesc("Type here your snippets in format 'snippet : result', one per line. Empty lines will be ignored. Ctrl+Tab to replace (hotkey can be changed).")
		.setClass("text-snippets-class")
		.addTextArea((text) =>
			text
			.setPlaceholder("before : after")
			.setValue(this.plugin.settings.snippets_file)
			.onChange(async (value) => {
				this.plugin.settings.snippets_file = value;
				this.plugin.UpdateSplit(this.plugin.settings.newlineSymbol);
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl)
		.setName("Cursor end position mark")
		.setDesc("Places the cursor to the mark position after inserting a snippet (default: $end$).\nMark does not appear anywhere within the snippet.")
		.setClass("text-snippets-cursor")
		.addTextArea((text) =>
			text
			.setPlaceholder("$end$")
			.setValue(this.plugin.settings.endSymbol)
			.onChange(async (value) => {
				if (value == '') {
					value = '$end$';
				}
				this.plugin.settings.endSymbol = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl)
		.setName("Newline mark")
		.setDesc("Ignores newline after mark, replace it with a newline character after expanding (default: $nl$).\nNecessary to write before every line break in multiline snippets.")
		.setClass("text-snippets-newline")
		.addTextArea((text) =>
			text
			.setPlaceholder("$nl$")
			.setValue(this.plugin.settings.newlineSymbol)
			.onChange(async (value) => {
				if (value == '') {
					value = '$nl$';
				}
				this.plugin.settings.newlineSymbol = value;
				this.plugin.UpdateSplit(value);
				await this.plugin.saveSettings();
			})
		);
	}
}
