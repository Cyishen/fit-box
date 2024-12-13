"use client"

import { Button } from '@/components/ui/button'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { EllipsisVertical, Trash2, Check } from 'lucide-react'

import { Switch } from '@/components/ui/switch'
import { useTemplateStore } from '@/lib/store'
import { upsertExercise } from '@/actions/user-create'
import { useSession } from 'next-auth/react'


interface SetProps {
  exercise: TemplateExerciseType,
  sets: TemplateSetType[],
  movementId: string,
  onUpdateSets: (movementId: string, updatedSets: TemplateSetType[]) => void
  setTemplateState: React.Dispatch<React.SetStateAction<TemplateType>>

  templateId: string,
  isSingleWeight?: boolean;
}

interface InputProps {
  leftWeight: string;
  rightWeight: string;
  repetitions: string;
  totalWeight: number;
}

const ExerciseSet = ({ setTemplateState, exercise, sets, movementId, onUpdateSets, templateId, isSingleWeight: initialIsSingleWeight = false }: SetProps) => {
  const [dynamicSets, setDynamicSets] = useState<TemplateSetType[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [saveIcon, setSaveIcon] = useState(false);

  const { data: session } = useSession()
  const userId = session?.user?.id

  // 用戶沒登入
  const { templates, editTemplate } = useTemplateStore();
  const findLocal = templates.find(template => template.id === templateId);

  // 切換開關處理
  const [isSingleWeight, setIsSingleWeight] = useState(initialIsSingleWeight);
  // const updateExerciseData = (checked: boolean, targetExercise: TemplateExerciseType) => {
  //   return {
  //     ...targetExercise,
  //     isSingleWeight: checked,
  //     templateSets: targetExercise.templateSets.map(set => ({
  //       ...set,
  //       rightWeight: checked ? 0 : set.rightWeight,
  //       totalWeight: checked
  //         ? set.leftWeight * set.repetitions
  //         : (set.leftWeight + set.rightWeight) * set.repetitions,
  //     })),
  //   };
  // };

  const handleSwitchChange = async (checked: boolean) => {
    setIsSingleWeight(checked);

    // const updatedExercise = updateExerciseData(checked, exercise);

    const updatedExercise = {
      ...exercise,
      isSingleWeight: checked,
      templateSets: exercise.templateSets.map(set => {
        if(set.movementId === movementId){
          return {
            ...set,
            rightWeight: checked ? 0 : set.rightWeight,
            totalWeight: checked
              ? set.leftWeight * set.repetitions
              : (set.leftWeight + set.rightWeight) * set.repetitions
          }
        }
      })
    }

    try {
      if (userId) {
        // 切換後, 更新資料庫
        await upsertExercise([updatedExercise] as TemplateExerciseType[], templateId);

        // 更新父組件狀態
        // setTemplateState(prevTemplate => {
        //   const updatedExercises = prevTemplate.templateExercises.map(ex =>
        //     ex.movementId === movementId ? updatedExercise : ex
        //   );
        //   return { ...prevTemplate, templateExercises: updatedExercises };
        // });


        setTemplateState(prevTemplate => {
          // 更新 templateExercises
          const updatedExercises = prevTemplate.templateExercises.map(ex =>
            ex.movementId === movementId
              ? {
                ...ex,
                isSingleWeight: checked,
                templateSets: ex.templateSets.map(set => ({
                  ...set,
                  rightWeight: checked ? 0 : set.rightWeight,
                  totalWeight: checked
                    ? set.leftWeight * set.repetitions
                    : (set.leftWeight + set.rightWeight) * set.repetitions
                })),
              }
              : ex
          );

          return {
            ...prevTemplate,
            templateExercises: updatedExercises
          };
        });
      } else {
        // 用戶沒登入, 本地更新
        if (findLocal) {
          const updatedTemplate = {
            ...findLocal,
            templateExercises: findLocal.templateExercises.map(exercise => {
              if (exercise.movementId === movementId) {
                return {
                  ...exercise,
                  isSingleWeight: checked,
                  templateSets: exercise.templateSets.map(set => ({
                    ...set,
                    rightWeight: checked ? 0 : set.rightWeight,
                    totalWeight: checked
                      ? set.leftWeight * set.repetitions
                      : (set.leftWeight + set.rightWeight) * set.repetitions
                  })),
                };
              }
              return exercise;
            }),
          };
          editTemplate(templateId, updatedTemplate);
        }
        
        // if (findLocal) {
        //   const updatedTemplate = {
        //     ...findLocal,
        //     templateExercises: findLocal.templateExercises.map(ex =>
        //       ex.movementId === movementId ? updatedExercise : ex
        //     ),
        //   };
        //   editTemplate(templateId, updatedTemplate);
        // }
      }
    } catch (error) {
      console.error('更新失敗', error);
      setIsSingleWeight(!checked);
    }
  };

  // 輸入框渲染
  const [inputValues, setInputValues] = useState<InputProps[]>([]);
  useEffect(() => {
    if (sets.length > 0) {
      setDynamicSets(sets);

      const newInputValues = sets.map(set => ({
        leftWeight: set.leftWeight.toString(),
        rightWeight: set.rightWeight.toString(),
        repetitions: set.repetitions.toString(),
        totalWeight: set.totalWeight,
      }));
      setInputValues(newInputValues);

    } else {
      setDynamicSets([{
        leftWeight: 0, rightWeight: 0, repetitions: 0, totalWeight: 0,
        id: '',
        movementId: movementId,
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
      movementId: movementId,
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
                  <p className='absolute top-0 left-1 text-[10px] text-muted-foreground'>
                    {isSingleWeight ? '單重' : '左'}
                  </p>

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

                <div className={`relative w-fit rounded-md ${isSingleWeight ? 'hidden' : ''}`}>
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

                  <div className="w-12 h-10 bg-gray-100 rounded-md px-1 pt-3 pb-1 text-md font-bold flex justify-end items-center">
                    {set.totalWeight === 0 ? '' : set.totalWeight.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* 刪除按鈕 小視窗 */}
              <div
                className='flex items-center justify-center hover:bg-gray-100 min-w-8 h-8 rounded-full relative cursor-pointer'
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
          <div className='mt-2 flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <Button variant='outline' type='button' onClick={handleAddSet}>
                新增一組
              </Button>

              <div className='flex items-center gap-1'>
                <Switch checked={isSingleWeight} onCheckedChange={handleSwitchChange} />
                <p className='text-[10px] text-gray-500'>單重設定</p>
              </div>
            </div>

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
