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
      name: "Parse snippet",
      callback: () => this.onTrigger("replace"),
      hotkeys: [{
        modifiers: ["Mod"],
        key: "tab"
      }],
    });

    this.addSettingTab(new TextSnippetsSettingsTab(this.app, this));

  }

  onunload() {
    console.log("Unloading snippet parser plugin");
  }

  async loadSettings() {
    this.settings = Object.assign(DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }

  getSelectedText(editor: any) {
    if (editor.somethingSelected()) {
      return editor.getSelection();
    } else {
      var wordBoundaries = this.getWordBoundaries(editor);
      editor.getDoc().setSelection(wordBoundaries.start, wordBoundaries.end);
      return editor.getSelection();
    }
  }

  getWordBoundaries(editor: any) {
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
    var cursor = editor.getCursor();
    var selectedText = this.getSelectedText(editor);

    var newStr = "";

    var snippets =  this.settings.snippets;

    var i;
    for (i in snippets){
        var snippet = snippets[i].split(' : ');

        if (selectedText == snippet[0]) {
            newStr = snippet[1];
        }
    }

    if(newStr == "") {
        editor.setCursor({
            line: cursor.line,
            ch: cursor.ch
        });
    } else {
        editor.replaceSelection(newStr);
        this.adjustCursor(editor, cursor, newStr, selectedText);
        editor.focus();
    }
  }

  adjustCursor(editor: any, cursor: any, newStr: string, oldStr: string) {
    var cursorOffset = newStr.length - oldStr.length;
    editor.setCursor({
      line: cursor.line,
      ch: cursor.ch + cursorOffset
    });
  }

  adjustCursorOffset(editor: any, cursor: any, cursorOffset: any) {
    editor.setCursor({
      line: cursor.line,
      ch: cursor.ch + cursorOffset
    });
  }
  

}

interface TextSnippetsSettings {
  snippets_file: string;
  snippets: string[];
}

const DEFAULT_SETTINGS: TextSnippetsSettings = {
  snippets_file: "snippets : It is an obsidian plugin, that replaces your selected text.",
  snippets : ["snippets : It is an obsidian plugin, that replaces your selected text."],
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
          var splited = value.split("\n");
	      splited = splited.filter(item => item);
	      this.plugin.settings.snippets = splited;
          await this.plugin.saveSettings();
        })
      );

  }
}
