'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating performance reports.
 *  It takes a JSON string of dashboard data and returns a summary of key performance indicators (KPIs).
 *  - generatePerformanceReport - A function that generates a performance report.
 *  - GeneratePerformanceReportInput - The input type for the generatePerformanceReport function.
 *  - GeneratePerformanceReportOutput - The return type for the generatePerformanceReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePerformanceReportInputSchema = z.object({
  dashboardData: z
    .string()
    .describe(
      'A JSON string containing dashboard data with key performance indicators.'
    ),
});
export type GeneratePerformanceReportInput = z.infer<typeof GeneratePerformanceReportInputSchema>;

const GeneratePerformanceReportOutputSchema = z.object({
  summary: z.string().describe('A summary of key performance indicators.'),
});
export type GeneratePerformanceReportOutput = z.infer<typeof GeneratePerformanceReportOutputSchema>;

export async function generatePerformanceReport(
  input: GeneratePerformanceReportInput
): Promise<GeneratePerformanceReportOutput> {
  return generatePerformanceReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePerformanceReportPrompt',
  input: {schema: GeneratePerformanceReportInputSchema},
  output: {schema: GeneratePerformanceReportOutputSchema},
  prompt: `You are an expert business analyst.

You will analyze the provided dashboard data and generate a summary of key performance indicators (KPIs), highlighting areas of success and areas needing improvement.

Dashboard Data:
{{{dashboardData}}}

Summary:`,
});

const generatePerformanceReportFlow = ai.defineFlow(
  {
    name: 'generatePerformanceReportFlow',
    inputSchema: GeneratePerformanceReportInputSchema,
    outputSchema: GeneratePerformanceReportOutputSchema,
  },
  async input => {
    try {
      // Attempt to parse the dashboard data as JSON; if it fails, report the error
      JSON.parse(input.dashboardData);
    } catch (e: any) {
      throw new Error(
        `Invalid dashboard data JSON: ${(e as Error).message}`
      );
    }
    const {output} = await prompt(input);
    return output!;
  }
);
