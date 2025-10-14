// src/core/prompt-builder.ts

import { AnalysisInput } from '../types';
import * as templates from '../templates';

export class PromptBuilder {
  // Hardcoded user persona for context-specific analysis
  private readonly USER_PERSONA = {
    role: 'Senior Executive',
    focus: 'Leadership Development',
    context: 'Startup/Scale-up',
    description: 'Senior executive focused on leadership development in startup and scale-up environments'
  };

  buildDetailedAnalysisPrompt(input: AnalysisInput): string {
    const template = templates.getGenreTemplate(input.genre, 'detailed');

    return `You are an expert book analyst specializing in ${input.genre} books. Your task is to create a comprehensive, detailed analysis specifically for a ${this.USER_PERSONA.role} focused on ${this.USER_PERSONA.focus} in ${this.USER_PERSONA.context} environments.

<reader_profile>
  <role>${this.USER_PERSONA.role}</role>
  <focus_area>${this.USER_PERSONA.focus}</focus_area>
  <organizational_context>${this.USER_PERSONA.context}</organizational_context>
  <key_challenges>
    - Scaling teams and organizations rapidly
    - Building high-performance leadership cultures
    - Managing founder-to-executive transitions
    - Developing leadership capability at all levels
    - Navigating growth-stage pressures and constraints
  </key_challenges>
</reader_profile>

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
    <contextual_specificity>
      - Write for ${this.USER_PERSONA.context} context specifically, not generic organizations
      - Use startup/scale-up specific terminology and examples
      - Address founder-CEO, VP-level, and emerging leader challenges
      - Reference fast-growth constraints: limited resources, compressed timelines, rapid change
      - Connect every concept to specific ${this.USER_PERSONA.context} scenarios
    </contextual_specificity>

    <psychological_depth>
      - Explore underlying fears, anxieties, and identity dynamics driving behavior
      - Address the emotional and psychological dimensions, not just mechanical techniques
      - Name the inner experience of leadership challenges (anxiety, impostor syndrome, control needs)
      - Connect concepts to personal transformation, not just skill acquisition
      - Reveal the "why we resist" alongside "what to do"
    </psychological_depth>

    <practical_immediacy>
      - Every concept must answer "What do I do Monday morning?"
      - Provide specific, concrete actions not abstract principles
      - Include decision frameworks, daily practices, and conversation scripts
      - Front-load practical value - make insights instantly applicable
      - Distinguish between quick-wins and long-term capability building
    </practical_immediacy>

    <intellectual_rigor>
      - Maintain high analytical standards and conceptual clarity
      - Define terms precisely, build arguments logically
      - Acknowledge complexity, nuance, and context-dependency
      - Present frameworks as tools for thinking, not universal prescriptions
      - Include appropriate caveats, limitations, and when approaches don't apply
    </intellectual_rigor>

    <integration_orientation>
      - Show how concepts connect to other leadership domains
      - Bridge individual, team, and organizational levels
      - Link to complementary frameworks and ideas
      - Help reader build coherent mental models, not isolated techniques
      - Position insights within broader leadership development journey
    </integration_orientation>
  </quality_standards>
</output_requirements>

${input.bookContent ? `\n<book_content>\n${input.bookContent}\n</book_content>\n` : ''}

Generate the detailed analysis following the exact template structure. Use proper markdown formatting with headers, lists, code blocks (if applicable), and emphasis where appropriate. Be thorough and insightful.`;
  }

  buildSummaryPrompt(input: AnalysisInput): string {
    const template = templates.getGenreTemplate(input.genre, 'summary');

    return `You are an expert book analyst creating a concise executive summary of "${input.bookTitle}" by ${input.author}, specifically for a ${this.USER_PERSONA.role} focused on ${this.USER_PERSONA.focus} in ${this.USER_PERSONA.context} environments.

<reader_profile>
  <role>${this.USER_PERSONA.role}</role>
  <focus_area>${this.USER_PERSONA.focus}</focus_area>
  <organizational_context>${this.USER_PERSONA.context}</organizational_context>
</reader_profile>

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

  <quality_standards>
    - Context-specific: Write for ${this.USER_PERSONA.context} leaders, not generic audiences
    - Psychologically-informed: Include emotional/identity dimensions, not just mechanics
    - Immediately actionable: Front-load practical value and "do Monday" clarity
    - Intellectually rigorous: Precise definitions, logical structure, appropriate nuance
    - Scannable: Clear sections, visual hierarchy, easy to parse quickly
    - Complete: Can stand alone without other documents
  </quality_standards>
</output_requirements>

Generate a professional executive summary that captures the essence of the book for startup/scale-up leaders. Focus on insights most relevant to rapid growth, team scaling, and leadership development challenges.`;
  }

  buildReferencePrompt(input: AnalysisInput): string {
    const template = templates.getGenreTemplate(input.genre, 'reference');

    return `You are an expert book analyst creating a quick reference guide for "${input.bookTitle}" by ${input.author}, specifically for a ${this.USER_PERSONA.role} focused on ${this.USER_PERSONA.focus} in ${this.USER_PERSONA.context} environments.

<reader_profile>
  <role>${this.USER_PERSONA.role}</role>
  <focus_area>${this.USER_PERSONA.focus}</focus_area>
  <organizational_context>${this.USER_PERSONA.context}</organizational_context>
  <use_case>Daily field reference for leadership moments and decisions</use_case>
</reader_profile>

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

  <quality_standards>
    - Context-specific: ${this.USER_PERSONA.context} scenarios and terminology throughout
    - Immediately usable: Checklists, scripts, frameworks for in-the-moment application
    - Psychologically-aware: Address inner states and emotional dynamics, not just actions
    - Scannable: Find what you need in 10 seconds under pressure
    - Portable: Works as printed pocket reference or phone screenshot
    - Complete: Self-contained tool requiring no other resources
  </quality_standards>
</output_requirements>

Generate a highly practical field guide optimized for daily leadership moments in fast-growth environments. Think: "tool you pull out before a difficult conversation" or "checklist you review when facing a pattern."`;
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
  For leadership books in ${this.USER_PERSONA.context} context:
  - Focus on practical, daily applications for scaling organizations
  - Include specific behaviors and actions startup/scale-up leaders can take
  - Connect concepts to real leadership challenges in fast-growth environments
  - Address the psychological dimension: fears, anxieties, identity dynamics
  - Explore what makes concepts difficult to implement (resistance, discomfort)
  - Provide tools and frameworks for immediate use under resource constraints
  - Emphasize both team performance and leader capability development
  - Use clear, direct language without unnecessary jargon
  - Include self-assessment and reflection prompts
  - Show how concepts apply differently at different growth stages
  - Address founder-to-executive transitions explicitly when relevant
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
