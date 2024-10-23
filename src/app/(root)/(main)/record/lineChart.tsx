"use client"

import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

const categories = ["胸", "背", "腿", "肩", "二頭", "三頭"] as const;
type Category = typeof categories[number];

const LineChart = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("胸");
  const [chartData, setChartData] = useState<WorkoutRecord[]>([]);

  useEffect(() => {
    // 生成過去365天的模擬數據
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 365);

    const mockData = generateMockData(activeCategory, startDate, 180);
    setChartData(mockData);
  }, [activeCategory]);


  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: function (params: any) {
        const data = params[0].data;
        return `${data[0]}<br/>總重量 ${data[1]}`;
      },
      alwaysShowContent: true,
      position: ['80%', '10%'],
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      shadowColor: 'none',
      padding: 5,
      borderWidth: 0,
      textStyle: {
        fontSize: 8,
        color: 'white',
        fontWeight: 'bold',
      },
      // axisPointer: {
      //   type: 'cross',
      //   label: {
      //     backgroundColor: 'black'
      //   }
      // },
    },
    grid: {
      left: '0%',
      right: '4%',
      bottom: '16%',
      containLabel: true
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: '{MM}/{dd}',
        hideOverlap: true,
        fontSize: 8,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: ['10%', '10%'],
      scale: true,
      name: '總重量(kg)',
      nameLocation: 'end',
      nameGap: 30,
      axisLabel: {
        formatter: '{value}k',
        fontSize: 8,
      },
      nameTextStyle: {
        align: "left",
        fontSize: 12,
      }
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 80,
        end: 100,
        height: 30
      },
      {
        type: 'slider',
        xAxisIndex: [0],
        start: 50,
        end: 100,
        zoomOnMouseWheel: 'shift'
      }
    ],
    series: [
      {
        name: activeCategory,
        data: chartData.map(item => [item.date, item.totalWeight]),
        type: 'line',
        smooth: false,
        symbol: 'circle',
        symbolSize: 5,
        sampling: 'lttb',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.5)' }, // 渐变起始颜色
                { offset: 0.7, color: 'rgba(130, 180, 250, 0.7)' },
                { offset: 1, color: 'rgba(255, 255, 255, 0.5)' }  // 渐变结束颜色
            ],
            global: false
          }
        },
        itemStyle: {
          color: 'rgb(59, 130, 246)',
          opacity: 0.8,
        },
        lineStyle: { color: 'black', width: 0.2, type: 'solid' },
        markPoint: {
          data: [{ type: 'max', name: '最高' }],
          symbol: 'pin',
          symbolSize: 0,
          label: {
            position: 'top',
            fontWeight: 'bold',
            fontSize: 8
          }
        },
        markLine: {
          data: [{ type: 'average', name: '平均'}],
          symbol: 'none',
          silent: true,
          label: {
            position: 'insideEndBottom',
            fontWeight: 'bold',
            fontSize: 8,
          },
          lineStyle: {
            width: 0.5,
            color: 'rgba(0, 0, 0, 0.6)'
          }
        }
      }
    ]
  };


  return (
    <div className='flex flex-col px-0 py-1 pb-3 rounded-lg'>
      <div className='px-1'>
        <div className="flex overflow-x-scroll py-2">
          <div className="flex gap-3">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveCategory(item)}
                className={`flex items-center cursor-pointer py-1 px-5 text-sm 
                  ${activeCategory === item
                    ? 'bg-blue-500 text-white'
                    : 'bg-white'
                  } whitespace-nowrap rounded-full`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </div>
  );
};

export default LineChart;


// types.ts
type WorkoutRecord = {
  date: string;
  totalWeight: number;
  category: string;
};

// mockData.ts
const generateMockData = (category: string, startDate: Date, days: number): WorkoutRecord[] => {
  const data: WorkoutRecord[] = [];
  const baseWeight = Math.floor(Math.random() * 100) + 150;

  for (let i = 0; i < days; i++) {
    // 每 2-4 天生成一條記錄, 先產生 0-1內的數字, 在乘3, 再加上 2, 最後Math.floor取整數
    if (i % Math.floor(Math.random() * 3 + 2) === 0) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);

      // 在基礎重量上增加一些隨機變化, 隨機 0-40後減 20 = (-20 到 20)
      const weightVariation = Math.floor(Math.random() * 40) - 20;

      data.push({
        date: currentDate.toISOString().split('T')[0],
        totalWeight: baseWeight + weightVariation,
        category
      });
    }
  }

  return data;
};