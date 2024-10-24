"use client";

import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

import AnimatedBackground from './AnimatedBackground';

const categories = ["胸", "背", "腿", "肩", "二頭", "三頭"] as const;
type Category = typeof categories[number];

const BarChart = () => {
  const [timeFrame, setTimeFrame] = useState<'週' | '月' | '年'>('週');
  const [chartData, setChartData] = useState<{ category: Category, count: number }[]>([]);

  useEffect(() => {
    const mockData = generateMockData(timeFrame);
    setChartData(mockData);
  }, [timeFrame]);

  const option: EChartsOption = {
    title: {
      text: "完成組數 ✅",
      subtext: '與上週期對比',
      itemGap: 5,
      top: 5,
      // left: "center",
      // textAlign: 'left',
      textStyle: {
        fontSize: 14
      },
      subtextStyle: {
        fontSize: 10
      }
    },
    // legend: {
    //   type: 'plain',
    //   show: true,
    //   top: '5%',
    // },
    tooltip: {
      trigger: 'axis',
      alwaysShowContent: true,
      position: ['70%', '3%'],
      backgroundColor: 'transparent',
      shadowColor: 'none',
      padding: 0,
      borderWidth: 0,
      textStyle: {
        fontSize: 11,
        color: 'gray',
        fontWeight: 'bold',
      },
      axisPointer: {
        type: "shadow",
      }
    },
    grid: {
      left: '0%',
      right: '1%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.map(item => item.category)
    },
    yAxis: {
      type: 'value',
      boundaryGap: ['0%', '10%'],
      // name: '組數',
      nameLocation: 'end',
      axisLabel: {
        fontSize: 8,
      },
      nameTextStyle: {
        align: "left",
        fontSize: 12,
      }
    },
    series: [
      {
        name: '本次',
        type: 'bar',
        data: chartData.map(item => item.count),
        label: {
          show: true,
          position: 'top',
          fontSize: 8,
          fontWeight: 'bold',
          // formatter: (params: { value: number }) => `${params.value}`
        },
        itemStyle: {
          color: (params: { dataIndex: number }) => {
            switch (chartData[params.dataIndex].category) {
              case '胸':
                return '#3B82F6'; // 藍色
              case '背':
                return '#4B5563'; // 灰色
              case '腿':
                return '#EF4444'; // 紅色
              case '肩':
                return '#FBBF24'; // 黃色
              case '二頭':
                return '#8B5CF6'; // 紫色
              case '三頭':
                return '#10B981'; // 綠色
              default:
                return '#000000'; // 預設顏色
            }
          }
        }
      },
      {
        name: '上次',
        type: 'bar',
        data: chartData.map(() => 50),
        label: {
          show: true,
          position: 'top',
          fontSize: 8,
          color: 'gray',
        },
        itemStyle: {
          color: 'rgba(59, 130, 246, 0.1)',
        }
      }
    ],
  };

  return (
    <div className='flex flex-col px-1 border py-1 rounded-lg'>
      <AnimatedTabsHover onChange={setTimeFrame} activeTab={timeFrame} />
      <div className='h-[300px]'>
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </div>
  );
};

export default BarChart;


// 生成假資料的函式
const generateMockData = (timeFrame: '週' | '月' | '年') => {
  const data: { category: Category, count: number }[] = [];
  const randomCounts = {
    胸: [10, 20],
    背: [8, 20],
    腿: [8, 20],
    肩: [6, 20],
    二頭: [5, 12],
    三頭: [5, 12],
  };

  categories.forEach(category => {
    let count;
    switch (timeFrame) {
      case '週':
        count = randomCounts[category][0] + Math.floor(Math.random() * (randomCounts[category][1] - randomCounts[category][0] + 1));
        break;
      case '月':
        count = Math.floor((randomCounts[category][0] + randomCounts[category][1]) / 2) * 4; // 每月
        break;
      case '年':
        count = Math.floor((randomCounts[category][0] + randomCounts[category][1]) / 2) * 52; // 每年
        break;
      default:
        count = 0;
    }
    data.push({ category, count });
  });

  return data;
};

// 動態選單
interface AnimatedTabsHoverProps {
  activeTab: '週' | '月' | '年';
  onChange: (tab: '週' | '月' | '年') => void;
}
function AnimatedTabsHover({ activeTab, onChange }: AnimatedTabsHoverProps) {
  const TABS = [
    { label: '週', icon: null },
    { label: '月', icon: null },
    { label: '年', icon: null },
  ];

  return (
    <div className='flex space-x-2 p-1 bg-slate-200 rounded-lg'>
      <AnimatedBackground
        defaultValue={activeTab}
        className='rounded-lg bg-white'
        transition={{
          type: 'spring',
          bounce: 0.2,
          duration: 0.3,
        }}
        enableHover
      >
        {TABS.map((tab) => (
          <button
            key={tab.label}
            data-id={tab.label}
            type='button'
            onClick={() => onChange(tab.label as '週' | '月' | '年')}
            className={`inline-flex h-8 w-full items-center justify-center transition-colors duration-100 ${activeTab === tab.label ? 'text-blue-500' : 'text-black'} px-2`}
          >
            <p className='flex items-center justify-center gap-1'>
              <span className='hidden md:block'>{tab.icon}</span>
              <span>{tab.label}</span>
            </p>
          </button>
        ))}
      </AnimatedBackground>
    </div>
  );
}
