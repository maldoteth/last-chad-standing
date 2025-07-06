import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

const TokenReleaseChart = () => {
  const isMobile = useIsMobile();
  // Generate data points for 5 years (1,825 days) starting from TGE
  const generateReleaseData = () => {
    const data = [];
    const totalSupply = 100; // 100B coins
    const totalDays = 1825; // 5 years × 365 days
    
    for (let day = 0; day <= totalDays; day++) {
      const year = day / 365;
      
      // Public: 30B - 100% at TGE
      const publicTokens = 30;
      
      // Ecosystem Rewards: 10B - 20% per year daily linear
      const ecosystemTokens = Math.min(10, 10 * 0.2 * year);
      
      // LP: 10B - 100% at TGE
      const lpTokens = 10;
      
      // Team: 15B - 12 month cliff + 25% per year linear (to reach 100% in 4 years after cliff)
      let teamTokens = 0;
      if (day > 365) { // 12 months = 365 days cliff
        const yearsAfterCliff = (day - 365) / 365;
        teamTokens = Math.min(15, 15 * 0.25 * yearsAfterCliff);
      }
      
      // Advisors: 5B - 12 month cliff + 25% per year linear (to reach 100% in 4 years after cliff)
      let advisorTokens = 0;
      if (day > 365) { // 12 months = 365 days cliff
        const yearsAfterCliff = (day - 365) / 365;
        advisorTokens = Math.min(5, 5 * 0.25 * yearsAfterCliff);
      }
      
      // Airdrops: 15B - 100% at TGE
      const airdropsTokens = 15;
      
      // Foundation: 15B - 20% a year linear daily
      const foundationTokens = Math.min(15, 15 * 0.2 * year);
      
      // Create date label for X-axis display
      let dateLabel;
      if (day === 0) {
        dateLabel = 'TGE';
      } else if (day % 365 === 0) {
        const yearNum = day / 365;
        dateLabel = `Y${yearNum}`;
      } else if (day % 183 === 0) { // Every 6 months
        dateLabel = `Y${(day / 365).toFixed(1)}`;
      } else {
        dateLabel = `D${day}`;
      }
      
      data.push({
        day: day,
        date: dateLabel,
        Public: publicTokens,
        'Ecosystem Rewards': ecosystemTokens,
        LP: lpTokens,
        Team: teamTokens,
        Advisors: advisorTokens,
        Airdrops: airdropsTokens,
        Foundation: foundationTokens,
        total: publicTokens + ecosystemTokens + lpTokens + teamTokens + advisorTokens + airdropsTokens + foundationTokens
      });
    }
    
    return data;
  };

  const data = generateReleaseData();
  
  // Use all daily data points for smooth hovering experience
  const chartData = data;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-gray-700 mb-2">Total: {total.toFixed(1)}B tokens</p>
          {payload.reverse().map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value.toFixed(1)}B
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 mb-8">
      <br />
      <br />
      <h4 className="text-lg font-semibold mb-4 text-center">Token Release Schedule</h4>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={chartData} 
          margin={{ 
            top: 20, 
            right: isMobile ? 10 : 40, 
            left: isMobile ? 10 : 20, 
            bottom: 10 
          }}
        >
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            interval={0}
            tickFormatter={(value, index) => {
              // Only show TGE and yearly markers
              if (value === 'TGE') {
                return 'TGE';
              }
              if (value === 'Y1') return '1y';
              if (value === 'Y2') return '2y'; 
              if (value === 'Y3') return '3y';
              if (value === 'Y4') return '4y';
              if (value === 'Y5') return '5y';
              return '';
            }}
          />
          {!isMobile && (
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}B`}
            />
          )}
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="rect"
          />
          
          {/* Stack areas from bottom to top - logical hierarchy */}
          {/* Bottom layer: 100% TGE unlock (stable base) */}
          <Area
            type="monotone"
            dataKey="Public"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.8}
          />
          <Area
            type="monotone"
            dataKey="LP"
            stackId="1"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.8}
          />
          <Area
            type="monotone"
            dataKey="Airdrops"
            stackId="1"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.8}
          />
          
          {/* Middle layer: Linear growth from day 1 */}
          <Area
            type="monotone"
            dataKey="Ecosystem Rewards"
            stackId="1"
            stroke="#f97316"
            fill="#f97316"
            fillOpacity={0.8}
          />
          <Area
            type="monotone"
            dataKey="Foundation"
            stackId="1"
            stroke="#eab308"
            fill="#eab308"
            fillOpacity={0.8}
          />
          
          {/* Top layer: Cliff-based (delayed growth) */}
          <Area
            type="monotone"
            dataKey="Team"
            stackId="1"
            stroke="#06b6d4"
            fill="#06b6d4"
            fillOpacity={0.8}
          />
          <Area
            type="monotone"
            dataKey="Advisors"
            stackId="1"
            stroke="#ec4899"
            fill="#ec4899"
            fillOpacity={0.8}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenReleaseChart;