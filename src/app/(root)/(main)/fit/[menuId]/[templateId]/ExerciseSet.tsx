"use client"

import { Button } from '@/components/ui/button'
import React, { ChangeEvent, useState } from 'react'
import { Set } from './ExerciseList'

interface SetProps {
  sets: Set[], 
  exerciseId: string, 
  onUpdateSets: (exerciseId: string, updatedSets: Set[]) => void 
}

const ExerciseSet = ({ sets, exerciseId, onUpdateSets }: SetProps ) => {
  const [dynamicSets, setDynamicSets] = useState<Set[]>(
    sets.length > 0 ? sets : [{ leftWeight: 0, rightWeight: 0, repetitions: 0, totalWeight: 0 }]
  );

  // 處理每個輸入框的變更，將值轉換為數字類型
  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedSets = [...dynamicSets];
    
    // 確保所有輸入都轉換為數字
    const newValue = Number(value) || 0; // 如果轉換失敗則使用0
    
    updatedSets[index] = { 
      ...updatedSets[index], 
      [name]: newValue, 
      totalWeight: (newValue + updatedSets[index].rightWeight) * updatedSets[index].repetitions // 根據需求更新totalWeight計算
    };
  
    // 更新左側或右側重量時，需要重新計算totalWeight
    updatedSets[index].totalWeight = (updatedSets[index].leftWeight + updatedSets[index].rightWeight) * updatedSets[index].repetitions;
  
    setDynamicSets(updatedSets);
  };
  

  // 新增一組，確保新組的類型正確
  const handleAddSet = () => {
    setDynamicSets([...dynamicSets, { leftWeight: 0, rightWeight: 0, repetitions: 0, totalWeight: 0 }]);
  };

  // 刪除指定的組
  const handleRemoveSet = (index: number) => {
    const updatedSets = dynamicSets.filter((_, i) => i !== index);
    setDynamicSets(updatedSets);
  };

  // 保存組數據
  const handleSaveSets = () => {
    onUpdateSets(exerciseId, dynamicSets);
  };

  return (
    <div className='flex w-full my-2 px-2 mb-5'>
      <div className='w-full'>
        <div className='flex flex-col'>
          {dynamicSets.map((set, index) => (
            <div key={index} className='flex items-center gap-3 my-2'>
              <div className='bg-gray-100 w-10 h-10 rounded-md flex justify-center items-center'>
                <p className='font-bold'>{index + 1}</p>
              </div>

              <div className='relative w-fit rounded-md'>
                <p className='absolute top-0 left-2 text-[10px]'>左</p>

                <input
                  type="text"
                  name="leftWeight"
                  maxLength={3}
                  value={set.leftWeight || ''}
                  onChange={(e) => handleChange(index, e)}
                  className="w-12 bg-gray-100 rounded-md px-2 pt-3 pb-1 text-md font-bold focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 text-end"
                />
              </div>

              <div className='relative w-fit rounded-md'>
                <p className='absolute top-0 left-2 text-[10px]'>右</p>

                <input
                  type="text"
                  name="rightWeight"
                  maxLength={3}
                  value={set.rightWeight || ''}
                  onChange={(e) => handleChange(index, e)}
                  className="w-12 bg-gray-100 rounded-md px-2 pt-3 pb-1 text-md font-bold focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 text-end"
                />
              </div>

              <div className='relative w-fit rounded-md'>
                <p className='absolute top-0 left-2 text-[10px]'>次數</p>

                <input
                  type="text"
                  name="repetitions"
                  maxLength={3}
                  value={set.repetitions || ''}
                  onChange={(e) => handleChange(index, e)}
                  className="w-10 bg-gray-100 rounded-md px-2 pt-3 pb-1 text-md font-bold focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 text-end"
                />
              </div>

              {/* <div>
                <p> = </p>
              </div> */}

              <div className='relative rounded-md'>
                <p className='absolute top-0 left-2 text-[10px]'>重量 kg</p>

                <div className="w-12 h-10 bg-gray-100 rounded-md px-2 pt-3 pb-1 text-md font-bold flex justify-end">
                  {set.leftWeight * set.repetitions}
                </div>
              </div>

              {/* 刪除按鈕 */}
              <div>
                <Button variant='destructive' size='sm' type='button' onClick={() => handleRemoveSet(index)}>
                  刪除
                </Button>
              </div>
            </div>
          ))}

          {/* 新增一組按鈕 */}
          <div className='mt-5 flex justify-between'>
            <Button variant='outline' type='button' onClick={handleAddSet}>
              新增一組
            </Button>

            <Button type='button' onClick={handleSaveSets}>
              保存
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExerciseSet;
