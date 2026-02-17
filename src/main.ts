import {App, Modal, Notice, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, MermaidZoomViewerSettings, MermaidZoomViewerSettingTab} from "./settings";

export default class MermaidZoomViewerPlugin extends Plugin {
	settings: MermaidZoomViewerSettings;
	
	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MermaidZoomViewerSettingTab(this.app, this));

		// Add command to manually process Mermaid diagrams
		this.addCommand({
			id: 'process-diagrams',
			name: '处理 Mermaid 图表',
			callback: () => {
				this.processMermaidDiagrams();
			}
		});

		// Register event listeners for when the active view changes or the content is modified
		this.registerEvent(this.app.workspace.on('active-leaf-change', () => {
			this.processMermaidDiagrams();
		}));

		// Register event listeners for when the view mode changes
		this.registerEvent(this.app.workspace.on('layout-change', () => {
			this.processMermaidDiagrams();
		}));

		// Initial processing of Mermaid diagrams
		this.processMermaidDiagrams();
	}

	onunload() {
		// Clean up any remaining zoom buttons
		this.cleanUpZoomButtons();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MermaidZoomViewerSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// Clean up any remaining zoom buttons
	cleanUpZoomButtons() {
		const zoomButtons = document.querySelectorAll('.mermaid-zoom-button');
		zoomButtons.forEach(button => button.remove());
	}

	// Process all Mermaid diagrams in the current view
	processMermaidDiagrams() {
		// Clean up existing zoom buttons first
		this.cleanUpZoomButtons();

		// Get all Mermaid diagram containers
		const mermaidContainers = document.querySelectorAll('.mermaid');
		
		mermaidContainers.forEach(container => {
			// Skip if it's already been processed
			if (container.querySelector('.mermaid-zoom-button')) {
				return;
			}

			// Check if we should show the zoom button
			if (!this.shouldShowZoomButton(container)) {
				return;
			}

			// Create a relative container if not already present
			let relativeContainer = container;
			if ((container as HTMLElement).style.position !== 'relative') {
				relativeContainer = document.createElement('div');
				relativeContainer.className = 'mermaid-container';
				container.parentNode?.insertBefore(relativeContainer, container);
				relativeContainer.appendChild(container);
			}

			// Create zoom button
			const zoomButton = document.createElement('button');
			zoomButton.className = 'mermaid-zoom-button';
			
			// Create svg element
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.setAttribute('width', '16');
			svg.setAttribute('height', '16');
			svg.setAttribute('viewBox', '0 0 24 24');
			svg.setAttribute('fill', 'none');
			svg.setAttribute('stroke', 'currentColor');
			svg.setAttribute('stroke-width', '2');
			svg.setAttribute('stroke-linecap', 'round');
			svg.setAttribute('stroke-linejoin', 'round');
			
			// Create circle element
			const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			circle.setAttribute('cx', '11');
			circle.setAttribute('cy', '11');
			circle.setAttribute('r', '8');
			svg.appendChild(circle);
			
			// Create line element
			const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			line.setAttribute('x1', '21');
			line.setAttribute('y1', '21');
			line.setAttribute('x2', '16.65');
			line.setAttribute('y2', '16.65');
			svg.appendChild(line);
			
			// Add svg to button
			zoomButton.appendChild(svg);
			zoomButton.title = '放大查看';

			// Add click event listener to the zoom button
			zoomButton.addEventListener('click', (e) => {
				e.stopPropagation();
				this.openZoomModal(container);
			});

			// Add the zoom button to the container
			relativeContainer.appendChild(zoomButton);
		});
	}

	// Check if we should show the zoom button for a given container
	shouldShowZoomButton(container: Element): boolean {
		// Always show if the setting is enabled
		if (this.settings.showZoomButtonAlways) {
			return true;
		}

		return false;
	}

	// Open the zoom modal with the Mermaid diagram
	openZoomModal(container: Element) {
		// Get the SVG content from the container
		const svgElement = container.querySelector('svg');
		if (!svgElement) {
			new Notice('No SVG found in the Mermaid diagram');
			return;
		}

		// Clone the SVG to avoid modifying the original
		const svgClone = svgElement.cloneNode(true) as SVGElement;

		// Open the modal with the SVG
		new MermaidZoomModal(this.app, svgClone, this.settings).open();
	}
}

class MermaidZoomModal extends Modal {
	private svgElement: SVGElement;
	private settings: MermaidZoomViewerSettings;
	private zoomLevel: number;
	private isDragging: boolean;
	private startX: number;
	private startY: number;
	private translateX: number;
	private translateY: number;

	constructor(app: App, svgElement: SVGElement, settings: MermaidZoomViewerSettings) {
		super(app);
		this.svgElement = svgElement;
		this.settings = settings;
		this.zoomLevel = settings.defaultZoomLevel;
		this.isDragging = false;
		this.startX = 0;
		this.startY = 0;
		this.translateX = 0;
		this.translateY = 0;
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.className = 'mermaid-zoom-modal';

		// Create the content container
		const contentContainer = contentEl.createEl('div');
		contentContainer.className = 'mermaid-zoom-content';
		contentContainer.style.width = `${this.settings.modalWidth}%`;
		contentContainer.style.height = `${this.settings.modalHeight}%`;

		// Create the taskbar
		const taskbar = contentContainer.createEl('div');
		taskbar.className = 'mermaid-zoom-taskbar';

		// Create the close button and add it to the taskbar
		const closeButton = taskbar.createEl('button');
		closeButton.className = 'mermaid-zoom-close-btn';
		closeButton.textContent = '×';
		closeButton.addEventListener('click', (e) => {
			e.stopPropagation();
			this.close();
		});
		closeButton.addEventListener('mousedown', (e) => {
			e.stopPropagation();
		});

		// Create the SVG container
		const svgContainer = contentContainer.createEl('div');
		svgContainer.className = 'mermaid-zoom-svg-container';

		// Add the SVG to the container
		svgContainer.appendChild(this.svgElement);

		// Create the controls container
		const controlsContainer = contentContainer.createEl('div');
		controlsContainer.className = 'mermaid-zoom-controls';

		// Create the zoom in button
		const zoomInButton = controlsContainer.createEl('button');
		zoomInButton.className = 'mermaid-zoom-control-btn';
		zoomInButton.textContent = '+';
		zoomInButton.addEventListener('click', () => this.zoomIn());

		// Create the zoom level display
		const zoomLevelDisplay = controlsContainer.createEl('span');
		zoomLevelDisplay.className = 'mermaid-zoom-zoom-level';
		zoomLevelDisplay.textContent = `${Math.round(this.zoomLevel * 100)}%`;

		// Create the zoom out button
		const zoomOutButton = controlsContainer.createEl('button');
		zoomOutButton.className = 'mermaid-zoom-control-btn';
		zoomOutButton.textContent = '-';
		zoomOutButton.addEventListener('click', () => this.zoomOut());

		// Create the reset button
		const resetButton = controlsContainer.createEl('button');
		resetButton.className = 'mermaid-zoom-control-btn';
		resetButton.textContent = 'Reset';
		resetButton.addEventListener('click', () => this.resetZoom());

		// Create the export button if enabled
		if (this.settings.enableExportPNG) {
			const exportButton = controlsContainer.createEl('button');
			exportButton.className = 'mermaid-zoom-control-btn';
			exportButton.textContent = 'Export PNG';
			exportButton.addEventListener('click', () => this.exportPNG());
		}

		// Add event listeners for zooming and panning
		svgContainer.addEventListener('wheel', (e) => {
			e.preventDefault();
			const delta = e.deltaY > 0 ? -0.1 : 0.1;
			this.updateZoom(this.zoomLevel + delta, e.clientX, e.clientY);
		});

		svgContainer.addEventListener('mousedown', (e) => {
			this.isDragging = true;
			this.startX = e.clientX - this.translateX;
			this.startY = e.clientY - this.translateY;
		});

		contentEl.addEventListener('mousemove', (e) => {
			if (this.isDragging) {
				this.translateX = e.clientX - this.startX;
				this.translateY = e.clientY - this.startY;
				this.updateTransform();
			}
		});

		contentEl.addEventListener('mouseup', () => {
			this.isDragging = false;
		});

		contentEl.addEventListener('mouseleave', () => {
			this.isDragging = false;
		});

		// Add event listener for keyboard events
		contentEl.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				this.close();
			}
		});

		// Add event listener for touch events (mobile support)
		svgContainer.addEventListener('touchstart', (e: TouchEvent) => {
			if (e.touches && e.touches.length === 1) {
				this.isDragging = true;
				const touch = e.touches[0];
				if (touch) {
					this.startX = touch.clientX - this.translateX;
					this.startY = touch.clientY - this.translateY;
				}
			}
		});

		contentEl.addEventListener('touchmove', (e: TouchEvent) => {
			if (this.isDragging && e.touches && e.touches.length === 1) {
				const touch = e.touches[0];
				if (touch) {
					this.translateX = touch.clientX - this.startX;
					this.translateY = touch.clientY - this.startY;
					this.updateTransform();
				}
			}
		});

		contentEl.addEventListener('touchend', () => {
			this.isDragging = false;
		});

		// Initial transform and center image
		this.updateTransform();
		// Use requestAnimationFrame to ensure modal dimensions are fully rendered
		requestAnimationFrame(() => {
			this.centerImage();
		});
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}

	// Zoom in
	private zoomIn() {
		this.updateZoom(this.zoomLevel + 0.1);
	}

	// Zoom out
	private zoomOut() {
		this.updateZoom(this.zoomLevel - 0.1);
	}

	// Reset zoom
	private resetZoom() {
		this.zoomLevel = this.settings.defaultZoomLevel;
		this.translateX = 0;
		this.translateY = 0;
		this.updateTransform();
		this.updateZoomLevelDisplay();
	}

	// Update zoom level
	private updateZoom(newZoomLevel: number, clientX?: number, clientY?: number) {
		// Clamp zoom level to min/max values
		this.zoomLevel = Math.max(this.settings.minZoomLevel, Math.min(this.settings.maxZoomLevel, newZoomLevel));
		this.updateTransform();
		this.updateZoomLevelDisplay();
	}

	// Update transform
	private updateTransform() {
		const svgContainer = this.contentEl.querySelector('.mermaid-zoom-svg-container');
		if (svgContainer) {
			(svgContainer as HTMLElement).style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.zoomLevel})`;
		}
	}

	// Center the image
	private centerImage() {
		const svgContainer = this.contentEl.querySelector('.mermaid-zoom-svg-container');
		if (svgContainer) {
			// Reset transform
			this.zoomLevel = this.settings.defaultZoomLevel;
			
			// Calculate center position
			const containerRect = svgContainer.getBoundingClientRect();
			
			// Get SVG original dimensions using getBBox()
			let svgWidth, svgHeight;
			try {
				const bbox = this.svgElement.getBBox();
				svgWidth = bbox.width;
				svgHeight = bbox.height;
			} catch (e) {
				// Fallback to clientWidth/clientHeight if getBBox() fails
				svgWidth = this.svgElement.clientWidth || 800;
				svgHeight = this.svgElement.clientHeight || 600;
			}
			
			// Check if the SVG is wider than the container
			if (svgWidth * this.zoomLevel > containerRect.width) {
				// Adjust zoom level to fit the SVG width
				this.zoomLevel = containerRect.width / svgWidth * 0.95; // Add 5% padding
			}
			
			// Check if the SVG is taller than the container
			if (svgHeight * this.zoomLevel > containerRect.height) {
				// Adjust zoom level to fit the SVG height
				const heightZoomLevel = containerRect.height / svgHeight * 0.95; // Add 5% padding
				if (heightZoomLevel < this.zoomLevel) {
					this.zoomLevel = heightZoomLevel;
				}
			}
			
			// Calculate center position with the adjusted zoom level
			this.translateX = (containerRect.width - svgWidth * this.zoomLevel) / 2;
			this.translateY = (containerRect.height - svgHeight * this.zoomLevel) / 2;
			
			// Apply transform
			this.updateTransform();
			this.updateZoomLevelDisplay();
		}
	}

	// Update zoom level display
	private updateZoomLevelDisplay() {
		const zoomLevelDisplay = this.contentEl.querySelector('.mermaid-zoom-zoom-level');
		if (zoomLevelDisplay) {
			zoomLevelDisplay.textContent = `${Math.round(this.zoomLevel * 100)}%`;
		}
	}

	// Export as PNG
	private exportPNG() {
		const svgContainer = this.contentEl.querySelector('.mermaid-zoom-svg-container');
		if (!svgContainer) return;

		// Create a canvas element
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Get the SVG dimensions
		const svgWidth = this.svgElement.clientWidth;
		const svgHeight = this.svgElement.clientHeight;

		// Set canvas dimensions
		canvas.width = svgWidth;
		canvas.height = svgHeight;

		// Convert SVG to data URL
		const svgData = new XMLSerializer().serializeToString(this.svgElement);
		const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
		const url = URL.createObjectURL(svgBlob);

		// Create an image element
		const img = new Image();
		img.onload = () => {
			// Draw the image to the canvas
			ctx.drawImage(img, 0, 0);

			// Convert canvas to PNG data URL
			const pngUrl = canvas.toDataURL('image/png');

			// Create a download link
			const link = document.createElement('a');
			link.href = pngUrl;
			link.download = `mermaid-diagram-${Date.now()}.png`;
			link.click();

			// Clean up
			URL.revokeObjectURL(url);
		};
		img.src = url;
	}
}
