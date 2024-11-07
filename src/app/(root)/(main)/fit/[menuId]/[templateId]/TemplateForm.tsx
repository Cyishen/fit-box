"use client"

import { Button } from "@/components/ui/button";
import { ChangeEvent, useEffect, useState } from "react"

import ExerciseList from "./ExerciseList";
import { useRouter } from "next/navigation";

export const categories = ["胸", "背", "腿", "肩", "二頭", "三頭",];


type Props = {
  type: string,
  template: TemplateType,
  setTemplateState: React.Dispatch<React.SetStateAction<TemplateType>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isPending: boolean
};

const TemplateForm = ({ type, template, setTemplateState, handleSubmit, isPending }: Props) => {
  const [count, setCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setCount(template.templateTitle.length);
  }, [template.templateTitle]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "templateTitle") {
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
    <div className='flex pb-0 sm:pt-10 bg-gray-100 sm:bg-white'>
      <div className="forMobile sm:forWeb">
        <form onSubmit={handleSubmit} className="bg-gray-100 sm:rounded-2xl">
          <div className="p-4">
            <div className="flex justify-between">
              <Button size='sm' onClick={() => router.back()} className='font-bold'>返回</Button>

              <h3 className="font-bold">{type}</h3>

              <Button size='sm' className='font-bold'>保存</Button>
            </div>

            <div className="mt-3 sm:mt-5">
              <h3 className="font-bold">訓練的部位</h3>
              <div className="flex gap-3 py-2 flex-wrap">
                {categories?.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`cursor-pointer py-1 px-5 text-sm rounded-full ${template.templateCategory === item ? "bg-black text-white" : "bg-white hover:bg-gray-200"}`}
                    onClick={() => {
                      setTemplateState({ ...template, templateCategory: item });
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 sm:mt-5">
              <div className="flex items-center gap-3">
                <h3 className="font-bold">模板名</h3>
                <p className="text-xs text-gray-500">
                  {count}/20
                </p>
              </div>

              <div className="flex gap-3 py-1">
                <input
                  type="text"
                  placeholder="來取名吧 🤔"
                  onChange={handleChange}
                  name="templateTitle"
                  value={template.templateTitle}
                  required
                  maxLength={20}
                  className="w-full rounded-md border px-3 py-1 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 placeholder:text-sm"
                />
              </div>
            </div>
          </div>

          {/* TODO: 添加動作 */}
          <div className="h-full">
            <ExerciseList
              exercises={template.exercises || []}
              setTemplateState={setTemplateState}
              template={template}
              isPending={isPending}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateForm;
