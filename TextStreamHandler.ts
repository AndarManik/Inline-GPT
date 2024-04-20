import { MarkdownView, Editor } from "obsidian";
import OpenAIHandler from "OpenAIHandler";
export default class TextStreamHandler {
	inlineOffsets: [number, Editor][];
	openAIHandler: OpenAIHandler;
	constructor(openAIHandler: OpenAIHandler) {
		this.inlineOffsets = new Array<[number, Editor]>();
		this.openAIHandler = openAIHandler;
	}

	handleInlineUpdate(start: number, end: number, editor: Editor) {
		this.inlineOffsets.forEach((inlineOffset) => {
			if (inlineOffset[1] == editor && inlineOffset[0] >= start) {
				const shift = end - start;
				inlineOffset[0] += shift;
			}
		});
	}

	async inlineGPT(editor: Editor) {
		const selections = editor.listSelections().map((value) => {
			const anchorOffSet = editor.posToOffset(value.anchor);
			const headOffSet = editor.posToOffset(value.head);

			if (anchorOffSet < headOffSet) {
				return [anchorOffSet, headOffSet];
			} else {
				return [headOffSet, anchorOffSet];
			}
		});

		const prompts = selections.map((selection) => {
			return this.buildPrompt(selection, editor);
		});

		editor.replaceSelection("");

		const offsets = editor.listSelections().map((value) => {
			const offset: number = editor.posToOffset(value.anchor);
			const offsetPair: [number, Editor] = [offset, editor];
			this.inlineOffsets.push(offsetPair);
			return offsetPair;
		});

		offsets.forEach((offset, index) => {
			if (selections[index][0] == selections[index][1]) {
				this.streamText(offset, prompts[index], "insert");
			} else {
				this.streamText(offset, prompts[index], "replace");
			}
		});
	}

	buildPrompt(selection: number[], editor: Editor) {
		const text = editor.getValue();
		if (selection[0] == selection[1]) {
			return (
				text.substring(0, selection[0]) +
				"::Inline Complete::" +
				text.substring(selection[0])
			);
		} else {
			return (
				text.substring(0, selection[0]) +
				"::Inline Replace Start::" +
				text.substring(selection[0], selection[1]) +
				"::Inline Replace End::" +
				text.substring(selection[1])
			);
		}
	}

	async streamText(
		offset: [number, Editor],
		prompt: string,
		outputType: string
	) {
		const editor = offset[1];
		const outputStream =
			outputType == "insert"
				? await this.openAIHandler.generateInline(prompt)
				: await this.openAIHandler.generateReplace(prompt);

		let prevChunk = null; //This is a trick to process everything but the last
		for await (const chunk of outputStream) {
			if (prevChunk !== null) {
				const textToInsert = prevChunk.choices[0].delta.content;

				if (textToInsert) {
					const previous = editor.getCursor();
					const previousOffset = editor.posToOffset(previous);
					const positionToInsert = editor.offsetToPos(offset[0]);

					editor.setCursor(positionToInsert);
					editor.replaceSelection(textToInsert);

					const newOffset = editor.posToOffset(editor.getCursor());

					if (previousOffset > offset[0]) {
						const newPosition = editor.offsetToPos(
							previousOffset + newOffset - offset[0]
						);
						editor.setCursor(newPosition);
					} else {
						editor.setCursor(previous);
					}

					this.handleInlineUpdate(offset[0], newOffset, editor);
				}
			}
			prevChunk = chunk;
		}
		this.inlineOffsets.remove(offset);
	}
}
