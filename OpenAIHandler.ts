import OpenAI from "openai";

export default class OpenAIHandler {
	openai: OpenAI;
	model: string;
	gpt4Available: boolean;
	completeActive: boolean;

	constructor() {
		this.openai = new OpenAI({ apiKey: "", dangerouslyAllowBrowser: true });
		this.model = "gpt-3.5-turbo";
		this.gpt4Available = false;
		this.completeActive = false;
	}

	async setAPIKey(apiKey: string) {
		this.openai.apiKey = apiKey;
		try {
			const models = await this.openai.models.list();
			this.gpt4Available = models.data.some(
				(model) => model.id == "gpt-4-turbo"
			);
		} catch {}
	}

	setModel(model: string) {
		this.model = model;
	}

	async generateInline(prompt: string) {
		const system = `Role:
You are a text editor for Obsidian.
You help the user by creating, formatting, and editing text.
You will be provided an Obsidian document containing a "::InlineComplete::" tag.

Task:
Determine the best text to replace the "::InlineComplete::".
Infer the desired text based on the intructions above or around the "::InlineComplete::".
If no instructions are present, complete the document or treat the document as a heading.

Format: 
Use Obsidian flavored markdown syntax to format your text. 
Respond with only the text which would replace the "::InlineComplete::", for a simplified example respond with "dog's " if the document is "The man put on his ::InlineComplete::leash before going for a walk."

Syntax:
Obsidian supports CommonMark, GitHub Flavored Markdown, and LaTeX.
Internal Links: [[ ]]
Embed files or Images: ![[ ]]
Code in specific language: \`\`\`language \`\`\`
Tables: \`\`\` \`\`\`
Diagram or Graph: \`\`\`mermaid \`\`\`
Inline LaTex or Math: $ $
Block LaTex or Math: $$ $$
`;
		return await this.openai.chat.completions.create({
			messages: [
				{ role: "system", content: `${system}` },
				{ role: "user", content: `${prompt}` },
			],
			model: this.model,
			stream: true,
		});
	}

	async generateReplace(prompt: string) {
		const system = `Role:
You are a text editor for Obsidian.
You help the user by creating, formatting, and editing text.
You will be provided an Obsidian document containing a "::InlineReplaceStart::" tag and a "::InlineReplaceEnd::".

Task:
Determine the best text to replace the text between "::InlineReplaceStart::" and "::InlineReplaceEnd::".
Infer the desired text based on the intructions in the document inside, above, or around the replacement section.
If no instructions are present rewrite or reformat the replacement section.

Format: 
Use Obsidian flavored markdown syntax to format your text. 
Respond with only the text which would replace the replacement section and include spaces or line breaks at the start and end if needed, for a simplified example:
Respond with "dog's " if the document is "The man put on his ::InlineReplaceStart::choose a random pet::InlineReplaceEnd::leash before going for a walk."

Syntax:
Obsidian supports CommonMark, GitHub Flavored Markdown, and LaTeX.
Internal Links: [[ ]]
Embed files or Images: ![[ ]]
Code in specific language: \`\`\`language \`\`\`
Tables: \`\`\` \`\`\`
Diagram or Graph: \`\`\`mermaid \`\`\`
Inline LaTex or Math: $ $
Block LaTex or Math: $$ $$
`;
		return await this.openai.chat.completions.create({
			messages: [
				{ role: "system", content: `${system}` },
				{ role: "user", content: `${prompt}` },
			],
			model: this.model,
			stream: true,
		});
	}

	//This is for testing purposes, it dummies the generateInsert
	async *generateSegments(): AsyncIterableIterator<string> {
		const inputString = `Role:
        You are a text editor in Obsidian markdown.
        You help the user by creating, formatting, and editing text.
        You will be provided a document containing a "::Inline Complete::" tag.`;
		let currentIndex = 0;
		while (currentIndex < inputString.length) {
			const segmentLength = Math.floor(Math.random() * 6) + 5; // Generates a random number between 5 and 10
			const segment = inputString.substring(
				currentIndex,
				currentIndex + segmentLength
			);
			yield await new Promise((resolve) =>
				setTimeout(() => resolve(segment), 50)
			);
			currentIndex += segmentLength;
		}

		const segment = inputString.substring(currentIndex);
		yield await new Promise((resolve) =>
			setTimeout(() => resolve(segment), 50)
		);
	}
}
