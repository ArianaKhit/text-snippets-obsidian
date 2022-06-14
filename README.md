# Obsidian Text Snippets Plugin

This is a plugin for Obsidian (https://obsidian.md).

It allows you to replace text templates for faster typing, create your own snippets almost like in many text editors and IDE.

**Live Preview support**: ```check the toggle in plugin settings before using and restart plugin in Options > Community plugins```.

You can use the shortcut (default `CTRL/CMD + Tab`) or the command `Run snippet replacement` by command palette (`CTRL/CMD + P`). There is also an option to use `Tab` and/or `Space` as the shortcut instead. The cursor need to be on the word you want to replace. You can replace text with spaces by selecting all the text.

# Obsidian Text Snippets Plugin

This is a plugin for Obsidian (https://obsidian.md).

It allows you to replace text templates for faster typing, create your own snippets almost like in many text editors and IDE.

# Demo

![demo](https://raw.githubusercontent.com/ArianaKhit/text-snippets-obsidian/main/demo.gif)


# Features


## Live Preview support
Check the toggle in plugin settings before using and restart plugin in `Options > Community plugins`.
## Replacement can be done a few different ways
You can use the shortcut (default `CTRL/CMD + Tab`) or the command `Run snippet replacement` by command palette (`CTRL/CMD + P`). There is also an option to use `Tab` and/or `Space` as the shortcut instead. The cursor need to be on the word you want to replace. You can replace text with spaces by selecting all the text.


## Multiline Snippets
Multiline snippets can be defined 2 ways:

### Creating files in a folder
First, you assign a folder for your multiline snippets in the plugin settings.
Then you create files in that folder. The name of the file becomes the snippet "alias", and the contents of the file become the text the alias will be replaced with.
Supported syntax : `$tb$`. Adding this will move the cursor to this location after replacement.
You do not need `$end$, $nl$` here.

#### Example
having a file named `Anki` in your watched folder with these contents
```
---
Q:  $tb$
A→


---
```
will substitute `Anki ` with
```
---
Q:
A→


---
```
with the cursor placed at the location of `$tb$`

### In the snippet Textbox in settings
Add yourmultiline snippet to the textbox in settings.


* Use `$end$` to place the cursor after replacement in specific position
* Use `$nl$` to add line break in multiline snippet
* `$nl$` ignores next line break in Snippets settings, if the snippet ends with $end$, add additional newline
* Use `$tb$` to add a tabstop for the cursor to jump to (don`t use together with $end$)
* Trigger the snippet shortcut without any eligible expansion to jump to the next tabstop
* When enabling Tab as the shortcut, only if there are no eligilbe expansions nor jumps the, a normal Tab will be inserted

#### Example
```
Anki : ---$nl$
Q:  $tb$ $nl$
A→ $nl$
$nl$
---$nl$
```
will substitute `Anki ` with
```
---
Q:
A→


---
```
with the cursor placed at the location of `$tb$`


# How to install

git clone this and throw the contents in the plugins folder of your vault.


### Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/text-snippets-obsidian/`.

