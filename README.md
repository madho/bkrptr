# 📚 bkrptr - Universal Book Reporter

Transform ANY book into three actionable Markdown analysis documents using AI. Built with Claude and designed for developers, students, and professionals who want to extract maximum value from their reading.

## What It Does

**bkrptr** analyzes books across any genre and generates:

1. **Detailed Analysis** - Chapter-by-chapter or concept-by-concept breakdown
2. **Executive Summary** - One-page strategic overview
3. **Quick Reference** - Practical cheatsheet for daily use

## Features

- 📖 **Universal** - Works with technical, philosophy, fiction, business, leadership, and more
- 🎯 **Genre-Aware** - Custom templates for technical, philosophy, business, and leadership books
- 🚀 **Fast** - Generate comprehensive analysis in 2-3 minutes
- 💾 **Organized** - Saves all analyses with metadata for easy retrieval
- 🎨 **Terminal-Friendly** - Beautiful CLI with streaming output and formatting
- 🔧 **Flexible** - Quick, standard, or comprehensive analysis depths
- 📝 **Markdown** - Clean, portable output files

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd bkrptr

# Install dependencies
npm install

# Build the project
npm run build

# Link for global use
npm link

# Or use directly with tsx
npm run dev -- interactive
```

## Quick Start

### 1. Set Your API Key

```bash
bkrptr config --set-api-key sk-ant-your-key-here
```

Or set environment variable:
```bash
export ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 2. Analyze a Book (Interactive Mode)

```bash
bkrptr interactive
```

This launches a guided wizard that walks you through:
- Book title and author
- Genre selection (with auto-suggestions)
- Analysis purpose and audience
- Depth and focus areas

### 3. View Your Analyses

```bash
bkrptr list                    # See all analyses
bkrptr view analysis-id        # View in terminal
bkrptr open analysis-id        # Open in markdown viewer
```

## Usage

### Interactive Mode (Recommended)

```bash
bkrptr interactive
```

Most user-friendly option with guided prompts.

### Direct Analysis

```bash
bkrptr analyze "Clean Code" \
  --author "Robert Martin" \
  --genre technical \
  --purpose implementation \
  --audience "software developers" \
  --depth standard
```

### All Options

```bash
bkrptr analyze <title>
  -a, --author <name>           Book author (required)
  -g, --genre <type>            Book genre (required)
  -p, --purpose <type>          Analysis purpose (default: study)
  --audience <description>      Target audience (default: general readers)
  -d, --depth <level>           quick|standard|comprehensive (default: standard)
  -c, --context <text>          Specific application context
  -i, --input <file>            Path to book content file
  -o, --output-dir <dir>        Output directory (default: ./analyses)
  --focus <areas>               Comma-separated focus areas
  --stream                      Stream output to terminal
  --no-save                     Don't save to disk
  --open                        Open after generation
  -v, --verbose                 Verbose logging
```

## Supported Genres

bkrptr has specialized templates for:

- **💻 Technical** - Programming, engineering, system design
- **🧠 Philosophy** - Ethics, logic, metaphysics
- **💼 Business** - Strategy, management, innovation
- **👥 Leadership** - Team management, organizational behavior
- **📖 Fiction** - Novels, literary analysis
- **🎓 Academic** - Research, textbooks
- **🌱 Self-Help** - Personal development
- **📜 History** - Historical analysis
- **🔬 Science** - Scientific texts
- **📐 Mathematics** - Theory, proofs
- **🧬 Psychology** - Behavioral science
- **📝 Biography** - Life stories, memoirs

## Analysis Purposes

Choose the purpose that best fits your needs:

- **📋 Reference** - Quick lookup guide
- **📚 Study** - Deep learning and comprehension
- **👨‍🏫 Teaching** - Prepare to teach or present
- **🛠️ Implementation** - Apply concepts in practice
- **🔬 Research** - Academic or professional research
- **💡 Professional Development** - Career advancement
- **🎭 Enjoyment** - Deeper appreciation

## Analysis Depths

- **⚡ Quick** - Key insights only (fastest, ~1-2 min)
- **📊 Standard** - Balanced detail (recommended, ~2-3 min)
- **🔍 Comprehensive** - Exhaustive analysis (~5-10 min)

## Commands

### `analyze`
Generate analysis for a specific book
```bash
bkrptr analyze "The Phoenix Project" -a "Gene Kim" -g business
```

### `interactive` (alias: `i`)
Launch interactive mode with guided prompts
```bash
bkrptr i
```

### `list` (alias: `ls`)
List all saved analyses
```bash
bkrptr list                    # All analyses
bkrptr list --genre technical  # Filter by genre
bkrptr list --author "Martin"  # Filter by author
```

### `view`
View analysis in terminal
```bash
bkrptr view clean-code-2025-01-15              # View all
bkrptr view clean-code-2025-01-15 -d summary   # Just summary
bkrptr view clean-code-2025-01-15 --raw        # Raw markdown
```

### `open`
Open analysis in default markdown viewer
```bash
bkrptr open clean-code-2025-01-15                # Detailed
bkrptr open clean-code-2025-01-15 -d summary     # Summary
bkrptr open clean-code-2025-01-15 -d reference   # Reference
```

### `config`
Manage configuration
```bash
bkrptr config --set-api-key sk-ant-...
bkrptr config --set-output-dir ~/my-analyses
bkrptr config --show
bkrptr config --reset
```

## Output Structure

Each analysis creates a directory with:

```
analyses/
  clean-code-2025-01-15/
    detailed-analysis.md      # Full chapter-by-chapter
    executive-summary.md      # One-page overview
    quick-reference.md        # Practical cheatsheet
    metadata.json             # Analysis metadata
```

## Configuration

Configuration is stored in `.bkrptr/config.json`:

```json
{
  "apiKey": "sk-ant-...",
  "defaultOutputDir": "./analyses",
  "defaultDepth": "standard",
  "defaultGenre": "technical",
  "defaultAudience": "developers",
  "autoOpen": false,
  "streamOutput": true
}
```

## Examples

### Technical Book
```bash
bkrptr analyze "Design Patterns" \
  --author "Gang of Four" \
  --genre technical \
  --purpose implementation \
  --audience "software engineers" \
  --focus "creational patterns, structural patterns"
```

### Leadership Book
```bash
bkrptr analyze "Extreme Ownership" \
  --author "Jocko Willink" \
  --genre leadership \
  --purpose professional-development \
  --audience "team leaders"
```

### Philosophy Book
```bash
bkrptr analyze "Meditations" \
  --author "Marcus Aurelius" \
  --genre philosophy \
  --purpose study \
  --depth comprehensive
```

## Development

```bash
# Install dependencies
npm install

# Development mode
npm run dev -- interactive

# Build
npm run build

# Run built version
npm start

# Lint
npm run lint

# Format
npm run format
```

## Project Structure

```
bkrptr/
├── src/
│   ├── cli/              # CLI commands
│   ├── core/             # Core analysis engine
│   ├── templates/        # Genre-specific templates
│   ├── storage/          # File persistence
│   ├── utils/            # Utilities
│   └── types/            # TypeScript types
├── analyses/             # Generated analyses (gitignored)
├── package.json
└── tsconfig.json
```

## Requirements

- Node.js 20+
- Anthropic API key

## How It Works

1. **Input** - You provide book title, author, genre, and preferences
2. **Prompt Building** - Genre-specific prompts are constructed with templates
3. **AI Generation** - Claude Sonnet 4 analyzes the book (or your description)
4. **Output** - Three markdown documents are generated and saved
5. **Storage** - Analysis is saved with metadata for future retrieval

## Tips

- Use **interactive mode** for your first analysis to see all options
- Choose the **appropriate depth** - quick for overview, comprehensive for deep study
- Specify **focus areas** to zero in on topics you care about
- Use **--stream** to watch the analysis being generated in real-time
- Open analyses with **--open** flag to immediately view in your preferred editor

## Roadmap

- [ ] Batch analysis from JSON config
- [ ] Genre auto-detection from book title
- [ ] Support for PDF/EPUB input
- [ ] Comparison mode for related books
- [ ] Export to other formats (PDF, HTML)
- [ ] Web interface (Vercel deployment)
- [ ] Collaboration features
- [ ] Template customization

## Contributing

This is an open-source tool designed to be extended. Contributions welcome:

- New genre templates
- Additional analysis types
- UI improvements
- Documentation

## License

MIT

## Author

Built with Claude Code

---

**Transform your reading into action. Start with `bkrptr interactive`**
