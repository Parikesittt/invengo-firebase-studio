'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing inventory trends using AI to predict low stock situations.
 *
 * analyzeInventoryTrends - A function that analyzes inventory trends and predicts low stock situations.
 * AnalyzeInventoryTrendsInput - The input type for the analyzeInventoryTrends function.
 * AnalyzeInventoryTrendsOutput - The return type for the analyzeInventoryTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeInventoryTrendsInputSchema = z.object({
  historicalData: z.string().describe('Historical inventory data in CSV format, including date, product name, and stock level.'),
  products: z.string().describe('A comma separated list of product names in the inventory.'),
});
export type AnalyzeInventoryTrendsInput = z.infer<typeof AnalyzeInventoryTrendsInputSchema>;

const AnalyzeInventoryTrendsOutputSchema = z.object({
  predictions: z.array(
    z.object({
      productName: z.string().describe('The name of the product.'),
      lowStockPrediction: z.string().describe('A prediction of when the product will be low in stock, and a confidence level.'),
    })
  ).describe('An array of predictions for each product, indicating when it will be low in stock.'),
});
export type AnalyzeInventoryTrendsOutput = z.infer<typeof AnalyzeInventoryTrendsOutputSchema>;

export async function analyzeInventoryTrends(input: AnalyzeInventoryTrendsInput): Promise<AnalyzeInventoryTrendsOutput> {
  return analyzeInventoryTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeInventoryTrendsPrompt',
  input: {schema: AnalyzeInventoryTrendsInputSchema},
  output: {schema: AnalyzeInventoryTrendsOutputSchema},
  prompt: `You are an AI inventory analyst. Analyze the provided historical inventory data to predict when products will be low in stock. Use a 90 day window for predictions.

Historical Data (CSV format):\n{{historicalData}}\n
Products: {{products}}

Provide predictions for each product, including a confidence level for each prediction. The confidence level should be described as low, medium, or high.

Ensure that the lowStockPrediction field contains both the date and the confidence level.

For example:
{
  "predictions": [
    {
      "productName": "Product A",
      "lowStockPrediction": "2024-07-15 (high confidence)",
    },
    {
      "productName": "Product B",
      "lowStockPrediction": "2024-08-01 (medium confidence)",
    },
  ]
}
`,
});

const analyzeInventoryTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeInventoryTrendsFlow',
    inputSchema: AnalyzeInventoryTrendsInputSchema,
    outputSchema: AnalyzeInventoryTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
