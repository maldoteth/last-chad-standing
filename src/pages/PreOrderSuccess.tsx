import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PreorderData {
  id: string;
  tier_id: string;
  amount: number;
  currency: string;
  status: string;
  email: string;
  created_at: string;
}

const PreOrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [preorderData, setPreorderData] = useState<PreorderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError("No session ID found");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-preorder-payment', {
          body: { sessionId }
        });

        if (error) throw error;

        if (data.success) {
          setPreorderData(data.preorder);
        } else {
          setError("Payment verification failed");
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setError("Unable to verify payment");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const getTierName = (tierId: string) => {
    const tiers = {
      'game-only': 'Classic Edition',
      'special-edition': 'Special Edition',
      'ultimate-edition': 'Ultimate Edition'
    };
    return tiers[tierId as keyof typeof tiers] || tierId;
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center p-6">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Verifying your payment...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-black/50 border border-gray-600/50 rounded-lg p-8 text-center backdrop-blur-md">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-exo text-2xl font-bold mb-2">
              {preorderData?.status === 'paid' ? 'Pre-Order Successful!' : 'Order Received'}
            </h1>
            <p className="text-slate-400">
              {preorderData?.status === 'paid' 
                ? "Thank you for your pre-order. You'll receive a confirmation email shortly."
                : error || "Processing your order..."}
            </p>
          </div>

          {preorderData && (
            <div className="mb-6 space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-lg text-left">
                <h3 className="font-semibold mb-2">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Edition:</span>
                    <span>{getTierName(preorderData.tier_id)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount:</span>
                    <span>{formatAmount(preorderData.amount, preorderData.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className={preorderData.status === 'paid' ? 'text-green-400' : 'text-yellow-400'}>
                      {preorderData.status.charAt(0).toUpperCase() + preorderData.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-xs">{preorderData.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-300 mb-1">Order ID:</p>
                <p className="font-mono text-xs break-all text-slate-400">{preorderData.id}</p>
              </div>
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