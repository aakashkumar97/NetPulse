
'use server';
/**
 * @fileOverview A Genkit flow for diagnosing home network connectivity issues and providing troubleshooting steps.
 *
 * - smartTroubleshootingDiagnosis - A function that handles the network diagnosis process.
 * - SmartTroubleshootingDiagnosisInput - The input type for the smartTroubleshootingDiagnosis function.
 * - SmartTroubleshootingDiagnosisOutput - The return type for the smartTroubleshootingDiagnosis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NetworkDeviceSchema = z.object({
  name: z.string().describe('Name of the network device (e.g., Router, Extender, GPON).'),
  ipAddress: z.string().ip({version: 'v4'}).describe('Local IP address of the device.'),
  status: z.enum(['ONLINE', 'OFFLINE']).describe('Current connectivity status of the device.'),
  manufacturer: z.string().optional().describe('Manufacturer of the device.'),
  modelNumber: z.string().optional().describe('Specific model number of the hardware.'),
  firmware: z.string().optional().describe('Firmware version of the device.'),
  ssid: z.string().optional().describe('SSID broadcast by the device, if applicable.'),
});

const SmartTroubleshootingDiagnosisInputSchema = z.object({
  networkDevices: z.array(NetworkDeviceSchema).describe('List of network devices and their statuses.'),
  overallInternetStatus: z.enum(['ONLINE', 'OFFLINE', 'UNKNOWN']).describe('Overall internet connectivity status.'),
  userProblemDescription: z.string().optional().describe('Optional description of the problem provided by the user.'),
});
export type SmartTroubleshootingDiagnosisInput = z.infer<typeof SmartTroubleshootingDiagnosisInputSchema>;

const TroubleshootingStepSchema = z.object({
  stepNumber: z.number().describe('The order of the step.'),
  description: z.string().describe('Detailed description of the troubleshooting step.'),
  actionable: z.boolean().describe('Whether the step involves an action for the user to perform.'),
});

const SmartTroubleshootingDiagnosisOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the network diagnosis.'),
  rootCause: z.string().describe('The identified root cause of the connectivity problem.'),
  troubleshootingSteps: z.array(TroubleshootingStepSchema).describe('Ordered list of actionable steps to resolve the issue.'),
  confidenceScore: z.number().min(0).max(1).describe('A confidence score (0-1) for the diagnosis.'),
});
export type SmartTroubleshootingDiagnosisOutput = z.infer<typeof SmartTroubleshootingDiagnosisOutputSchema>;

export async function smartTroubleshootingDiagnosis(
  input: SmartTroubleshootingDiagnosisInput
): Promise<SmartTroubleshootingDiagnosisOutput> {
  return smartTroubleshootingDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartTroubleshootingDiagnosisPrompt',
  input: {schema: SmartTroubleshootingDiagnosisInputSchema},
  output: {schema: SmartTroubleshootingDiagnosisOutputSchema},
  prompt: `You are an expert network troubleshooter named NetVigil AI. Your task is to analyze the provided network device status and performance data, diagnose connectivity problems, and suggest precise, actionable steps to resolve them.\n\nHere is the current network status:\nOverall Internet Status: {{{overallInternetStatus}}}\nNetwork Devices:\n{{#each networkDevices}}\n- Name: {{{this.name}}}\n  Model: {{{this.modelNumber}}}\n  IP Address: {{{this.ipAddress}}}\n  Status: {{{this.status}}}\n  {{#if this.manufacturer}}Manufacturer: {{{this.manufacturer}}}{{/if}}\n  {{#if this.firmware}}Firmware: {{{this.firmware}}}{{/if}}\n  {{#if this.ssid}}SSID: {{{this.ssid}}}{{/if}}\n{{/each}}\n\n{{#if userProblemDescription}}\nThe user has described the problem as: "{{{userProblemDescription}}}"\n{{/if}}\n\nBased on this information, diagnose the problem and provide a concise summary, the most likely root cause, and a list of actionable troubleshooting steps, along with a confidence score for your diagnosis. Ensure the steps are ordered logically and are easy for a user to follow.\n\nConsider common network issues like:\n- Router being offline (gateway issue)\n- Extender not connecting\n- GPON/ONT being offline (ISP issue)\n- Specific devices having issues while others are fine.\n\nExample scenarios:\n1. If the GPON is offline, the issue is likely with the ISP or the fiber connection.\n2. If the Router is offline but GPON is online, the issue is likely with the router itself or its connection to the GPON.\n3. If an Extender is offline but the Router is online, the issue is with the extender or its placement/connection.\n4. If all devices are online but internet status is offline, it could be a deeper ISP issue or a configuration problem.\n5. If some devices are online and others are offline, pinpoint the first point of failure in the chain.`,
});

const smartTroubleshootingDiagnosisFlow = ai.defineFlow(
  {
    name: 'smartTroubleshootingDiagnosisFlow',
    inputSchema: SmartTroubleshootingDiagnosisInputSchema,
    outputSchema: SmartTroubleshootingDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
