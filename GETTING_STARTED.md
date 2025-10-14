# Getting Started with bkrptr

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Link for global use (optional)
npm link
```

## First Time Setup

### 1. Set Your API Key

You need an Anthropic API key to use bkrptr.

**Option A: Using the config command**
```bash
bkrptr config --set-api-key sk-ant-your-key-here
```

**Option B: Using environment variable**
```bash
export ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 2. Run Your First Analysis

Use interactive mode for the easiest experience:

```bash
bkrptr interactive
```

This will guide you through:
1. Entering book title and author
2. Selecting genre
3. Choosing analysis purpose
4. Setting depth and options

## Quick Examples

### Example 1: Technical Book

```bash
bkrptr analyze "Clean Code" \
  --author "Robert Martin" \
  --genre technical \
  --purpose implementation \
  --audience "software developers" \
  --depth standard \
  --stream
```

### Example 2: Leadership Book

```bash
bkrptr analyze "Extreme Ownership" \
  --author "Jocko Willink" \
  --genre leadership \
  --purpose professional-development \
  --audience "team leaders" \
  --open
```

### Example 3: Philosophy Book

```bash
bkrptr analyze "Meditations" \
  --author "Marcus Aurelius" \
  --genre philosophy \
  --purpose study \
  --depth comprehensive
```

## Viewing Your Analyses

### List All Analyses
```bash
bkrptr list
```

### View in Terminal
```bash
bkrptr view <analysis-id>
```

### Open in Markdown Viewer
```bash
bkrptr open <analysis-id>
```

## What Gets Generated

Each analysis creates three files:

1. **detailed-analysis.md** - Complete chapter-by-chapter breakdown
   - Full concept explanations
   - Examples and case studies
   - Practical applications

2. **executive-summary.md** - One-page overview
   - Core concepts
   - Key takeaways
   - Implementation priorities

3. **quick-reference.md** - Practical cheatsheet
   - Quick lookup guide
   - Checklists
   - Common pitfalls

## Tips for Best Results

1. **Be Specific with Audience**: Instead of "general readers", use "junior software engineers" or "startup founders"

2. **Use Focus Areas**: Narrow down to specific topics
   ```bash
   --focus "concurrency, error handling, testing"
   ```

3. **Choose Right Depth**:
   - **Quick**: When you need key insights fast
   - **Standard**: Balanced analysis (recommended)
   - **Comprehensive**: Deep dive for study

4. **Stream Output**: See generation in real-time
   ```bash
   --stream
   ```

5. **Open Immediately**: View right after generation
   ```bash
   --open
   ```

## Common Use Cases

### For Software Developers
```bash
bkrptr analyze "Design Patterns" \
  --author "Gang of Four" \
  --genre technical \
  --purpose reference \
  --audience "senior developers"
```

### For Leaders
```bash
bkrptr analyze "Leaders Eat Last" \
  --author "Simon Sinek" \
  --genre leadership \
  --purpose implementation \
  --audience "team managers"
```

### For Students
```bash
bkrptr analyze "Introduction to Algorithms" \
  --author "CLRS" \
  --genre academic \
  --purpose study \
  --depth comprehensive
```

### For Book Clubs
```bash
bkrptr analyze "Sapiens" \
  --author "Yuval Harari" \
  --genre history \
  --purpose enjoyment \
  --audience "book club members"
```

## Next Steps

- Explore different genres and depths
- Try the `view` command to see analyses in terminal
- Use `config --show` to see your settings
- Read the full README.md for all features

## Troubleshooting

**API Key Not Found**
```bash
# Check your config
bkrptr config --show

# Set the key
bkrptr config --set-api-key sk-ant-...
```

**Analysis Not Showing**
```bash
# Check if it was saved
bkrptr list

# Verify output directory
ls ./analyses
```

**Generation Failed**
- Ensure you have internet connection
- Verify your API key is valid
- Check the log files in the current directory

## Support

For issues or questions:
- Check the README.md
- Review examples in `/examples`
- Check logs: `bkrptr-error.log`

---

**Happy reading and analyzing!**
