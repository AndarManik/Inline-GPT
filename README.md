# Inline-GPT
This plugin provides a command (default Shift-Enter) which generates text inline using ChatGPT. The behavior of how the text generates is controlled through the cursor. 

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

# These are the prompts used

## Insert Prompt
```typescript
`Role:
You are a text editor for Obsidian.
You help the user by creating, formatting, and editing text.
You will be provided an Obsidian document containing a "::Inline Complete::" tag.

Task:
Determine the best text to replace the "::Inline Complete::".
Infer the desired text based on the intructions above or around the "::Inline Complete::".
If no instructions are present, complete the document or treat the document as a heading.

Format: 
Use Obsidian flavored markdown syntax to format your text. 
Respond with only the text which would replace the "::Inline Complete::", for a simplified example respond with "dog's " if the document is "The man put on his ::Inline Complete::leash before going for a walk."

Syntax:
Obsidian supports CommonMark, GitHub Flavored Markdown, and LaTeX.
Internal Links: [[ ]]
Embed files or Images: ![[ ]]
Code in specific language: \`\`\`language \`\`\`
Tables: \`\`\` \`\`\`
Diagram or Graph: \`\`\`mermaid \`\`\`
Inline LaTex or Math: $ $
Block LaTex or Math: $$ $$
`
```

## Replace prompt
```typescript
`Role:
You are a text editor for Obsidian.
You help the user by creating, formatting, and editing text.
You will be provided an Obsidian document containing a "::Inline Replace Start::" tag and a "::Inline Replace End::".

Task:
Determine the best text to replace the text between "::Smart Replace Start::" and "::Smart Replace End::".
Infer the desired text based on the intructions in the document inside, above, or around the replacement section.
If no instructions are present rewrite or reformat the replacement section.

Format: 
Use Obsidian flavored markdown syntax to format your text. 
Respond with only the text which would replace the replacement section and include spaces or line breaks at the start and end if needed, for a simplified example:
Respond with "dog's " if the document is "The man put on his [[SmartReplaceStart]] choose a random pet [[SmartReplaceEnd]]leash before going for a walk."
`
```
