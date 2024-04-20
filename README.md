# Inline-GPT
This plugin provides a command which generates text inline using ChatGPT. The behavior of how the text generates is manipulated through the cursor. 

- **Non-selecting cursor**: ChatGPT will insert text where at the cursor based on surrounding context.
- **Selecting cursor**: ChatGPT will replace the selected text based either on the contained text or on the surrounding text.
- **Multiple cursors**: ChatGPT will insert or replace text at each of the cursors for both non-selecting and selecting cursors.


The plugin provides a choice between: **ChatGPT-3.5-Turbo** and **ChatGPT-4-Turbo**

The plugin requires an OpenAI API key

## What can it do?

It can generate text, edit text, but most importantly format text. ChatGPT can quickly generate any type of advanced markdown syntax making it useful for: tables, graphs, and diagrams.

or 

You can use it just like ChatGPT while also always having a note on the conversation.
## How to install?
You will need Node.js to install this

1. Locate you vault in your terminal or in vscode.
2. Enter into the vault and enter into the folder named .obsidian.
3. Inside .obsidian create a folder named plugins if you don't already have one.
4. Enter plugins and in your terminal run the following commands into your terminal
```shell
git clone [Paste the url from the green code button]
cd Inline-GPT
npm i
npm run dev
```
5. You can now close any terminals you have opened.
6. Open a new obsidian window.
7. In settings go to community plugins, if needed click yes to continue.
8. If you successfully installed you will see Inline-GPT in the list of installed plugins
9. Activate the plugin, and set your API key in the settings
