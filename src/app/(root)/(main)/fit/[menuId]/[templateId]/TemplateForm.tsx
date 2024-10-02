"use client"

import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import { ChangeEvent, useState } from "react"

import ExerciseList, { Exercise } from "./ExerciseList";
import { useRouter } from "next/navigation";


export const categories = ["胸", "背", "腿", "肩", "二頭", "三頭",];

export type TemplateType = {
  cardId: string;
  category: string;
  title: string;
  menuId: string;
  exercises: Exercise[];
};

type Props = {
  type: string,
  template: TemplateType,
  setTemplateState: React.Dispatch<React.SetStateAction<TemplateType>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};


const TemplateForm = ({ type, template, setTemplateState, handleSubmit }: Props) => {
  const [count, setCount] = useState(0);
  const router = useRouter(); 

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "title") {
      setCount(value.length);
    }
    setTemplateState((prevWork) => {
      return {
        ...prevWork,
        [name]: value,
      }
    });
  };

  return (
    <div className='flex py-10'>
      <Wrapper className="mb-14">
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-2xl">
          <div className="flex justify-between">
            <Button size='sm' onClick={() => router.back()} className='font-bold'>返回</Button>

            <h3 className="font-bold">{type}</h3>

            <Button size='sm' className='font-bold'>保存</Button>
          </div>

          <div className="mt-5">
            <h3 className="font-bold">訓練的部位</h3>
            <div className="flex gap-3 py-3 flex-wrap">
              {categories?.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className={`cursor-pointer py-1 px-5 text-sm rounded-full ${template.category === item ? "bg-black text-white" : "bg-white hover:bg-gray-200"}`}
                  onClick={() => {
                    setTemplateState({ ...template, category: item });
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-3">
              <h3 className="font-bold">模板名</h3>
              <p className="text-xs text-gray-500">
                {count}/20 字
              </p>
            </div>

            <div className="flex gap-3 py-3">
              <input
                type="text"
                placeholder="輸入模板名"
                onChange={handleChange}
                name="title"
                value={template.title}
                required
                maxLength={20}
                className="border rounded-lg px-4 py-3 text-sm font-bold focus:outline-none w-full placeholder:text-sm"
              />
            </div>
          </div>

          {/* TODO: 添加動作 */}
          <div className="mt-5">
            <ExerciseList
              exercises={template.exercises || []}
              setTemplateState={setTemplateState} 
              template={template}
            />
          </div>
        </form>
      </Wrapper>
    </div>
  );
};

export default TemplateForm;
