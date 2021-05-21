# Obsidian Text Snippets Plugin

This is a plugin for Obsidian (https://obsidian.md).

It allows you to replace text templates for faster typing, create your own snippets almost like in many text editors and IDE. 

You can use the shortcut (default `CTRL/CMD + Tab`) or the command `Run snippet replacement` by command palette (`CTRL/CMD + P`). The cursor need to be on the word you want to replace. You can replace text with spaces by selecting all the text.

## Demo

![demo](https://raw.githubusercontent.com/ArianaKhit/text-snippets-obsidian/main/demo.gif)

## Features

- Use ```$end$``` to place the cursor after replacement in specific position
- Use ```$nl$``` to add line break in multiline snippet

## How to install

### In Obsidian app

In Obsidian go to `Settings > Third-party plugins > Community Plugins > Browse` and search for `Text Snippets`.

### Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/text-snippets-obsidian/`.

