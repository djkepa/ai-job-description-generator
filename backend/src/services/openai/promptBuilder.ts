import type { OpenAIGenerationRequest } from './types.js';

export class PromptBuilder {
  static buildSystemPrompt(companyType?: string): string {
    const basePrompt =
      'You are a professional HR specialist who writes clear, engaging, and realistic job descriptions for hiring pages. Keep descriptions concise but comprehensive, around 150-250 words.';

    const companyStyles = {
      startup: 'Write in a casual, innovative tone that emphasizes growth and impact.',
      corporate:
        'Write in a professional, structured tone that emphasizes stability and career development.',
      agency: 'Write in a dynamic, client-focused tone that emphasizes versatility and expertise.',
    };

    return companyType && companyStyles[companyType as keyof typeof companyStyles]
      ? `${basePrompt} ${companyStyles[companyType as keyof typeof companyStyles]}`
      : basePrompt;
  }

  static buildUserPrompt(title: string, seniority?: string): string {
    const seniorityLevel = seniority || 'mid';
    const experienceMap = {
      junior: '1-3 years',
      mid: '3-5 years',
      senior: '5+ years',
    };

    return `Generate a professional English job description for the position: "${title}" (${seniorityLevel}-level, ${experienceMap[seniorityLevel as keyof typeof experienceMap]} experience). Include key responsibilities, required qualifications, and desired skills. Make it engaging and realistic.`;
  }

  static buildMessages(request: OpenAIGenerationRequest) {
    return [
      { role: 'system' as const, content: this.buildSystemPrompt(request.company_type) },
      { role: 'user' as const, content: this.buildUserPrompt(request.title, request.seniority) },
    ];
  }
}
