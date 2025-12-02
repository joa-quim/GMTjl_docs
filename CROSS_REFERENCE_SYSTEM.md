# GMT.jl Cross-Reference System Documentation

## Overview

The GMT.jl documentation uses a custom Quarto shortcode system for creating cross-references throughout the documentation. This system is implemented via the `gmtref` shortcode, which provides a unified, maintainable way to link to modules, utilities, GMT types, and general documentation pages.

## How It Works

### The Shortcode Extension

The cross-reference system is implemented as a Lua-based Quarto extension located at:
```
_extensions/gmtref/gmtref.lua
```

This extension processes `{{< gmtref >}}` shortcodes during the Quarto rendering process and converts them into properly formatted HTML links.

### Basic Syntax

The general syntax for using the gmtref shortcode is:

```markdown
{{< gmtref NAME type=TYPE >}}
```

Where:
- `NAME` is the name of the item you want to reference
- `type=TYPE` is optional and specifies the type of reference

## Reference Types

### 1. GMT Modules (default)

**Syntax:**
```markdown
{{< gmtref plot >}}
{{< gmtref grdimage >}}
{{< gmtref coast >}}
```

**Output:**
- Creates a link to `/documentation/modules/MODULE_NAME.html`
- Display text: The module name (e.g., "plot", "grdimage")
- Example: `plot` (clickable link)

**When to use:**
- Referencing any GMT module (e.g., plot, coast, grdimage, basemap, etc.)
- This is the default type, so you don't need to specify `type=module`

---

### 2. GMT Utilities

**Syntax:**
```markdown
{{< gmtref mat2grid >}}
{{< gmtref gmtread >}}
{{< gmtref extrude type=util >}}
```

**Output:**
- Creates a link to `/documentation/utilities/UTILITY_NAME.html`
- Display text: The utility name
- Example: `mat2grid` (clickable link)

**When to use:**
- Referencing GMT.jl utility functions
- The extension auto-detects common utilities, so `type=util` is optional for known utilities
- Known utilities include: mat2grid, mat2img, mat2ds, gmtread, gmtwrite, extrude, imshow, etc.

**Auto-detected utilities:** The extension maintains a list of ~140 known utility names and will automatically classify them correctly even without `type=util`.

---

### 3. GMT Data Types

**Syntax:**
```markdown
{{< gmtref GMTgrid type=gmttype >}}
{{< gmtref GMTimage type=gmttype >}}
{{< gmtref GMTdataset type=gmttype >}}
{{< gmtref GMTcpt type=gmttype >}}
{{< gmtref GMTps type=gmttype >}}
{{< gmtref GMTfv type=gmttype >}}
```

**Output:**
- Creates a link to `/documentation/general/types.html#ANCHOR`
- Display text: The type name **formatted as code** (e.g., `GMTgrid`)
- Example: `GMTgrid` (clickable, monospaced code text)

**Anchors used:**
- GMTgrid → `#grid-type`
- GMTimage → `#image-type`
- GMTdataset → `#dataset-type`
- GMTcpt → `#cpt-type`
- GMTps → `#postscript-type`
- GMTfv → `#face-vertices-type`

**When to use:**
- Referencing GMT.jl data types in documentation
- **MUST** include `type=gmttype` parameter
- Use whenever mentioning these types in prose (not in code blocks or function signatures)

**Important:** GMT types are rendered as **code-formatted** text (with backticks in HTML: `<code>GMTgrid</code>`), which distinguishes them visually from regular text.

---

### 4. General Documentation Pages

**Syntax:**
```markdown
{{< gmtref introduction type=general >}}
{{< gmtref quick_learn type=general >}}
{{< gmtref modules type=general >}}
{{< gmtref monolithic type=general >}}
{{< gmtref types type=general >}}
```

**Output:**
- Creates a link to `/documentation/general/PAGE_NAME.html`
- Display text: Capitalized, formatted name (e.g., "Introduction", "Quick learn")
- Example: `Introduction` (clickable link)

**Supported general pages:**
- `introduction` → Introduction
- `quick_learn` → Quick learn
- `modules` → Modules
- `monolithic` → Monolithic (also accepts alternate spelling "monolitic")
- `types` → Types

**When to use:**
- Linking to general documentation sections
- **MUST** include `type=general` parameter

---

## Implementation Details

### Path Generation

The extension generates **absolute paths from the site root** (starting with `/`). Quarto automatically converts these to relative paths based on the document's location during rendering.

For example:
- Source: `{{< gmtref GMTgrid type=gmttype >}}`
- Extension generates: `/documentation/general/types.html#grid-type`
- Quarto converts to: `../general/types.html#grid-type` (if in a module doc)
- Or: `../../documentation/general/types.html#grid-type` (if in an example)

### Auto-Detection Logic

The extension includes auto-detection for utilities:

1. When you use `{{< gmtref NAME >}}` without a type parameter
2. It checks if NAME matches the list of known utilities
3. If found, it automatically treats it as `type=util`
4. Otherwise, it defaults to `type=module`

This means both of these work identically:
```markdown
{{< gmtref mat2grid >}}
{{< gmtref mat2grid type=util >}}
```

### Link Content Formatting

Different reference types format their display text differently:

| Type | Display Format | HTML Element |
|------|---------------|--------------|
| Module | Plain text | `<a>name</a>` |
| Utility | Plain text | `<a>name</a>` |
| GMT Type | Code formatted | `<a><code>GMTtype</code></a>` |
| General | Capitalized | `<a>Capitalized name</a>` |

The code formatting for GMT types uses Pandoc's `pandoc.Code()` function to ensure proper rendering.

---

## Usage Guidelines

### When to Use gmtref

**DO use gmtref for:**
- ✓ All references to GMT modules
- ✓ All references to GMT.jl utilities
- ✓ All references to GMT data types (GMTgrid, GMTimage, etc.)
- ✓ All references to general documentation pages
- ✓ Cross-references within documentation text

**DO NOT use gmtref for:**
- ✗ Code blocks or function signatures
- ✗ Julia type annotations (e.g., `Vector{GMTdataset}`)
- ✗ External links
- ✗ Section headers (use Quarto's native `{#sec-id}` instead)

### Examples in Context

#### Example 1: Referencing multiple types in a sentence
```markdown
GMT modules know how to manipulate data stored in {{< gmtref GMTgrid type=gmttype >}},
{{< gmtref GMTimage type=gmttype >}}, {{< gmtref GMTdataset type=gmttype >}},
{{< gmtref GMTcpt type=gmttype >}} and {{< gmtref GMTps type=gmttype >}} objects.
```

#### Example 2: Referencing utilities and modules
```markdown
The helper functions {{< gmtref mat2grid >}}, {{< gmtref mat2img >}} and
{{< gmtref mat2ds >}} exist to create GMT data structures. You can then pass
these to modules like {{< gmtref grdimage >}} or {{< gmtref plot >}}.
```

#### Example 3: Referencing general documentation
```markdown
For more details, see the {{< gmtref introduction type=general >}} and
{{< gmtref quick_learn type=general >}} pages.
```

#### Example 4: Mixed references
```markdown
Use {{< gmtref gmtread >}} to read a file and return a {{< gmtref GMTdataset type=gmttype >}},
then pass it to {{< gmtref plot >}} for visualization.
```

---

## Benefits of This System

### 1. **Maintainability**
- If file locations change, you only update the Lua extension
- All references automatically update site-wide
- No need to hunt for broken links

### 2. **Consistency**
- Uniform link formatting across all documentation
- GMT types always render as code
- Predictable, standardized syntax

### 3. **Type Safety**
- The extension validates reference types
- Known utilities are auto-detected
- Invalid references are easier to spot during rendering

### 4. **Future-Proof**
- Adding new reference types is simple (just extend the Lua script)
- Works with Quarto's build system
- Compatible with both local and deployed documentation

---

## Troubleshooting

### Common Issues

**Issue:** Link shows as plain text instead of rendering
```markdown
{{< gmtref plot >}}  <!-- Renders as literal text -->
```
**Solution:** Check for typos in the shortcode syntax. Ensure proper spacing and closing `>}}`.

---

**Issue:** GMT type not rendering as code
```markdown
{{< gmtref GMTgrid >}}  <!-- Missing type parameter -->
```
**Solution:** Always include `type=gmttype` for GMT data types:
```markdown
{{< gmtref GMTgrid type=gmttype >}}
```

---

**Issue:** Link points to wrong location
**Solution:** Verify the reference type. Use `type=util` for utilities, `type=general` for general docs, etc.

---

**Issue:** "File not found" errors when clicking links
**Solution:**
1. Ensure the target file exists and is included in `_quarto.yml` render list
2. Check spelling of the reference name
3. Verify the file is being rendered (check `_site` directory)

---

## Migration Notes

### Replacing Old Reference Formats

When updating old documentation, replace these patterns:

**Old Format → New Format:**

```markdown
# Old manual links
[`GMTgrid`](types.html#grid-type)
→ {{< gmtref GMTgrid type=gmttype >}}

[Grid type](types.html#grid-type)
→ {{< gmtref GMTgrid type=gmttype >}}

[Introduction](introduction.html)
→ {{< gmtref introduction type=general >}}

\apilink{mat2grid}
→ {{< gmtref mat2grid >}}
```

### Automated Migration

Scripts have been created to help migrate old references:
- `replace_gmttype_refs.py` - Replaces manual GMT type links
- `replace_gmttype_refs2.py` - Replaces plain text GMT type references
- `fix_type_references.py` - Fixes broken [Type name] references

---

## Extension Code Structure

The `gmtref.lua` extension is structured as follows:

```lua
return {
  ['gmtref'] = function(args, kwargs)
    -- 1. Extract the reference name from args[1]
    local name = pandoc.utils.stringify(args[1])

    -- 2. Determine the reference type
    local ref_type = "module"  -- default
    if kwargs["type"] then
      ref_type = pandoc.utils.stringify(kwargs["type"])
    end

    -- 3. Auto-detect utilities
    -- (check against known utility list)

    -- 4. Build the path based on ref_type
    -- - util:     /documentation/utilities/NAME.html
    -- - gmttype:  /documentation/general/types.html#ANCHOR
    -- - general:  /documentation/general/NAME.html
    -- - module:   /documentation/modules/NAME.html

    -- 5. Format the link content
    -- - gmttype uses pandoc.Code(name)
    -- - general capitalizes and formats the name
    -- - others use plain name

    -- 6. Return pandoc.Link(link_content, path)
  end
}
```

---

## Summary

The `{{< gmtref >}}` shortcode system provides a robust, maintainable way to create cross-references in GMT.jl documentation:

- **Modules**: `{{< gmtref plot >}}`
- **Utilities**: `{{< gmtref mat2grid >}}` or `{{< gmtref mat2grid type=util >}}`
- **GMT Types**: `{{< gmtref GMTgrid type=gmttype >}}` (renders as code)
- **General Docs**: `{{< gmtref introduction type=general >}}`

Always use this system instead of manual HTML or Markdown links to ensure consistency and maintainability across the documentation.
