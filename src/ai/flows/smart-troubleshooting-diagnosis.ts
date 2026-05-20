'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NetworkDeviceSchema = z.object({
  name: z.string(),
  ipAddress: z.string(),
  status: z.enum(['ONLINE', 'OFFLINE']),
  model: z.string().optional(),
  description: z.string().optional(),
});

const SmartTroubleshootingDiagnosisInputSchema = z.object({
  networkDevices: z.array(NetworkDeviceSchema),
  overallInternetStatus: z.enum(['ONLINE', 'OFFLINE', 'UNKNOWN']),
  userProblemDescription: z.string().optional(),
});
export type SmartTroubleshootingDiagnosisInput = z.infer<typeof SmartTroubleshootingDiagnosisInputSchema>;

const TroubleshootingStepSchema = z.object({
  stepNumber: z.number(),
  description: z.string(),
  actionable: z.boolean(),
});

const SmartTroubleshootingDiagnosisOutputSchema = z.object({
  summary: z.string(),
  rootCause: z.string(),
  troubleshootingSteps: z.array(TroubleshootingStepSchema),
  confidenceScore: z.number().min(0).max(1),
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
  prompt: `You are NetVigil AI, an expert specialized in this specific user's network topology:
1. ISP Entry: Nokia GPON ONU (192.168.100.1) - Manages Shop/Guest Network.
2. Home Gateway: OpenWRT Router (192.168.7.1) - Connected to Nokia LAN 1.
3. Extender: OpenWRT AP (192.168.7.2) - Connected to Home Router LAN-to-LAN for Roaming.

Analyze this status:
Internet Status: {{{overallInternetStatus}}}
Nodes:
{{#each networkDevices}}
- {{{this.name}}} ({{{this.ipAddress}}}): {{{this.status}}} - {{{this.description}}}
{{/each}}

{{#if userProblemDescription}}
User says: "{{{userProblemDescription}}}"
{{/if}}

Diagnose specific points of failure. If Nokia is down, it's an ISP issue. If Nokia is up but OpenWRT Router is down, it's the cable/port or Home Router issue. If Router is up but Extender is down, it's a roaming link issue. Give precise actionable steps.`,
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
