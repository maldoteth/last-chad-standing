import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ArrowLeft } from 'lucide-react';

const PreOrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('session_id');
    setSessionId(id);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-black/50 border border-gray-600/50 rounded-lg p-8 text-center backdrop-blur-md">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-exo text-2xl font-bold mb-2">Pre-Order Successful!</h1>
            <p className="text-slate-400">Thank you for your pre-order. You'll receive a confirmation email shortly.</p>
          </div>

          {sessionId && (
            <div className="mb-6 p-4 bg-gray-800/50 rounded border border-gray-600/30">
              <p className="text-sm text-slate-300">Order ID:</p>
              <p className="text-xs text-slate-400 font-mono break-all">{sessionId}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full bg-primary hover:bg-primary/90 font-exo font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreOrderSuccess;