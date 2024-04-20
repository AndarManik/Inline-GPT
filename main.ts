import {
	App,
	Editor,
	MarkdownView,
	Plugin,
	PluginSettingTab,
	Setting,
	TextComponent,
} from "obsidian";
import { EditorState } from "@codemirror/state";
import OpenAIHandler from "OpenAIHandler";
import TextStreamHandler from "TextStreamHandler";

interface InlineGPTSettings {
	chatGPTKey: string;
	model: string;
}

const DEFAULT_SETTINGS: InlineGPTSettings = {
	chatGPTKey: "",
	model: "gpt-3.5-turbo",
};

export default class InlineGPT extends Plugin {
	settings: InlineGPTSettings;
	openAIHandler: OpenAIHandler;
	textStreamHandler: TextStreamHandler;

	async onload() {
		await this.loadSettings();
		this.openAIHandler = new OpenAIHandler();
		let isValid = false;
		if (this.settings.chatGPTKey) {
			isValid = await this.openAIHandler.setAPIKey(this.settings.chatGPTKey);
			this.openAIHandler.setModel(this.settings.model);
		}

		this.textStreamHandler = new TextStreamHandler(this.openAIHandler);

		this.registerEditorExtension([
			EditorState.transactionFilter.of((tr) => {
				if (
					tr.isUserEvent("input") ||
					tr.isUserEvent("delete") ||
					tr.isUserEvent("move")
				) {
					const view =
						this.app.workspace.getActiveViewOfType(MarkdownView);
					if (view) {
						this.textStreamHandler.inlineOffsets.forEach((inlineOffset) => {
							if (inlineOffset[1] == view.editor) {
								inlineOffset[0] = tr.changes.mapPos(
									inlineOffset[0]
								);
							}
						});
					}
				}
				return tr;
			}),
		]);
		/*
		this.addCommand({
			id: "test-gpt",
			name: "Test command for GPT",
			hotkeys: [{ modifiers: ["Ctrl", "Shift"], key: "Enter" }],
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				console.log(editor.listSelections());
			},
		});
		*/

		this.addCommand({
			id: "inline-gpt",
			name: "Trigger inline GPT",
			hotkeys: [{ modifiers: ["Shift"], key: "Enter" }],
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.textStreamHandler.inlineGPT(editor);
			},
		});

		this.addSettingTab(new InlineGPTSettingTab(this.app, this, isValid));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class InlineGPTSettingTab extends PluginSettingTab {
	plugin: InlineGPT;
	isValid: boolean;

	constructor(app: App, plugin: InlineGPT, isValid: boolean) {
		super(app, plugin);
		this.plugin = plugin;
		this.isValid = isValid;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		var apiKeyText: TextComponent;

		new Setting(containerEl)
			.setName("OpenAI API Key")
			.setDesc("Enter your OpenAI API Key.")
			.addText((text) =>
				apiKeyText = text
					.setPlaceholder("Enter API Key")
					.setValue((this.plugin.settings.chatGPTKey) ? ((this.isValid) ? "Your API key is active" : "Error or invalid try again") : "")
					.onChange(async (value) => {
						this.plugin.settings.chatGPTKey = value;
						await this.plugin.saveSettings();
					})
			)
			.addButton((btn) => {
				btn.setButtonText("Set API Key").onClick(async () => {
					this.isValid = await this.plugin.openAIHandler.setAPIKey(
						this.plugin.settings.chatGPTKey
					);
					if(this.isValid) {
						apiKeyText.setValue("Your API key is active");

					}
					else {
						apiKeyText.setValue("Error or invalid try again");
					}

				});
			});

		new Setting(containerEl)
			.setName("Model Selection")
			.setDesc("Choose your preferred language model.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("gpt-3.5-turbo", "GPT 3.5")
					.addOption("gpt-4-turbo", "GPT 4")
					.setValue(this.plugin.settings.model)
					.onChange(async (value) => {
						this.plugin.settings.model = value;
						this.plugin.openAIHandler.setModel(value);
						await this.plugin.saveSettings();
					})
			);
	}
}