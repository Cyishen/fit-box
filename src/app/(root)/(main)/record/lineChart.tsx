"use client"


import React from 'react'
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const categories = ["胸", "背", "腿", "肩", "二頭", "三頭"];

const LineChart = () => {
  const data = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    datasets: [
      {
        label: '重量',
        data: [12, 19, 18, 20, 22, 27, 15, 32, 20, 40, 38, 45],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '每次總重量',
      },
    },
  };

  return (
    <div className='flex flex-col bg-white px-2 py-1 pb-3 rounded-lg'>
      <div>
        <div className="flex overflow-x-scroll py-2">
          <div className="flex gap-3">
            {categories.map((item, index) => (
              <button
                key={index}
                type="button"
                className={`flex items-center  cursor-pointer py-1 px-5 text-sm bg-gray-100 whitespace-nowrap rounded-full`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='text-sm mt-1'>1月-12月</div>

      {/* todo: 曲線圖 */}
      <div className='w-full h-52 mt-2 border rounded-lg px-1'>
        <Line data={data} options={options} />
      </div>
    </div>
  )
}

export default LineChart;
