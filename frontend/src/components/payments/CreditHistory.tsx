import React, { useEffect, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Loader, Calendar } from 'lucide-react';
import { UserService } from '../../services/userService';
import { CreditHistory as CreditHistoryType } from '../../types/payment.types';

const CreditHistory: React.FC = () => {
  const [history, setHistory] = useState<CreditHistoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await UserService.getCreditHistory(50);
      setHistory(data);
    } catch (error) {
      console.error('Error loading credit history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'subscription_payment':
        return 'Monthly Subscription';
      case 'onetime_payment':
        return 'Credit Purchase';
      case 'visualize':
        return 'Visualization';
      case 'regenerate':
        return 'Regeneration';
      case 'refund':
        return 'Refund';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 text-[#38BDF8] animate-spin" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-16">
        <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No transaction history</h3>
        <p className="text-gray-500">Your credit transactions will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Credit History</h2>

      <div className="bg-[#112240] border border-blue-800/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0A192F] border-b border-blue-800/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Balance After
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-800/30">
              {history.map((transaction) => {
                const isPositive = transaction.amount > 0;
                
                return (
                  <tr key={transaction.id} className="hover:bg-[#1E3A5F]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {isPositive ? (
                          <ArrowUpCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <ArrowDownCircle className="h-5 w-5 text-red-400" />
                        )}
                        <div>
                          <div className="text-white font-medium">
                            {getTransactionLabel(transaction.type)}
                          </div>
                          {transaction.description && (
                            <div className="text-gray-500 text-sm">
                              {transaction.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-semibold ${
                        isPositive ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {isPositive ? '+' : ''}{transaction.amount.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white font-medium">
                        {transaction.balance_after.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                      {formatDate(transaction.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreditHistory;
