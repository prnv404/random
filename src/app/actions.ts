'use server';

import { generatePerformanceReport } from '@/ai/flows/generate-performance-report';
import { generateCustomerInsights } from '@/ai/flows/generate-customer-insights';
import { generateSpeech } from '@/ai/flows/text-to-speech-flow';
import { analyzeCustomerFeedback } from '@/ai/flows/analyze-customer-feedback';
import type { AnalyzeFeedbackInput } from '@/ai/flows/analyze-customer-feedback';

export const getPerformanceReport = async (dashboardData: any) => {
  try {
    const report = await generatePerformanceReport({
      dashboardData: JSON.stringify(dashboardData, null, 2),
    });
    return { success: true, data: report };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate performance report.' };
  }
};

export const getCustomerInsights = async (customerData: {
  history: string;
  preferences: string;
  recentInteractions: string;
}) => {
  try {
    const insights = await generateCustomerInsights({
      customerHistory: customerData.history,
      customerPreferences: customerData.preferences,
      recentInteractions: customerData.recentInteractions,
    });
    return { success: true, data: insights };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate customer insights.' };
  }
};

export const getSpeechAudio = async (text: string) => {
    try {
        const audio = await generateSpeech(text);
        return { success: true, data: audio };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to generate speech audio.' };
    }
}

export const getFeedbackAnalysis = async (feedbackData: AnalyzeFeedbackInput) => {
    try {
        const analysis = await analyzeCustomerFeedback(feedbackData);
        return { success: true, data: analysis };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to analyze feedback.' };
    }
}
