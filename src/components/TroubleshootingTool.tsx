'use client';

import React, { useState } from 'react';
import { smartTroubleshootingDiagnosis, SmartTroubleshootingDiagnosisOutput } from '@/ai/flows/smart-troubleshooting-diagnosis';
import { Device } from '@/app/lib/network-data';
import { Sparkles, Loader2, Search, CheckCircle2, AlertCircle, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface TroubleshootingToolProps {
  devices: Device[];
}

export function TroubleshootingTool({ devices }: TroubleshootingToolProps) {
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<SmartTroubleshootingDiagnosisOutput | null>(null);
  const { toast } = useToast();

  const handleDiagnosis = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await smartTroubleshootingDiagnosis({
        networkDevices: devices.map(d => ({
          name: d.name,
          ipAddress: d.ipAddress,
          status: d.status,
          manufacturer: d.manufacturer,
          model: d.model,
          firmware: d.firmware,
          ssid: d.wireless24?.ssid || d.wireless5?.ssid
        })),
        overallInternetStatus: 'ONLINE',
        userProblemDescription: problem
      });
      setDiagnosis(result);
    } catch (error: any) {
      console.error('Diagnosis failed:', error);
      toast({
        variant: "destructive",
        title: "Diagnostic Error",
        description: "Failed to communicate with the troubleshooting engine. Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card mt-12 mb-8 border-primary/10 !rounded-[2.5rem]">
      <CardHeader className="border-b border-primary/10 bg-primary/5 p-8">
        <CardTitle className="flex items-center gap-3 font-headline text-2xl text-primary tracking-tight">
          <Terminal className="w-6 h-6" />
          NETPULSE SMART DIAGNOSTIC TERMINAL
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-headline tracking-widest text-muted-foreground uppercase">
                Describe Connectivity Issue
              </label>
              <Textarea
                placeholder="e.g., WiFi signal is dropping or certain devices are slow..."
                className="bg-background/50 border-primary/20 focus:border-primary focus:ring-primary/20 min-h-[140px] rounded-2xl text-lg font-body p-4 transition-all duration-300"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleDiagnosis}
              disabled={loading}
              className="w-full py-7 text-lg font-headline tracking-widest bg-primary hover:bg-primary/90 text-background rounded-2xl transition-all duration-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ANALYZING NODES...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  INITIATE SYSTEM SCAN
                </>
              )}
            </Button>
          </div>

          {/* Result Section */}
          <div className="relative min-h-[350px] border border-primary/10 rounded-2xl bg-black/40 p-6 overflow-hidden">
            {!diagnosis && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-4 opacity-40">
                <Terminal className="w-16 h-16" />
                <p className="font-code text-sm tracking-widest">AWAITING INPUT COMMANDS...</p>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-20 bg-background/40 backdrop-blur-sm">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <div className="space-y-2 text-center">
                  <p className="font-headline tracking-widest text-primary animate-pulse">SYSTEM ANALYZING</p>
                  <p className="text-xs font-code text-muted-foreground">POLLING NETWORK HEARTBEATS...</p>
                </div>
              </div>
            )}

            {diagnosis && !loading && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <h4 className="font-headline text-primary font-bold tracking-wider">DIAGNOSIS COMPLETE</h4>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-bold tracking-tighter">
                    ACCURACY: {(diagnosis.confidenceScore * 100).toFixed(0)}%
                  </div>
                </div>

                <Alert className="bg-primary/5 border-primary/20 rounded-2xl">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-primary font-headline tracking-wide">Summary</AlertTitle>
                  <AlertDescription className="text-sm opacity-90">{diagnosis.summary}</AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <p className="text-xs font-headline tracking-widest text-muted-foreground uppercase">Issue Identified</p>
                  <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-rose-300 text-sm font-medium">
                    {diagnosis.rootCause}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-headline tracking-widest text-muted-foreground uppercase">Recommended Steps</p>
                  <div className="space-y-2">
                    {diagnosis.troubleshootingSteps.map((step) => (
                      <div key={step.stepNumber} className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all duration-300 group">
                        <div className="w-7 h-7 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 text-primary text-[10px] font-bold">
                          {step.stepNumber}
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}