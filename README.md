# Dynamic JSON Viewer Widget

A Mendix pluggable widget that renders fully dynamic JSON data with unlimited nesting depth, search functionality, pagination, and theme support.

## Features

- **Dynamic JSON Rendering**: Handles any valid JSON structure with unlimited nesting
- **Type Detection**: Automatically detects and highlights strings, numbers, booleans, nulls, dates, URLs, and emails
- **Expand/Collapse**: Interactive tree view with expand/collapse controls
- **Search**: Real-time search within JSON keys and values
- **Pagination**: Automatic pagination for large arrays
- **Theme Support**: Light, dark, and auto (system) themes
- **Table View**: Arrays of similar objects displayed as tables
- **Copy to Clipboard**: Click to copy any value
- **Safe Rendering**: No eval, no unsafe HTML injection

## Installation

1. Download the widget `.mpk` file from releases
2. Copy to your Mendix project's `widgets` folder
3. Synchronize project directory (F4)

## Building from Source

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## Usage

### Basic Usage

1. Place the widget on a page
2. Configure the **JSON String** property with a string expression containing valid JSON

### Properties

#### Data Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| JSON String | Expression (String) | Yes | The JSON data as a string |
| Root Label | Expression (String) | No | Optional label for the root element |

#### Display Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| Default Expanded | Boolean | true | Whether nodes are expanded by default |
| Initial Expand Depth | Integer | 2 | Levels to expand initially (-1 = all) |
| Show Data Types | Boolean | false | Display type badges next to values |
| Show Item Count | Boolean | true | Show count for arrays/objects |
| Indent Size | Integer | 20 | Indentation in pixels |

#### Features

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| Enable Search | Boolean | true | Show search box |
| Expand/Collapse All | Boolean | true | Show expand/collapse buttons |
| Enable Copy Value | Boolean | true | Allow copying values |

#### Pagination

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| Enable Pagination | Boolean | true | Paginate large arrays |
| Page Size | Integer | 10 | Items per page |
| Pagination Threshold | Integer | 20 | Array size to trigger pagination |

#### Appearance

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| Theme | Enum | auto | light / dark / auto |
| Max Height | String | - | CSS max-height value |
| Custom Class | String | - | Additional CSS classes |

#### Error Handling

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| Show Parse Errors | Boolean | true | Display parsing errors |
| Error Message | String | "Invalid JSON data" | Custom error message |
| Show Raw on Error | Boolean | false | Show raw input on error |

## JSON Structure Support

The widget handles all valid JSON structures:

```json
{
  "string": "Hello World",
  "number": 42,
  "float": 3.14159,
  "boolean": true,
  "null": null,
  "date": "2024-01-15T10:30:00Z",
  "url": "https://example.com",
  "email": "user@example.com",
  "array": [1, 2, 3],
  "object": {
    "nested": "value"
  },
  "arrayOfObjects": [
    { "id": 1, "name": "Item 1" },
    { "id": 2, "name": "Item 2" }
  ]
}
```

## Rendering Rules

| JSON Type | Display |
|-----------|---------|
| Object | Expandable card/section |
| Array of objects (uniform) | Table view |
| Array of primitives | Bullet list |
| Array of mixed types | Expandable list |
| String | Quoted text |
| Number | Numeric value |
| Boolean | Bold true/false |
| Null | Italic null |
| Date (ISO 8601) | Formatted date |
| URL | Underlined link |
| Email | Underlined text |

## Styling Customization

### CSS Custom Properties

Override these CSS variables for custom theming:

```css
.djv-container {
  --djv-bg: #ffffff;
  --djv-bg-secondary: #f8f9fa;
  --djv-border: #e1e4e8;
  --djv-text: #24292f;
  --djv-key: #0550ae;
  --djv-string: #0a3069;
  --djv-number: #0550ae;
  --djv-boolean: #cf222e;
  --djv-null: #8250df;
}
```

### Custom Classes

Add custom styling using the `customClass` property:

```scss
.my-json-viewer {
  .djv-key {
    font-weight: bold;
  }

  .djv-table {
    border-radius: 8px;
  }
}
```

## Performance Considerations

### Best Practices

1. **Large JSON Data**
   - Enable pagination for arrays > 20 items
   - Set `initialExpandDepth` to 1-2 for large documents
   - Consider lazy loading at the data layer

2. **Memory Management**
   - The widget uses virtualization concepts for large arrays
   - Collapsed nodes don't render children
   - Search is debounced (300ms default)

3. **Re-renders**
   - JSON string changes trigger full re-parse
   - Expand/collapse is localized to affected nodes
   - Search highlighting is memoized

### Recommendations

| Data Size | Expand Depth | Pagination |
|-----------|--------------|------------|
| < 100 nodes | -1 (all) | Disabled |
| 100-1000 nodes | 2 | 20 items |
| > 1000 nodes | 1 | 10 items |

## Security

The widget implements several security measures:

- **No `eval()`**: JSON is parsed using `JSON.parse()` only
- **No `dangerouslySetInnerHTML`**: All content is rendered safely
- **Input Validation**: Invalid JSON displays error message
- **XSS Prevention**: User values are text-escaped

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Troubleshooting

### JSON not rendering

1. Check that the expression returns a valid JSON string
2. Verify there are no trailing/leading characters
3. Enable "Show Parse Errors" to see error details

### Performance issues

1. Reduce `initialExpandDepth`
2. Enable pagination
3. Check JSON size (> 1MB may cause issues)

### Styling not applied

1. Ensure widget CSS is loaded
2. Check for CSS specificity conflicts
3. Verify custom class is applied

## API Reference

### TypeScript Types

```typescript
// Main props interface
interface DynamicJsonViewerContainerProps {
  jsonString: DynamicValue<string>;
  rootLabel?: DynamicValue<string>;
  defaultExpanded: boolean;
  initialExpandDepth: number;
  showDataTypes: boolean;
  showItemCount: boolean;
  indentSize: number;
  enableSearch: boolean;
  enableExpandCollapseAll: boolean;
  enableCopyValue: boolean;
  enablePagination: boolean;
  pageSize: number;
  paginationThreshold: number;
  theme: "auto" | "light" | "dark";
  maxHeight: string;
  customClass: string;
  showParseErrors: boolean;
  errorMessage: string;
  showRawOnError: boolean;
  onValueClick?: ActionValue;
}

// Supported JSON types
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;

interface JsonObject {
  [key: string]: JsonValue;
}

type JsonArray = JsonValue[];
```

## License

Apache 2.0

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## Changelog

### 1.0.0

- Initial release
- Full JSON rendering support
- Search functionality
- Pagination
- Light/dark themes
- Table view for arrays
