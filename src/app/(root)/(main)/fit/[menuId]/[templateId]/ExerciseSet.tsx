"use client"

import { Button } from '@/components/ui/button'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { EllipsisVertical, Trash2, Check } from 'lucide-react'

interface SetProps {
  sets: TemplateSetType[],
  movementId: string,
  onUpdateSets: (movementId: string, updatedSets: TemplateSetType[]) => void
}

interface InputProps {
  leftWeight: string;
  rightWeight: string;
  repetitions: string;
  totalWeight: number;
}

const ExerciseSet = ({ sets, movementId, onUpdateSets }: SetProps) => {
  const [dynamicSets, setDynamicSets] = useState<TemplateSetType[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [saveIcon, setSaveIcon] = useState(false);

  const [inputValues, setInputValues] = useState<InputProps[]>([]);

  useEffect(() => {
    if (sets.length > 0) {
      setDynamicSets(sets);

      const newInputValues = sets.map(set => ({
        leftWeight: set.leftWeight.toString(),
        rightWeight: set.rightWeight.toString(),
        repetitions: set.repetitions.toString(),
        totalWeight: set.totalWeight
      }));
      setInputValues(newInputValues);

    } else {
      setDynamicSets([{
        leftWeight: 0, rightWeight: 0, repetitions: 0, totalWeight: 0,
        id: '',
        movementId: movementId
      }]);

      setInputValues([{
        leftWeight: '',
        rightWeight: '',
        repetitions: '',
        totalWeight: 0,
      }]);
    }
  }, [sets, movementId]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedSets = [...dynamicSets];

    const isValidNumber = /^\d*\.?\d{0,1}$/.test(value);

    if (!isValidNumber && value !== '') {
      return;
    }

    // 更新輸入框顯示值
    const updatedInputValues = [...inputValues];
    updatedInputValues[index] = {
      ...updatedInputValues[index],
      [name]: value
    };
    setInputValues(updatedInputValues);

    // 儲存時, 轉為數字
    updatedSets[index] = {
      ...updatedSets[index],
      [name]: value === '' ? 0 : Number(value)
    };

    const leftWeight = Number(updatedSets[index].leftWeight.toString()) || 0;
    const rightWeight = Number(updatedSets[index].rightWeight.toString()) || 0;
    updatedSets[index].totalWeight = (leftWeight + rightWeight) * updatedSets[index].repetitions;

    setDynamicSets(updatedSets);
  };

  // 新增一組，確保新組的類型正確
  const handleAddSet = () => {
    setDynamicSets([...dynamicSets, {
      leftWeight: 0, rightWeight: 0, repetitions: 0, totalWeight: 0,
      id: '',
      movementId: movementId
    }]);
  };

  // 刪除指定的組
  const handleRemoveSet = (index: number) => {
    const updatedSets = dynamicSets.filter((_, i) => i !== index);
    setDynamicSets(updatedSets);
  };

  // 保存組數據
  const handleSaveSetsIcon = () => {
    onUpdateSets(movementId, dynamicSets);

    setSaveIcon(true);

    setTimeout(() => {
      setSaveIcon(false);
    }, 1000);
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

  return (
    <div className='flex w-full mt-4 px-2'>
      <div className='w-full'>
        <div className='flex flex-col'>
          {dynamicSets.map((set, index) => (
            <div key={index} className='flex items-center justify-between mb-2'>
              <div className='flex gap-2 items-center h-10'>
                <div className='bg-gray-100 w-8 h-full rounded-md flex justify-center items-center'>
                  <p className='font-bold text-sm'>{index + 1}</p>
                </div>

                <div className='relative w-fit rounded-md'>
                  <p className='absolute top-0 left-1 text-[10px] text-muted-foreground'>左</p>

                  <input
                    type="text"
                    name="leftWeight"
                    maxLength={4}
                    value={inputValues[index]?.leftWeight ?? ''}
                    inputMode='decimal'
                    step="0.1"
                    onChange={(e) => handleChange(index, e)}
                    onFocus={(e) => (e.target.style.backgroundColor = '#dbeafe')}
                    onBlur={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                    className="w-12 bg-gray-100 rounded-md px-1 pt-3 pb-1 text-md font-bold focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 text-end"
                  />
                </div>

                <div className='relative w-fit rounded-md'>
                  <p className='absolute top-0 left-1 text-[10px] text-muted-foreground'>右</p>

                  <input
                    type="text"
                    name="rightWeight"
                    maxLength={4}
                    value={inputValues[index]?.rightWeight ?? ''}
                    inputMode='decimal'
                    onChange={(e) => handleChange(index, e)}
                    onFocus={(e) => (e.target.style.backgroundColor = '#dbeafe')}
                    onBlur={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                    className="w-12 bg-gray-100 rounded-md px-1 pt-3 pb-1 text-md font-bold focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 text-end"
                  />
                </div>

                <div className='relative w-fit rounded-md'>
                  <p className='absolute top-0 left-1 text-[10px] text-muted-foreground'>次數</p>

                  <input
                    type="text"
                    name="repetitions"
                    maxLength={2}
                    value={inputValues[index]?.repetitions ?? ''}
                    inputMode='decimal'
                    onChange={(e) => handleChange(index, e)}
                    onFocus={(e) => (e.target.style.backgroundColor = '#dbeafe')}
                    onBlur={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                    className="w-10 bg-gray-100 rounded-md px-2 pt-3 pb-1 text-md font-bold focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 text-end"
                  />
                </div>

                <div className='relative rounded-md'>
                  <p className='absolute top-0 left-1 text-[10px] text-muted-foreground'>重量 kg</p>

                  <div className="w-12 h-10 bg-gray-100 rounded-md px-1 pt-3 pb-1 text-md font-bold flex justify-end">
                    {set.totalWeight === 0 ? '' : set.totalWeight.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* TODO:刪除按鈕 */}
              <div
                className='flex items-center justify-center hover:bg-gray-100 min-w-10 h-10 rounded-full relative cursor-pointer'
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <EllipsisVertical className='w-3' />

                {openIndex === index && (
                  <div
                    id="outside-close"
                    className="absolute -left-10 top-0 translate-y-0 w-fit h-fit bg-black text-white rounded-md shadow-lg"
                  >
                    <button
                      onClick={() => {
                        handleRemoveSet(index);
                        setOpenIndex(null);
                      }}
                      className='flex p-2 rounded-md duration-300'
                    >
                      <Trash2 className='w-5' />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* 新增一組按鈕 */}
          <div className='mt-2 flex justify-between'>
            <Button variant='outline' type='button' onClick={handleAddSet}>
              新增一組
            </Button>

            {!saveIcon ? (
              <Button size='sm' type='button' onClick={handleSaveSetsIcon}>
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
