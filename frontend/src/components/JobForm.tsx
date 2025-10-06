import { memo, useState, useCallback, type FormEvent, type ChangeEvent } from 'react';
import { Building2, Rocket, Users, ChevronDown } from 'lucide-react';

import { useDebounce } from '../hooks/useDebounce.js';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor.js';
import { validateJobTitle } from '../utils/validation.js';
import { UI_CONFIG, JobSeniority, CompanyType } from '../constants/index.js';
import type { GenerateJobRequest } from '../types/api.js';

interface JobFormProps {
  readonly onSubmit: (request: GenerateJobRequest) => void;
  readonly isLoading: boolean;
}

export const JobForm = memo<JobFormProps>(({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState<string>('');
  const [seniority, setSeniority] = useState<JobSeniority>(JobSeniority.MID);
  const [companyType, setCompanyType] = useState<CompanyType | ''>('');
  const [error, setError] = useState<string>('');

  const debouncedTitle = useDebounce(title, UI_CONFIG.DEBOUNCE_MS);
  const performance = usePerformanceMonitor('JobForm');

  // Validate title on debounced change
  useState(() => {
    if (debouncedTitle) {
      const validation = validateJobTitle(debouncedTitle);
      setError(validation.error || '');
    }
  });

  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value); // Allow spaces and special characters
  }, []);

  const handleSeniorityChange = useCallback((e: ChangeEvent<HTMLSelectElement>): void => {
    setSeniority(e.target.value as JobSeniority);
  }, []);

  const handleCompanyTypeChange = useCallback((e: ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value;
    setCompanyType(value === '' ? '' : (value as CompanyType));
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault();

      const validation = validateJobTitle(title);
      if (!validation.isValid) {
        setError(validation.error!);
        return;
      }

      const request: GenerateJobRequest = {
        title: title.trim(),
        seniority,
        ...(companyType && { company_type: companyType }),
      };

      onSubmit(request);
    },
    [title, seniority, companyType, onSubmit],
  );

  if (import.meta.env.DEV && performance.lastRenderTime > 16) {
    console.warn(`JobForm slow render: ${performance.lastRenderTime.toFixed(2)}ms`);
  }

  return (
    <form onSubmit={handleSubmit} className="formContainer">
      <div className="inputGroup">
        <label htmlFor="jobTitle" className="inputLabel">
          Job Title *
        </label>
        <input
          id="jobTitle"
          type="text"
          value={title}
          onChange={handleTitleChange}
          maxLength={UI_CONFIG.MAX_TITLE_LENGTH}
          placeholder="e.g., Senior React Developer"
          disabled={isLoading}
          className={`inputField ${error ? 'inputError' : ''}`}
          autoComplete="off"
          aria-describedby={error ? 'title-error' : undefined}
        />
        {error && (
          <span id="title-error" className="errorText" role="alert">
            {error}
          </span>
        )}
      </div>

      <div className="formRow">
        <div className="inputGroup">
          <label htmlFor="seniority" className="inputLabel">
            Seniority Level
          </label>
          <div className="selectWrapper">
            <select
              id="seniority"
              value={seniority}
              onChange={handleSeniorityChange}
              disabled={isLoading}
              className="selectField"
            >
              <option value={JobSeniority.JUNIOR}>Junior (1-3 years)</option>
              <option value={JobSeniority.MID}>Mid-level (3-5 years)</option>
              <option value={JobSeniority.SENIOR}>Senior (5+ years)</option>
            </select>
            <ChevronDown className="selectIcon" />
          </div>
        </div>

        <div className="inputGroup">
          <label htmlFor="companyType" className="inputLabel">
            Company Type
          </label>
          <div className="selectWrapper">
            <div className="companyIcon">
              {companyType === CompanyType.STARTUP && (
                <Rocket className="w-4 h-4 text-orange-500" />
              )}
              {companyType === CompanyType.CORPORATE && (
                <Building2 className="w-4 h-4 text-blue-600" />
              )}
              {companyType === CompanyType.AGENCY && <Users className="w-4 h-4 text-emerald-500" />}
              {!companyType && <Building2 className="w-4 h-4 text-slate-400" />}
            </div>
            <select
              id="companyType"
              value={companyType}
              onChange={handleCompanyTypeChange}
              disabled={isLoading}
              className="selectField companySelect"
            >
              <option value="">Any Company</option>
              <option value={CompanyType.STARTUP}>Startup</option>
              <option value={CompanyType.CORPORATE}>Corporate</option>
              <option value={CompanyType.AGENCY}>Agency</option>
            </select>
            <ChevronDown className="selectIcon" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !!error || !title.trim()}
        className="submitButton"
      >
        {isLoading ? 'Generating...' : 'Generate Description'}
      </button>
    </form>
  );
});

JobForm.displayName = 'JobForm';
