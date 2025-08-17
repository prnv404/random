'use server';

/**
 * @fileOverview A customer insights generator AI agent.
 *
 * - generateCustomerInsights - A function that handles the generation of customer insights.
 * - GenerateCustomerInsightsInput - The input type for the generateCustomerInsights function.
 * - GenerateCustomerInsightsOutput - The return type for the generateCustomerInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCustomerInsightsInputSchema = z.object({
  customerHistory: z
    .string()
    .describe("The customer's past interactions and service usage."),
  customerPreferences: z
    .string()
    .describe("The customer's stated and inferred preferences."),
  recentInteractions: z
    .string()
    .describe('Details of the customer’s most recent interactions.'),
});
export type GenerateCustomerInsightsInput = z.infer<typeof GenerateCustomerInsightsInputSchema>;

const GenerateCustomerInsightsOutputSchema = z.object({
  suggestedServices: z
    .string()
    .describe('Services that might be relevant to the customer.'),
  potentialIssues: z
    .string()
    .describe('Potential issues that should be addressed proactively.'),
  overallSentiment: z
    .string()
    .describe('The overall sentiment of the customer based on their data.'),
});
export type GenerateCustomerInsightsOutput = z.infer<typeof GenerateCustomerInsightsOutputSchema>;

export async function generateCustomerInsights(
  input: GenerateCustomerInsightsInput
): Promise<GenerateCustomerInsightsOutput> {
  return generateCustomerInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCustomerInsightsPrompt',
  input: {schema: GenerateCustomerInsightsInputSchema},
  output: {schema: GenerateCustomerInsightsOutputSchema},
  prompt: `You are an AI assistant designed to analyze customer data and provide insights for customer service representatives.

  Analyze the following customer information to identify potential issues and suggest relevant services.

  Customer History: {{{customerHistory}}}
  Customer Preferences: {{{customerPreferences}}}
  Recent Interactions: {{{recentInteractions}}}

  Based on this information, provide insights into suggested services, potential issues, and the overall sentiment of the customer.
  `,
});

const generateCustomerInsightsFlow = ai.defineFlow(
  {
    name: 'generateCustomerInsightsFlow',
    inputSchema: GenerateCustomerInsightsInputSchema,
    outputSchema: GenerateCustomerInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
