import { logger } from '../../utils/logger.js';
import type { OpenAIGenerationRequest, OpenAIGenerationResponse } from './types.js';

export class MockDataService {
  private static readonly descriptions = {
    'senior react developer': `We are seeking a Senior React Developer to join our dynamic engineering team. You will lead the development of modern, scalable web applications using React, TypeScript, and the latest frontend technologies.

Key Responsibilities:
• Architect and develop complex React applications with optimal performance
• Mentor junior developers and conduct code reviews
• Collaborate with product managers and designers to implement user-centric features
• Implement testing strategies and maintain high code quality standards
• Stay current with React ecosystem and modern frontend practices

Required Qualifications:
• 5+ years of experience with React and modern JavaScript/TypeScript
• Strong understanding of state management (Redux, Context API, Zustand)
• Experience with testing frameworks (Jest, React Testing Library)
• Proficiency in CSS-in-JS, styled-components, or TailwindCSS
• Knowledge of modern build tools (Vite, Webpack, Babel)

We offer competitive compensation, flexible working arrangements, and opportunities for professional growth in a collaborative environment.`,

    'frontend developer': `Join our team as a Frontend Developer and help us create exceptional user experiences with modern web technologies. You'll work on cutting-edge projects using React, TypeScript, and the latest frontend frameworks.

Key Responsibilities:
• Develop responsive and performant web applications
• Collaborate with designers to implement pixel-perfect UIs
• Write clean, maintainable, and testable code
• Optimize applications for maximum speed and scalability
• Participate in code reviews and technical discussions

Required Skills:
• 2+ years of experience with modern JavaScript/TypeScript
• Proficiency in React and modern frontend frameworks
• Understanding of CSS, HTML5, and responsive design principles
• Experience with version control systems (Git)
• Knowledge of modern build tools and development workflows

We offer competitive salary, health benefits, flexible working hours, and continuous learning opportunities in a collaborative environment.`,

    'full stack developer': `We are looking for a talented Full Stack Developer to join our growing engineering team. You'll work on both frontend and backend systems, delivering complete solutions for our products.

Key Responsibilities:
• Design and develop full-stack web applications
• Work with databases, APIs, and modern web technologies
• Collaborate with cross-functional teams on product features
• Ensure application performance, quality, and responsiveness
• Contribute to architectural decisions and technical strategies

Required Qualifications:
• 3+ years of full-stack development experience
• Proficiency in JavaScript/TypeScript, Node.js, React
• Experience with databases (SQL/NoSQL) and RESTful APIs
• Understanding of cloud services and deployment processes
• Strong problem-solving skills and attention to detail

Join us and help build the future of web applications while growing your career in a supportive, innovative environment.`,

    'backend developer': `We are seeking a Backend Developer to join our engineering team and build robust, scalable server-side applications. You'll work with modern technologies and contribute to our platform's core infrastructure.

Key Responsibilities:
• Design and implement RESTful APIs and microservices
• Work with databases and optimize query performance
• Ensure system scalability and reliability
• Collaborate with frontend developers on API integration
• Participate in code reviews and maintain code quality

Required Skills:
• 2+ years of backend development experience
• Proficiency in Node.js, Python, or similar languages
• Experience with databases (PostgreSQL, MongoDB)
• Understanding of API design and microservices architecture
• Knowledge of cloud services and deployment practices

We offer competitive compensation, professional development opportunities, and a collaborative work environment with the latest technologies.`,

    'devops engineer': `Join our team as a DevOps Engineer and help us build and maintain world-class infrastructure. You'll work on automation, deployment pipelines, and ensuring our systems run smoothly at scale.

Key Responsibilities:
• Design and maintain CI/CD pipelines
• Manage cloud infrastructure and containerized applications
• Implement monitoring and alerting systems
• Automate deployment and scaling processes
• Ensure system security and performance optimization

Required Skills:
• 3+ years of DevOps/Infrastructure experience
• Proficiency with Docker, Kubernetes, and cloud platforms (AWS/GCP/Azure)
• Experience with infrastructure as code (Terraform, CloudFormation)
• Knowledge of monitoring tools and logging systems
• Strong scripting skills (Bash, Python)

We offer excellent benefits, remote work flexibility, and the opportunity to work with cutting-edge infrastructure technologies.`,
  };

  static generateMockDescription(request: OpenAIGenerationRequest): OpenAIGenerationResponse {
    const { title, seniority, company_type } = request;
    const seniorityLevel = seniority || 'mid';

    const defaultTemplate = `We are looking for a talented ${title} to join our growing team. This ${seniorityLevel}-level position offers exciting opportunities to make a meaningful impact while working with cutting-edge technologies.

Key Responsibilities:
• Drive innovation and deliver high-quality solutions
• Collaborate effectively with cross-functional teams
• Contribute to technical decisions and architectural planning
• Mentor team members and promote best practices
• Stay updated with industry trends and emerging technologies

Required Qualifications:
• Strong technical background with relevant experience
• Excellent problem-solving and analytical skills
• Effective communication and teamwork abilities
• Passion for learning and professional development
• Experience with modern development methodologies

Join us in building the future of technology while enjoying competitive benefits, professional growth opportunities, and a collaborative work environment that values innovation and excellence.`;

    const key = title.toLowerCase();
    const description = this.descriptions[key as keyof typeof this.descriptions] || defaultTemplate;

    logger.info('Generated mock description due to API quota exceeded', {
      title,
      seniority,
      company_type,
      reason: 'quota_exceeded',
    });

    return { description, model: 'quota-fallback' };
  }
}
