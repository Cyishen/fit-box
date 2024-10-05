"use client"

import { Button } from '@/components/ui/button'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Set } from './ExerciseList'
import { EllipsisVertical, Trash2, Check } from 'lucide-react'

interface SetProps {
  sets: Set[],
  exerciseId: string,
  onUpdateSets: (exerciseId: string, updatedSets: Set[]) => void
}

const ExerciseSet = ({ sets, exerciseId, onUpdateSets }: SetProps) => {
  const [dynamicSets, setDynamicSets] = useState<Set[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    if (sets.length > 0) {
      setDynamicSets(sets);
    } else {
      setDynamicSets([{ leftWeight: 0, rightWeight: 0, repetitions: 0, totalWeight: 0 }]);
    }
  }, [sets]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedSets = [...dynamicSets];

    const newValue = Number(value) || 0;

    updatedSets[index] = {
      ...updatedSets[index],
      [name]: newValue,
    };

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isOutside = !target.closest('#outside-close') && openIndex !== null;

      if (isOutside) {
        setOpenIndex(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openIndex]);

  // 保存組數據
  const handleSaveSets = () => {
    onUpdateSets(exerciseId, dynamicSets);

    setHasSave(true);

    setTimeout(() => {
      setHasSave(false);
    }, 500);
  };

  return (
    <div className='flex w-full mt-4 px-2'>
      <div className='w-full'>
        <div className='flex flex-col'>
          {dynamicSets.map((set, index) => (
            <div key={index} className='flex items-center gap-3 mb-2'>
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

              <div className='relative rounded-md'>
                <p className='absolute top-0 left-2 text-[10px]'>重量 kg</p>

                <div className="w-12 h-10 bg-gray-100 rounded-md px-2 pt-3 pb-1 text-md font-bold flex justify-end">
                  {set.totalWeight}
                </div>
              </div>

              {/* 刪除按鈕 */}
              <div
                className='flex items-center justify-center hover:bg-gray-100 min-w-10 h-10 rounded-full relative ml-auto cursor-pointer'
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <EllipsisVertical className='w-3' />

                {openIndex === index && (
                  <div
                    id="outside-close"
                    className="absolute -left-10 bottom-0 w-fit h-fit bg-black text-white z-[60] rounded-md shadow-lg"
                  >
                    <div className='w-full h-full'>
                      <button
                        onClick={() => {
                          handleRemoveSet(index);
                          setOpenIndex(null);
                        }}
                        className='flex p-2 items-center gap-1 text-sm font-bold rounded-md duration-300 hover:bg-[#FF3B30]'
                      >
                        <div className='w-full h-full flex justify-center items-center'>
                          <Trash2 className='w-5' />
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* <div>
                <Button variant='destructive' size='sm' type='button' onClick={() => handleRemoveSet(index)}>
                  刪除
                </Button>
              </div> */}
            </div>
          ))}

          {/* 新增一組按鈕 */}
          <div className='mt-2 flex justify-between'>
            <Button variant='outline' type='button' onClick={handleAddSet}>
              新增一組
            </Button>

            {!hasSave ? (
              <Button size='sm' type='button' onClick={handleSaveSets}>
                保存
              </Button>
            ) : (
              <Button size='sm' type='button'>
                <Check className='w-5 text-green-300' />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExerciseSet;
