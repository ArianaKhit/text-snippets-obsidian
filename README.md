# Obsidian Text Snippets Plugin

This is a plugin for Obsidian (https://obsidian.md).

It allows you to replace text templates for faster typing, create your own snippets almost like in many text editors and IDE. 

**Live Preview support**: ```check the toggle in plugin settings before using and restart plugin in Options > Community plugins```.

You can use the shortcut (default `CTRL/CMD + Tab`) or the command `Run snippet replacement` by command palette (`CTRL/CMD + P`). There is also an option to use `Tab` and/or `Space` as the shortcut instead. The cursor need to be on the word you want to replace. You can replace text with spaces by selecting all the text.

## Demo

![demo](https://raw.githubusercontent.com/ArianaKhit/text-snippets-obsidian/main/demo.gif)

## Features
- Use ```$end$``` to place the cursor after replacement in specific position
- Use ```$nl$``` to add line break in multiline snippet
- ```$nl$``` ignores next line break in _Snippets_ settings, if the snippet ends with ```$end$```, add additional newline
- Use ```$tb$``` to add a tabstop for the cursor to jump to (don`t use together with ```$end$```)
- Trigger the snippet shortcut without any eligible expansion to jump to the next tabstop
- When enabling `Tab` as the shortcut, only if there are no eligilbe expansions nor jumps the, a normal `Tab` will be inserted
- Use Regex to match the snippet

![tabstop-demo](https://raw.githubusercontent.com/Arax20/text-snippets-obsidian/main/tabstop_demo.gif)

## How to install

### In Obsidian app

In Obsidian go to `Settings > Third-party plugins > Community Plugins > Browse` and search for `Text Snippets`.

### Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/text-snippets-obsidian/`.

