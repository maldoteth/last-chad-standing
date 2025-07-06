
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

const TokenDistributionChart = () => {
  const isMobile = useIsMobile();
  const data = [
    { name: 'Public', value: 30, amount: '30B coins', color: '#3b82f6' },
    { name: 'Team', value: 15, amount: '15B coins', color: '#06b6d4' },
    { name: 'Foundation', value: 15, amount: '15B coins', color: '#eab308' },
    { name: 'Growth Fund', value: 15, amount: '15B coins', color: '#22c55e' },
    { name: 'Ecosystem Rewards', value: 10, amount: '10B coins', color: '#f97316' },
    { name: 'LP', value: 10, amount: '10B coins', color: '#8b5cf6' },
    { name: 'Advisors', value: 5, amount: '5B coins', color: '#ec4899' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-gray-700">{data.value}% ({data.amount})</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    // Use a consistent radius that centers labels in the middle of each slice
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for very small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle"
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-96 md:h-[28rem] mb-8">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={isMobile ? 80 : 120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={80}
            formatter={(value, entry: any) => (
              <span style={{ color: entry.color }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenDistributionChart;
