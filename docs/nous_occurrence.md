# VizKidd Occurrences in VizKidd Codebase

This document contains ALL occurrences of "nous", "Nous", "NOUS", and "nous.ai" found in the VizKidd codebase as of the current analysis.

## Summary
- **Total Occurrences Found**: 10 instances
- **Files Affected**: 7 files
- **Case Variations**: "VizKidd" (most common), "VizKidd" (1 instance)

## Detailed Occurrences

### 1. src/components/layout/Sidebar.tsx
- **Line 77**: `<span className="ml-2 text-xl font-bold text-gray-900">VizKidd</span>`
- **Context**: Brand name display in sidebar component

### 2. src/components/layout/Header.tsx
- **Line 12**: `title = 'VizKidd',`
- **Context**: Default title constant for header component

### 3. src/components/layout/Footer.tsx
- **Line 14**: `&copy; {new Date().getFullYear()} VizKidd. All rights reserved.`
- **Context**: Copyright notice in footer component

### 4. src/components/VisualizationTab.tsx
- **Line 62**: `Nous<span className="text-[#64B5F6]">.</span><span className="font-extrabold">AI</span>`
- **Context**: Styled brand name display with colored dot and AI text

### 5. src/components/LandingPage.tsx
- **Line 107**: `<h1 className="text-2xl font-bold">VizKidd</h1>`
- **Context**: Main heading on landing page
- **Line 149**: `VizKidd transforms your complex text into beautiful,`
- **Context**: Descriptive text about the service
- **Line 182**: `VizKidd Offers<br />`
- **Context**: Section heading for services/features

### 6. src/App.tsx
- **Line 90**: `<h1 className="text-2xl font-bold text-white">VizKidd</h1>`
- **Context**: Brand name in main app header

### 7. index.html
- **Line 7**: `<meta name="description" content="VizKidd - Transform text into beautiful visualizations" />`
- **Context**: HTML meta description tag
- **Line 9**: `<title>VizKidd | Text Visualization</title>`
- **Context**: HTML page title

## Files NOT Containing Nous References
The following files were searched but contain NO nous-related content:
- package.json
- README.md
- vite.config.ts
- tailwind.config.js
- All files in supabase/ directory
- All files in src/constants/ directory
- All files in src/services/ directory

## Architecture Impact Assessment
All occurrences are in the **frontend/UI layer**:
- **UI Components**: 6 files (layout components, main app, landing page)
- **HTML Metadata**: 1 file (index.html)
- **No Backend References**: No occurrences found in API services, configuration, or backend code
- **No Configuration References**: No occurrences in build configs, package files, or environment configs

## Replacement Strategy Recommendations
1. **Frontend Branding**: All occurrences are visual/UI related - easy to replace with new branding
2. **No Deep Integration**: No hardcoded API endpoints or service references
3. **Simple Find/Replace**: All instances are straightforward text replacements
4. **No Breaking Changes**: No functional dependencies on the "VizKidd" name

## Search Methodology
- Used case-insensitive grep search for "nous"
- Used case-sensitive grep search for "NOUS" and "Nous"
- Searched all file types including TypeScript, JavaScript, HTML, JSON, and Markdown
- Recursive search across entire codebase including nested directories
- Verified no occurrences in configuration files, package files, or backend services
