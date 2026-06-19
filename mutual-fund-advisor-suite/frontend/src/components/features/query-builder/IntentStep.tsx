import React from 'react';
import { MagnifyingGlass, BookOpen, CalendarBlank, ArrowRight } from '@phosphor-icons/react';
import { Card } from '../../ui';
import { useQueryBuilderStore } from '../../../stores/queryBuilderStore';
import { useNavigate } from 'react-router-dom';

export const IntentStep: React.FC = () => {
  const setIntent = useQueryBuilderStore((state) => state.setIntent);
  const setStep = useQueryBuilderStore((state) => state.setStep);
  const navigate = useNavigate();

  const handleSelect = (intent: 'specific_question' | 'learn' | 'advisor') => {
    setIntent(intent);
    if (intent === 'advisor') {
      navigate('/schedule');
    } else {
      setStep(2);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="text-center mb-6">
        <h2 className="font-heading text-[24px] font-bold text-neutral-900 mb-2">What brings you here today?</h2>
        <p className="text-[15px] text-neutral-600">Select an option to get started.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-[600px] mx-auto">
        {/* Card 1 */}
        <div onClick={() => handleSelect('specific_question')} className="cursor-pointer group">
          <Card variant="feature" hover className="flex items-center justify-between p-5 transition-colors border border-transparent group-hover:border-brand-teal w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                <MagnifyingGlass size={24} weight="bold" className="text-brand-teal" />
              </div>
              <div className="text-left">
                <h3 className="font-heading text-[16px] font-semibold text-neutral-900 mb-1">
                  I have a specific question about a fund or fee
                </h3>
                <p className="text-[13px] text-neutral-500 leading-relaxed">
                  Ask about NAV, exit loads, expense ratios, or specific schemes.
                </p>
              </div>
            </div>
            <ArrowRight size={20} className="text-neutral-300 group-hover:text-brand-teal transition-colors shrink-0" />
          </Card>
        </div>

        {/* Card 2 */}
        <div onClick={() => handleSelect('learn')} className="cursor-pointer group">
          <Card variant="feature" hover className="flex items-center justify-between p-5 transition-colors border border-transparent group-hover:border-brand-navy w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center shrink-0">
                <BookOpen size={24} weight="bold" className="text-brand-navy" />
              </div>
              <div className="text-left">
                <h3 className="font-heading text-[16px] font-semibold text-neutral-900 mb-1">
                  I want to learn about mutual funds
                </h3>
                <p className="text-[13px] text-neutral-500 leading-relaxed">
                  Understand categories, SIPs, taxation, and how mutual funds work.
                </p>
              </div>
            </div>
            <ArrowRight size={20} className="text-neutral-300 group-hover:text-brand-navy transition-colors shrink-0" />
          </Card>
        </div>

        {/* Card 3 */}
        <div onClick={() => handleSelect('advisor')} className="cursor-pointer group">
          <Card variant="feature" hover className="flex items-center justify-between p-5 transition-colors border border-transparent group-hover:border-brand-saffron w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF7ED] flex items-center justify-center shrink-0">
                <CalendarBlank size={24} weight="bold" className="text-brand-saffron" />
              </div>
              <div className="text-left">
                <h3 className="font-heading text-[16px] font-semibold text-neutral-900 mb-1">
                  I need to speak to an investment advisor
                </h3>
                <p className="text-[13px] text-neutral-500 leading-relaxed">
                  Book a free consultation with a SEBI-registered advisor.
                </p>
              </div>
            </div>
            <ArrowRight size={20} className="text-neutral-300 group-hover:text-brand-saffron transition-colors shrink-0" />
          </Card>
        </div>
      </div>
    </div>
  );
};
