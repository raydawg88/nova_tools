# Nova Retro UI Migration Guide

## Quick Migration Steps

### 1. Replace CSS Import
In all product HTML files, replace:
```html
<link rel="stylesheet" href="../../shared/retro-ui.css">
```

With:
```html
<link rel="stylesheet" href="../../shared/nova-retro-ui.css">
```

### 2. Update HTML Structure
Add the Nova container and scanlines effect:
```html
<body class="nova-scanlines">
    <div class="nova-container">
        <!-- Your content -->
    </div>
</body>
```

### 3. Class Name Mapping

| Old Class | New Class |
|-----------|-----------|
| `retro-container` | `nova-container` |
| `retro-border` | `nova-panel` |
| `retro-button` | `nova-btn` |
| `retro-input` | `nova-input` |
| `retro-green` | Use default text color |
| `retro-amber` | `nova-alert-warning` |
| `retro-cyan` | Use default text color |

### 4. Color Variables
Replace old color variables:
- `--retro-green` → `--nova-primary`
- `--retro-amber` → `--nova-warning`
- `--terminal-bg` → `--nova-bg`

### 5. Button Updates
```html
<!-- Old -->
<button class="retro-button">Click</button>

<!-- New -->
<button class="nova-btn">CLICK</button>
```

### 6. Form Elements
```html
<!-- Old -->
<input type="text" class="retro-input" placeholder="Enter text...">

<!-- New -->
<input type="text" class="nova-input" placeholder="ENTER TEXT">
```

### 7. Panel/Card Structure
```html
<!-- Old -->
<div class="retro-border">
    <h2 class="retro-green">Title</h2>
    <p>Content</p>
</div>

<!-- New -->
<div class="nova-panel">
    <h2>TITLE</h2>
    <p>Content</p>
</div>
```

## Key Design Differences

1. **Colors**: Muted military green instead of bright neon
2. **Borders**: Thick 3-4px solid borders, no rounded corners
3. **Typography**: All caps for headers and labels
4. **Interactions**: No smooth transitions, instant state changes
5. **Overall**: More brutalist, less cyberpunk

## Products to Update

1. ✅ CancelBot
2. ✅ RefundRadar  
3. ✅ PolicyRadar
4. ✅ SalaryScope
5. ✅ ResumeBeam
6. ✅ Performance Review Generator
7. ✅ MainCharacter
8. ✅ BusyBot
9. ✅ NightOwl
10. ✅ Meeting Escape Bot
11. ✅ Passive Aggressive Translator
12. ✅ Procrastination Calculator
13. ✅ Sick Day Generator
14. ✅ YouTube Brain
15. ✅ Agentic Studio
16. ✅ DeadNet Extension
17. ✅ LuckLink Extension
18. ✅ DupeRadar
19. ✅ GhostMode
20. ✅ Landing Page