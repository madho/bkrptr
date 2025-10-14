// src/templates/base.ts

export interface GenreTemplate {
  madhoSummary: string;  // Primary: punchy, voice-driven, actionable
  detailed: string;
  summary: string;
  reference: string;
}

export const baseTemplate: GenreTemplate = {
  madhoSummary: `# [Book Title] - What Matters for You

## Why This Matters

[50 words: Connect to human impact. Why care about this RIGHT NOW?]

---

## The One Big Idea

[75 words: Central argument + concrete example from your world]

---

## Five Things to Know

**1. [Insight]**: [Statement]
**So What**: [Application]
**For You**: [Connection to your work]

**2-5**: [Same structure]

---

## Do This Week

1. **[Action]**: [Specific 48-hour task] to [outcome]. [Why it matters.]
2-3: [Same]

---

## How This Changes Your Work

**Your Business**: [50 words]
**Your Team**: [50 words]
**Your Impact**: [50 words]

---

## The Counterintuitive Stuff

**[Shift 1]**: Most believe [X], but book argues [Y] because [Z]. [~40 words]
**[Shift 2]**: [Same structure]

---

## Worth Remembering

> "[Quote]"
*Why it matters: [One sentence]*

[2 more]

---

## Questions for You

1. [Open question connecting to your challenge]
2. [Implementation question]
3. [Resistance question]

---

**Bottom Line**: [Two punchy sentences answering "what should I do with this?"]

**Time Investment Worth It?** [Yes/No] - [One sentence reasoning]`,

  detailed: `# [Book Title] - Detailed Analysis

## Book Information
- **Title**: [Full Title]
- **Author**: [Author Name]
- **Publication Year**: [Year]
- **Genre**: [Genre]

## Overview
[2-3 paragraph overview of the book's main thesis and scope]

## Chapter-by-Chapter Analysis

### Chapter 1: [Title]
[7-10 paragraphs covering:
- Main concepts introduced
- Key arguments and evidence
- Practical applications
- Notable examples or case studies
- Connection to overall thesis]

[Repeat for each chapter]

## Key Concepts Summary
- **Concept 1**: [Detailed explanation]
- **Concept 2**: [Detailed explanation]
[Continue for major concepts]

## Practical Applications
[Specific ways to apply the book's lessons]

## Critical Analysis
[Strengths, weaknesses, and context]

## Conclusion
[Final synthesis and recommendations]`,

  summary: `# [Book Title] - Executive Summary

**Author**: [Name] | **Genre**: [Genre] | **Generated**: [Date]

## Core Thesis
[2-3 sentences capturing the book's main argument]

## Key Concepts
- **Concept 1**: [One sentence definition] - [One sentence on why it matters]
- **Concept 2**: [One sentence definition] - [One sentence on practical application]
- **Concept 3**: [One sentence definition] - [One sentence showing impact]
[5-7 key concepts total]

## Main Takeaways
1. [Actionable insight #1]
2. [Actionable insight #2]
3. [Actionable insight #3]
4. [Actionable insight #4]
5. [Actionable insight #5]

## Implementation Priority
**Start Immediately**: [1-2 concepts with immediate impact]
**Build Over Time**: [2-3 elements requiring development]
**Master Long-term**: [1-2 advanced concepts]

## Bottom Line
[One powerful sentence summarizing the book's value]`,

  reference: `# [Book Title] - Quick Reference Guide

## At-a-Glance Summary
- **Main Idea**: [One sentence]
- **Best For**: [Target audience]
- **Time to Apply**: [Immediate/Weeks/Months]

## Core Frameworks
### Framework 1: [Name]
- **Purpose**: [What it does]
- **When to Use**: [Situations]
- **How to Apply**: [Steps]

[Repeat for 3-5 frameworks]

## Quick Checklist
- [ ] [Action item 1]
- [ ] [Action item 2]
- [ ] [Action item 3]
[10-15 actionable items]

## Key Quotes
> "[Memorable quote 1]"
> "[Memorable quote 2]"

## Common Pitfalls
- [Mistake to avoid #1]
- [Mistake to avoid #2]

## Further Resources
- [Related reading or tools]`
};
