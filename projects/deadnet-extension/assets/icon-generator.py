#!/usr/bin/env python3
# Generate DeadNet icons programmatically

import json
from pathlib import Path

# Since we can't use external libraries, create simple SVG icons
def create_svg_icon(size):
    return f'''<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="{size}" height="{size}" fill="#000000"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="{int(size * 0.6)}" fill="#ff0000">💀</text>
</svg>'''

# Create icon files
sizes = [16, 48, 128]
for size in sizes:
    svg_content = create_svg_icon(size)
    # Note: In production, we'd convert these to PNG
    with open(f'icon{size}.svg', 'w') as f:
        f.write(svg_content)
    print(f"Created icon{size}.svg")

print("\nNote: Convert these SVGs to PNGs for the Chrome extension")