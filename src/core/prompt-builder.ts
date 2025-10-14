// src/core/prompt-builder.ts

import { AnalysisInput } from '../types';
import * as templates from '../templates';

export class PromptBuilder {
  buildDetailedAnalysisPrompt(input: AnalysisInput): string {
    const template = templates.getGenreTemplate(input.genre, 'detailed');

    return `You are an expert book analyst specializing in ${input.genre} books. Your task is to create a comprehensive, detailed analysis that serves the purpose of ${input.purpose} for ${input.audience}.

<analysis_request>
  <book_info>
    <title>${input.bookTitle}</title>
    <author>${input.author}</author>
    ${input.publicationYear ? `<publication_year>${input.publicationYear}</publication_year>` : ''}
    <genre>${input.genre}</genre>
  </book_info>

  <analysis_context>
    <primary_purpose>${input.purpose}</primary_purpose>
    <target_audience>${input.audience}</target_audience>
    <analysis_depth>${input.analysisDepth}</analysis_depth>
    ${input.specificContext ? `<specific_context>${input.specificContext}</specific_context>` : ''}
    ${input.focusAreas?.length ? `<focus_areas>${input.focusAreas.join(', ')}</focus_areas>` : ''}
  </analysis_context>
</analysis_request>

${this.getGenreGuidance(input.genre)}

${this.getDepthGuidance(input.analysisDepth)}

<output_requirements>
  <document_type>detailed_analysis</document_type>
  <format>markdown</format>

  <template_structure>
${template}
  </template_structure>

  <quality_standards>
    - Relevant: Every insight directly applicable to ${input.purpose}
    - Clear: Language appropriate for ${input.audience}
    - Actionable: Concrete takeaways and applications
    - Comprehensive: Cover all major concepts thoroughly
    - Well-structured: Use markdown formatting effectively
    - Professional: Maintain high analytical standards
  </quality_standards>
</output_requirements>

${input.bookContent ? `\n<book_content>\n${input.bookContent}\n</book_content>\n` : ''}

Generate the detailed analysis following the exact template structure. Use proper markdown formatting with headers, lists, code blocks (if applicable), and emphasis where appropriate. Be thorough and insightful.`;
  }

  buildSummaryPrompt(input: AnalysisInput): string {
    const template = templates.getGenreTemplate(input.genre, 'summary');

    return `You are an expert book analyst creating a concise executive summary of "${input.bookTitle}" by ${input.author}.

This summary is for ${input.audience} who want to ${input.purpose}. Keep it concise yet comprehensive - aim for one page maximum.

<analysis_context>
  <genre>${input.genre}</genre>
  <purpose>${input.purpose}</purpose>
  <audience>${input.audience}</audience>
  ${input.specificContext ? `<specific_context>${input.specificContext}</specific_context>` : ''}
</analysis_context>

${this.getGenreGuidance(input.genre)}

<output_requirements>
  <document_type>executive_summary</document_type>
  <format>markdown</format>
  <length>one_page_maximum</length>

  <template_structure>
${template}
  </template_structure>

  <key_principles>
    - Scannable: Use clear sections and formatting
    - Concise: Maximum impact with minimum words
    - Strategic: Focus on high-level insights
    - Actionable: Include key takeaways
    - Complete: Can stand alone without other documents
  </key_principles>
</output_requirements>

Generate a professional executive summary that captures the essence of the book in a format that's easy to scan and remember.`;
  }

  buildReferencePrompt(input: AnalysisInput): string {
    const template = templates.getGenreTemplate(input.genre, 'reference');

    return `You are an expert book analyst creating a quick reference guide for "${input.bookTitle}" by ${input.author}.

This is a practical, day-to-day reference tool for ${input.audience}. Think: cheatsheet, field guide, or quick-lookup resource.

<analysis_context>
  <genre>${input.genre}</genre>
  <purpose>${input.purpose}</purpose>
  <audience>${input.audience}</audience>
  ${input.specificContext ? `<specific_context>${input.specificContext}</specific_context>` : ''}
</analysis_context>

${this.getGenreGuidance(input.genre)}

<output_requirements>
  <document_type>quick_reference</document_type>
  <format>markdown</format>
  <style>concise_and_practical</style>

  <template_structure>
${template}
  </template_structure>

  <design_principles>
    - Quick: Easy to scan and find information
    - Practical: Tools and tips you can use immediately
    - Organized: Logical grouping of related concepts
    - Memorable: Key points that stick
    - Portable: Works well as a printed reference
  </design_principles>
</output_requirements>

Generate a highly practical quick reference guide optimized for daily use and quick lookups.`;
  }

  private getGenreGuidance(genre: string): string {
    const guidance: Record<string, string> = {
      technical: `
<genre_guidance>
  For technical books:
  - Include code examples in proper markdown code blocks
  - Focus on implementation patterns and best practices
  - Explain common pitfalls and debugging strategies
  - Reference version-specific considerations when relevant
  - Include practical exercises or challenges
  - Use technical terminology appropriately but explain complex terms
  - Emphasize real-world application of concepts
</genre_guidance>`,

      philosophy: `
<genre_guidance>
  For philosophical texts:
  - Break down logical arguments clearly (premises → conclusion)
  - Define key concepts with precision
  - Explain thought experiments thoroughly
  - Show historical and intellectual context
  - Connect abstract ideas to practical implications
  - Maintain intellectual rigor while being accessible
  - Address counterarguments fairly
</genre_guidance>`,

      fiction: `
<genre_guidance>
  For fiction:
  - Analyze plot structure and narrative techniques
  - Examine character development and motivations
  - Identify themes, symbols, and literary devices
  - Discuss writing craft and style choices
  - Include cultural/historical context
  - Provide discussion questions for deeper engagement
  - Balance appreciation with critical analysis
</genre_guidance>`,

      business: `
<genre_guidance>
  For business books:
  - Extract actionable frameworks and models
  - Analyze case studies with concrete lessons
  - Focus on measurable outcomes and ROI
  - Include implementation checklists
  - Show how to adapt concepts to different contexts
  - Emphasize both strategic and tactical applications
  - Consider scalability and resource requirements
</genre_guidance>`,

      leadership: `
<genre_guidance>
  For leadership books:
  - Focus on practical, daily applications
  - Include specific behaviors and actions leaders can take
  - Connect concepts to real leadership challenges
  - Provide tools and frameworks for immediate use
  - Emphasize team performance and outcomes
  - Use clear, direct language without unnecessary jargon
  - Include self-assessment and reflection prompts
</genre_guidance>`,
    };

    return guidance[genre] || guidance.business;
  }

  private getDepthGuidance(depth: string): string {
    const guidance = {
      quick: `
<depth_guidance level="quick">
  Provide concise, high-impact analysis:
  - Focus on top 20% of concepts (80/20 rule)
  - Brief explanations (1-2 paragraphs per major point)
  - Immediate actionable takeaways
  - Skip nuanced debates unless critical
  - Optimize for fast comprehension
  - Prioritize practical over theoretical
</depth_guidance>`,

      standard: `
<depth_guidance level="standard">
  Provide balanced, thorough analysis:
  - Cover all major concepts with good detail
  - Multiple paragraphs per significant section
  - Include representative examples and applications
  - Address important nuances and edge cases
  - Balance breadth and depth appropriately
  - Mix theory with practical application
</depth_guidance>`,

      comprehensive: `
<depth_guidance level="comprehensive">
  Provide exhaustive, scholarly analysis:
  - Deep dive into every significant concept
  - Extensive examples and multiple case studies
  - Historical context and intellectual influences
  - Critical analysis and alternative perspectives
  - Connections to other works and ideas in the field
  - Advanced applications and second-order implications
  - Address debates and controversies
</depth_guidance>`,
    };

    return guidance[depth as keyof typeof guidance] || guidance.standard;
  }
}
