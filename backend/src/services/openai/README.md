# OpenAI Service Module

Professional modular architecture following separation of concerns principles.

## 📁 Structure

```
openai/
├── index.ts           # Public API exports
├── openaiService.ts   # Main service orchestration  
├── promptBuilder.ts   # AI prompt generation logic
├── mockDataService.ts # Fallback mock data generation
├── errorHandler.ts    # Comprehensive error handling
└── types.ts          # TypeScript definitions
```

## 🎯 Separation of Concerns

### `OpenAIService` - Main Orchestrator
- Coordinates API calls and error handling
- Manages service lifecycle and configuration
- Delegates to specialized modules

### `PromptBuilder` - AI Prompt Logic
- System and user prompt generation
- Company-type specific styling
- Seniority-level customization

### `MockDataService` - Fallback Data
- Professional job description templates
- Quota exceeded fallback logic
- Multiple job role variations

### `OpenAIErrorHandler` - Error Management
- Status code to error type mapping
- User-friendly error messages
- Logging and monitoring integration
- Fallback decision logic

## 🚀 Usage

```typescript
import { OpenAIService } from './openai';

const service = new OpenAIService();

const result = await service.generateJobDescription(
  {
    title: 'Senior React Developer',
    seniority: 'senior',
    company_type: 'startup'
  },
  abortController.signal
);
```

## 🔥 Error Handling

Handles all OpenAI API error scenarios:
- **429** - Quota exceeded → Falls back to mock data
- **401** - Invalid API key → User-friendly message  
- **500** - Server errors → Retry guidance
- Network issues → Graceful degradation

## 🏗️ Architecture Benefits

✅ **Single Responsibility** - Each class has one job  
✅ **Easy Testing** - Mock individual components  
✅ **Maintainable** - Changes isolated to specific modules  
✅ **Scalable** - Add new features without touching existing code  
✅ **Professional** - Industry-standard separation patterns
