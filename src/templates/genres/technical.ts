// src/templates/genres/technical.ts

import { GenreTemplate } from '../base';

export const technicalTemplate: GenreTemplate = {
  detailed: `# [Book Title] - Technical Deep Dive

## Book Information
- **Title**: [Full Title]
- **Author**: [Author Name]
- **Publication Year**: [Year]
- **Tech Stack/Domain**: [e.g., JavaScript, System Design, Algorithms]
- **Skill Level**: [Beginner/Intermediate/Advanced]

## Overview
[Technical scope, prerequisites, and what readers will learn]

## Chapter-by-Chapter Analysis

### Chapter 1: [Title]
**Core Concepts**:
[Main technical concepts introduced]

**Code Examples**:
\`\`\`[language]
// Key code example with explanation
\`\`\`

**Best Practices**:
- [Practice 1]
- [Practice 2]

**Common Pitfalls**:
- [Pitfall 1 with solution]
- [Pitfall 2 with solution]

**Practical Exercises**:
1. [Exercise suggestion]
2. [Exercise suggestion]

[Repeat for each chapter]

## Key Patterns & Principles
### Pattern 1: [Name]
- **Problem**: [What it solves]
- **Solution**: [How it works]
- **Implementation**: [Code example]
- **When to Use**: [Scenarios]
- **Trade-offs**: [Pros and cons]

[Repeat for major patterns]

## Implementation Guide
### Setup
[Environment, tools, dependencies]

### Step-by-Step Application
1. [First step with code]
2. [Second step with code]

## Testing Strategies
[How to test the concepts learned]

## Performance Considerations
[Optimization tips and benchmarks]

## Debugging Guide
[Common errors and how to fix them]

## Further Learning
- **Next Steps**: [What to learn next]
- **Related Technologies**: [Complementary skills]
- **Resources**: [Books, docs, courses]

## Conclusion
[Summary of technical takeaways and application path]`,

  summary: `# [Book Title] - Technical Summary

**Author**: [Name] | **Domain**: [Tech Area] | **Level**: [Skill Level]

## Core Technical Concepts
1. **[Concept 1]**: [Explanation] - Used for [use case]
2. **[Concept 2]**: [Explanation] - Solves [problem]
3. **[Concept 3]**: [Explanation] - Enables [capability]
4. **[Concept 4]**: [Explanation] - Optimizes [aspect]
5. **[Concept 5]**: [Explanation] - Prevents [issue]

## Key Design Patterns
- **[Pattern 1]**: [When and why to use it]
- **[Pattern 2]**: [When and why to use it]
- **[Pattern 3]**: [When and why to use it]

## Critical Best Practices
1. [Practice with rationale]
2. [Practice with rationale]
3. [Practice with rationale]

## Common Anti-Patterns to Avoid
- **[Anti-pattern 1]**: [Why it's bad, what to do instead]
- **[Anti-pattern 2]**: [Why it's bad, what to do instead]

## Implementation Checklist
**Phase 1 - Foundation**:
- [ ] [Setup step]
- [ ] [Core implementation]

**Phase 2 - Enhancement**:
- [ ] [Optimization]
- [ ] [Testing]

**Phase 3 - Production**:
- [ ] [Deployment preparation]
- [ ] [Monitoring]

## Tech Stack Requirements
- [Tool/library 1]: [Purpose]
- [Tool/library 2]: [Purpose]

## Bottom Line
[One sentence: What this book enables you to build/do]`,

  reference: `# [Book Title] - Developer Quick Reference

## Quick Lookup

### Most Important Concepts
1. **[Concept]**: [One-line description]
2. **[Concept]**: [One-line description]
3. **[Concept]**: [One-line description]

## Code Snippets

### Pattern 1: [Name]
\`\`\`[language]
// Minimal working example
\`\`\`
**Use when**: [Scenario]

### Pattern 2: [Name]
\`\`\`[language]
// Minimal working example
\`\`\`
**Use when**: [Scenario]

[Repeat for key patterns]

## Debugging Quick Reference

### Error: [Common Error]
**Cause**: [Why it happens]
**Fix**: [How to resolve]

### Error: [Common Error]
**Cause**: [Why it happens]
**Fix**: [How to resolve]

## Performance Optimization Checklist
- [ ] [Optimization 1]
- [ ] [Optimization 2]
- [ ] [Optimization 3]

## Best Practices Checklist
- [ ] [Practice 1]
- [ ] [Practice 2]
- [ ] [Practice 3]

## Code Review Checklist
- [ ] [Check 1]
- [ ] [Check 2]
- [ ] [Check 3]

## Testing Strategy
- **Unit Tests**: [What to test]
- **Integration Tests**: [What to test]
- **E2E Tests**: [What to test]

## When to Use This Pattern
| Pattern | Best For | Avoid When |
|---------|----------|------------|
| [Name]  | [Use case] | [Scenario] |

## Quick Commands
\`\`\`bash
# Common operations
command1  # [What it does]
command2  # [What it does]
\`\`\`

## Further Reading
- [Resource 1]
- [Resource 2]`
};
