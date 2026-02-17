import {App, PluginSettingTab, Setting} from "obsidian";
import MermaidZoomViewerPlugin from "./main";

export interface MermaidZoomViewerSettings {
	showZoomButtonAlways: boolean;
	defaultZoomLevel: number;
	minZoomLevel: number;
	maxZoomLevel: number;
	enableExportPNG: boolean;
	modalWidth: number;
	modalHeight: number;
	svgContainerWidth: number;
	svgContainerHeight: number;
}

export const DEFAULT_SETTINGS: MermaidZoomViewerSettings = {
	showZoomButtonAlways: true,
	defaultZoomLevel: 1,
	minZoomLevel: 0.1,
	maxZoomLevel: 10,
	enableExportPNG: true,
	modalWidth: 90,
	modalHeight: 90,
	svgContainerWidth: 80,
	svgContainerHeight: 80
}

export class MermaidZoomViewerSettingTab extends PluginSettingTab {
	plugin: MermaidZoomViewerPlugin;

	constructor(app: App, plugin: MermaidZoomViewerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Mermaid 缩放查看器设置')
			.setHeading();

		// 重置设置按钮
		new Setting(containerEl)
			.setName('重置设置')
			.setDesc('将所有设置恢复为默认值')
			.addButton(button => button
				.setButtonText('重置')
				.onClick(async () => {
					this.plugin.settings = Object.assign({}, DEFAULT_SETTINGS);
					await this.plugin.saveSettings();
					this.display();
				}));

		new Setting(containerEl)
			.setName('显示放大按钮')
			.setDesc('在所有 Mermaid 图表上显示放大按钮')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showZoomButtonAlways)
				.onChange(async (value) => {
					this.plugin.settings.showZoomButtonAlways = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('默认缩放级别')
			.setDesc('打开图表时的初始缩放级别')
			.addSlider(slider => {
				slider
					.setLimits(0.1, 3, 0.1)
					.setValue(this.plugin.settings.defaultZoomLevel)
					.onChange(async (value) => {
						this.plugin.settings.defaultZoomLevel = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('最小缩放级别')
			.setDesc('允许的最小缩放级别')
			.addSlider(slider => {
				slider
					.setLimits(0.1, 1, 0.1)
					.setValue(this.plugin.settings.minZoomLevel)
					.onChange(async (value) => {
						this.plugin.settings.minZoomLevel = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('最大缩放级别')
			.setDesc('允许的最大缩放级别')
			.addSlider(slider => {
				slider
					.setLimits(1, 20, 1)
					.setValue(this.plugin.settings.maxZoomLevel)
					.onChange(async (value) => {
						this.plugin.settings.maxZoomLevel = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('启用 PNG 导出')
			.setDesc('允许将图表导出为 PNG 图像')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableExportPNG)
				.onChange(async (value) => {
					this.plugin.settings.enableExportPNG = value;
					await this.plugin.saveSettings();
				}));

		// 显示框大小设置
		new Setting(containerEl)
			.setName('显示框宽度')
			.setDesc('显示框的宽度百分比')
			.addSlider(slider => {
				slider
					.setLimits(50, 100, 5)
					.setValue(this.plugin.settings.modalWidth)
					.onChange(async (value) => {
						this.plugin.settings.modalWidth = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('显示框高度')
			.setDesc('显示框的高度百分比')
			.addSlider(slider => {
				slider
					.setLimits(50, 100, 5)
					.setValue(this.plugin.settings.modalHeight)
					.onChange(async (value) => {
						this.plugin.settings.modalHeight = value;
						await this.plugin.saveSettings();
					});
			});

		// SVG容器大小设置
		new Setting(containerEl)
			.setName('SVG容器宽度')
			.setDesc('SVG容器的宽度百分比')
			.addSlider(slider => {
				slider
					.setLimits(50, 100, 5)
					.setValue(this.plugin.settings.svgContainerWidth || 80)
					.onChange(async (value) => {
						this.plugin.settings.svgContainerWidth = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('SVG容器高度')
			.setDesc('SVG容器的高度百分比')
			.addSlider(slider => {
				slider
					.setLimits(50, 100, 5)
					.setValue(this.plugin.settings.svgContainerHeight || 80)
					.onChange(async (value) => {
						this.plugin.settings.svgContainerHeight = value;
						await this.plugin.saveSettings();
					});
			});
	}
}
