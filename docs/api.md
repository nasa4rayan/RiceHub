# RiceHub API Documentation

## Base URL

```
https://ricehub.sh/api
```

## Endpoints

### GET /api/themes

List all themes with optional filtering.

**Query Parameters:**
- `wm` (optional): Window manager/de (hyprland, openbox, i3, bspwm, kde, gnome, xfce)
- `distro` (optional): Linux distribution (arch, debian, fedora)
- `sort` (optional): Sort order (popular, rating, newest)
- `q` (optional): Search query

**Response:**
```json
{
  "themes": [
    {
      "slug": "tokyo-night-openbox",
      "name": "Tokyo Night Openbox",
      "wm": "openbox",
      "description": "Clean and minimal Openbox theme...",
      "previewImage": "/api/placeholder/400/300",
      "rating": 4.8,
      "downloads": 1234,
      "distros": ["arch", "debian", "fedora"],
      "tags": ["minimal", "dark"],
      "author": "ricehub-user",
      "license": "MIT",
      "version": "1.0.0"
    }
  ]
}
```

### GET /api/themes/:slug

Get detailed information about a specific theme.

**Response:**
```json
{
  "slug": "tokyo-night-openbox",
  "name": "Tokyo Night Openbox",
  "wm": "openbox",
  "description": "Clean and minimal Openbox theme...",
  "previewImages": ["/api/placeholder/800/450"],
  "rating": 4.8,
  "totalRatings": 42,
  "downloads": 1234,
  "author": "ricehub-user",
  "license": "MIT",
  "version": "1.0.0",
  "lastUpdated": "2024-01-15",
  "distros": {
    "arch": "verified",
    "debian": "verified",
    "fedora": "partial"
  },
  "dependencies": {
    "common": ["picom", "rofi", "polybar", "kitty", "feh"],
    "arch": ["ttf-jetbrains-mono-nerd"],
    "debian": ["fonts-jetbrains-mono"],
    "fedora": ["jetbrains-mono-fonts"]
  },
  "fonts": ["JetBrainsMono Nerd Font"],
  "icons": ["Papirus"],
  "gtkTheme": "Tokyo-Night-Dark",
  "terminal": "kitty",
  "compositor": "picom",
  "bar": "polybar",
  "tags": ["minimal", "dark", "anime"]
}
```

### GET /api/themes/:slug/install-script

Generate an install script for a theme.

**Query Parameters:**
- `distro` (optional): Target distribution (auto, arch, debian, fedora)
- `dry-run` (optional): Preview mode (true/false)
- `no-fonts` (optional): Skip font installation (true/false)
- `no-icons` (optional): Skip icon installation (true/false)
- `rollback-on-fail` (optional): Auto rollback on failure (true/false)

**Response:**
```json
{
  "installScript": "#!/bin/bash\n# RiceHub Theme Installer...",
  "command": "bash <(curl -fsSL https://ricehub.sh/install/openbox/tokyo-night.sh)"
}
```

## Error Responses

All endpoints return standard error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `THEME_NOT_FOUND`: Theme with specified slug not found
- `INVALID_PARAMETERS`: Invalid query parameters
- `INTERNAL_ERROR`: Server error

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- 100 requests per minute per IP
- 1000 requests per hour per IP

## Authentication

Currently, all endpoints are public. Future versions will require authentication for:
- Theme submission
- Rating submission
- User profile access

## CORS

CORS is enabled for:
- `https://ricehub.sh`
- `http://localhost:3000` (development)
