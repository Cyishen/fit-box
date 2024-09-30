"use client"

import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import { ChangeEvent, useState } from "react"


export const categories = ["胸", "背", "腿", "肩", "二頭", "三頭",];

export type TemplateType = {
  cardId: string;
  category: string;
  title: string;
  menuId: string;
};

type Props = {
  type: string,
  template: TemplateType,
  setTemplateState: React.Dispatch<React.SetStateAction<TemplateType>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};


const Form = ({ type, template, setTemplateState, handleSubmit }: Props) => {
  const [count, setCount] = useState(0);
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
    <div className='flex pt-10'>
      <Wrapper>
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-2xl">
          <h3 className="font-bold">{type} - 盒子內容</h3>

          <div className="mt-5">
            <h3 className="font-bold">訓練部位</h3>
            <div className="flex gap-3 py-3 flex-wrap">
              {categories?.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className={`cursor-pointer py-1 px-5 text-sm rounded-full ${template.category === item ? "bg-black text-white" : "bg-white"}`}
                  onClick={() => {
                    setTemplateState({ ...template, category: item });
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center gap-3">
              <h3 className="font-bold">內容物</h3>
              <p className="text-xs text-gray-500">
                {count}/20 字
              </p>
            </div>

            <div className="flex gap-3 py-3">
              <input
                type="text"
                placeholder="輸入內容物"
                onChange={handleChange}
                name="title"
                value={template.title}
                required
                maxLength={20}
                className="border rounded-lg px-4 py-2 focus:outline-none w-full placeholder:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button className='flex w-full md:w-fit'>建立</Button>
          </div>
        </form>
      </Wrapper>
    </div>
  );
};

export default Form;
