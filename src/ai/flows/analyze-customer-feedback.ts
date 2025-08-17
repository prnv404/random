'use server';

/**
 * @fileOverview An AI flow for analyzing customer feedback.
 *
 * - analyzeCustomerFeedback - Analyzes feedback for sentiment and actionable insights.
 * - AnalyzeFeedbackInput - The input type for the analyzeCustomerFeedback function.
 * - AnalyzeFeedbackOutput - The return type for the analyzeCustomerFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFeedbackInputSchema = z.object({
  serviceName: z.string().describe('The name of the service being reviewed.'),
  employeeName: z.string().describe('The name of the employee who provided the service.'),
  feedbackText: z.string().describe('The raw text of the customer\'s feedback.'),
});
export type AnalyzeFeedbackInput = z.infer<typeof AnalyzeFeedbackInputSchema>;

const AnalyzeFeedbackOutputSchema = z.object({
  sentiment: z
    .enum(['Positive', 'Negative', 'Neutral'])
    .describe('The overall sentiment of the feedback.'),
  keyPositives: z
    .array(z.string())
    .describe('A list of key positive points mentioned in the feedback.'),
  keyNegatives: z
    .array(z.string())
    .describe('A list of key negative points or areas for improvement.'),
  actionableSuggestion: z
    .string()
    .describe('A concrete suggestion for the business owner based on the feedback.'),
});
export type AnalyzeFeedbackOutput = z.infer<typeof AnalyzeFeedbackOutputSchema>;

export async function analyzeCustomerFeedback(
  input: AnalyzeFeedbackInput
): Promise<AnalyzeFeedbackOutput> {
  return analyzeCustomerFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCustomerFeedbackPrompt',
  input: {schema: AnalyzeFeedbackInputSchema},
  output: {schema: AnalyzeFeedbackOutputSchema},
  prompt: `You are an expert business analyst for a local service center. Your task is to analyze customer feedback to provide actionable insights for the business owner.

Analyze the following customer feedback regarding the "{{serviceName}}" service, which was handled by "{{employeeName}}".

Feedback:
"{{{feedbackText}}}"

Based on the feedback, provide the following analysis:
1.  Determine the overall sentiment (Positive, Negative, or Neutral).
2.  Identify the key positive points mentioned. If none, return an empty array.
3.  Identify the key negative points or areas where the service could be improved. If none, return an empty array.
4.  Provide one single, actionable suggestion for the business owner to improve their service or commend the employee.
`,
});

const analyzeCustomerFeedbackFlow = ai.defineFlow(
  {
    name: 'analyzeCustomerFeedbackFlow',
    inputSchema: AnalyzeFeedbackInputSchema,
    outputSchema: AnalyzeFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
