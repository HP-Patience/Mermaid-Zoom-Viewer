# Mermaid Zoom Viewer

A plugin for Obsidian that enhances Mermaid diagrams with zoom and pan functionality, allowing full-screen viewing of SVG content.

## Features

- **Automatic Detection**: Automatically identifies Mermaid diagrams in your notes, including Gantt charts, flowcharts, and more.
- **Zoom Button**: Adds a "放大查看" (Zoom View) button to the top-right corner of each Mermaid diagram.
- **Full-Screen Modal**: Clicking the button opens the diagram in a full-screen modal window.
- **Interactive Controls**: Supports:
  - Mouse wheel zoom
  - Drag and drop pan
  - Zoom in/out buttons
  - Reset zoom button
  - Zoom level display
- **Mobile Support**: Touch events for zoom and pan on mobile devices.
- **PNG Export**: Option to export diagrams as PNG images.
- **Customizable Settings**: Control when to show the zoom button, default zoom level, and more.
- **Theme Compatible**: Works with both light and dark themes in Obsidian.

## Installation

### From Community Plugins

1. Open Obsidian settings
2. Go to "Community Plugins"
3. Click "Browse"
4. Search for "Mermaid Zoom Viewer"
5. Click "Install"
6. Click "Enable"

### Manual Installation

1. Download the latest release from the [GitHub repository](https://github.com/yourusername/mermaid-zoom-viewer/releases)
2. Extract the zip file
3. Copy the extracted folder to your vault's `.obsidian/plugins/` directory
4. Enable the plugin in Obsidian settings

## Usage

1. Create or open a note with Mermaid diagrams
2. In reading mode or live preview, you'll see a "放大查看" button in the top-right corner of each diagram
3. Click the button to open the diagram in full-screen mode
4. Use the mouse wheel to zoom in and out
5. Click and drag to pan the diagram
6. Use the control buttons at the bottom to zoom in/out, reset zoom, or export as PNG
7. Press ESC or click the close button to exit full-screen mode

## Settings

The plugin includes a settings tab where you can configure:

- **Always show zoom button**: Show the zoom button on all Mermaid diagrams
- **Show zoom button on overflow**: Only show the zoom button when the diagram width overflows
- **Default zoom level**: Initial zoom level when opening diagrams
- **Minimum zoom level**: Minimum allowed zoom level
- **Maximum zoom level**: Maximum allowed zoom level
- **Enable PNG export**: Allow exporting diagrams as PNG images

## Compatibility

- **Reading Mode**: ✅ Fully supported
- **Live Preview Mode**: ✅ Fully supported
- **Source Mode**: ✅ No interference
- **Mobile Apps**: ✅ Supported with touch events

## Development

### Prerequisites

- Node.js v16 or higher
- npm or yarn

### Setup

1. Clone this repository
2. Navigate to the project directory
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start development mode
5. Copy the project folder to your vault's `.obsidian/plugins/` directory
6. Reload Obsidian to load the plugin

### Building for Release

1. Run `npm run build` to create a production build
2. The built files will be in the project root directory

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This plugin is licensed under the 0-BSD License.

## Support

If you have any issues or feature requests, please open an issue on the [GitHub repository](https://github.com/yourusername/mermaid-zoom-viewer/issues).

---

Made with ❤️ for Obsidian users everywhere!
