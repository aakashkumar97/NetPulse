
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // In a real development environment, this would throw to the Next.js overlay.
      // Here we surface it as a destructive toast for clarity.
      toast({
        variant: "destructive",
        title: "Firestore Permission Denied",
        description: error.message,
      });
      
      // Re-throw to trigger development overlay if supported
      console.error(error);
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
