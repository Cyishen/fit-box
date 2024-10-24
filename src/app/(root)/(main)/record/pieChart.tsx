"use client"


import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';


const categoryColors = {
  "胸": "#FF6B6B",
  "背": "#4ECDC4",
  "腿": "#45B7D1",
  "肩": "#96CEB4",
  "二頭": "#FFEEAD",
  "三頭": "#D4A5A5"
};

type WorkoutCategory = {
  category: string;
  totalSets: number;
  color: string;
};

// 生成今年到目前為止的模擬數據
const generateCurrentYearData = (): WorkoutCategory[] => {
  const categories = ["胸", "背", "腿", "肩", "二頭", "三頭"];
  
  // 獲取今年開始到現在的天數
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const today = new Date();
  const daysSinceStartOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

  return categories.map(category => {
    // 假設平均每週訓練該部位1-2次，每次3-5組
    const weeksElapsed = Math.floor(daysSinceStartOfYear / 7);
    const minSets = weeksElapsed * 3; // 最少每週一次，每次3組
    const maxSets = weeksElapsed * 10; // 最多每週兩次，每次5組

    return {
      category,
      totalSets: Math.floor(Math.random() * (maxSets - minSets + 1)) + minSets,
      color: categoryColors[category as keyof typeof categoryColors]
    };
  });
};

const PieChart = () => {
  const [data, setData] = useState<WorkoutCategory[]>([]);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const mockData = generateCurrentYearData();
    setData(mockData);
  }, []);

  const option: EChartsOption = {
    title: {
      text: `${currentYear}年訓練分佈`,
      subtext: '訓練組數統計',
      left: 'center',
      top: '0%',
      itemGap: 5,
      textStyle: {
        fontSize: 14
      },
      subtextStyle: {
        fontSize: 10
      }
    },
    tooltip: {
      trigger: 'item',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (params: any) => {
        const { name, value, percent } = params;
        return `${name}<br/>訓練數 ${value}組<br/>佔比 ${percent}%`;
      },
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      textStyle: {
        fontSize: 11,
        color: 'gray',
        fontWeight: 'bold',
      },
    },
    legend: {
      orient: 'horizontal',
      left: 'center',
      top: 'bottom',
      itemGap: 5,
    },
    series: [
      {
        name: '訓練分佈',
        type: 'pie',
        radius: ['30%', '60%'],
        center: ['50%', '40%'],
        top: '10%',
        avoidLabelOverlap: true,
        percentPrecision: 1,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b} \n ({d}%)',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        data: data.map(item => ({
          value: item.totalSets,
          name: item.category,
          itemStyle: {
            color: item.color
          }
        })),
      }
    ]
  };

  return (
    <div className='flex flex-col px-1 py-1 pb-3 rounded-lg border'>
      <div className="h-[300px]">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
      
      {/* 訓練統計表格 */}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">部位</th>
              <th className="px-4 py-2 text-right">訓練組數</th>
              <th className="px-4 py-2 text-right">佔比</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => {
              const totalSets = data.reduce((sum, curr) => sum + curr.totalSets, 0);
              const percentage = ((item.totalSets / totalSets) * 100).toFixed(1);
              
              return (
                <tr key={item.category} className="border-b">
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      {item.category}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right">{item.totalSets}組</td>
                  <td className="px-4 py-2 text-right">{percentage}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PieChart;