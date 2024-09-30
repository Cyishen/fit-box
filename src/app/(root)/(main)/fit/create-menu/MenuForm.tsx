"use client"

import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import { ChangeEvent, useState } from "react"


export type MenuType = {
  menuId: string;
  title: string;
};

type Props = {
  type: string,
  menu: MenuType,
  setMenu: React.Dispatch<React.SetStateAction<MenuType>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};


const MenuForm = ({ type, menu, setMenu, handleSubmit }: Props) => {
  const [count, setCount] = useState(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "title") {
      setCount(value.length);
    }
    setMenu((prevWork) => {
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
          <h3 className="font-bold">{type} - 盒子名</h3>

          <div className="mt-10">
            <div className="flex items-center gap-3">
              <h3 className="font-bold">內容物</h3>
              <p className="text-xs text-gray-500">
                {count}/10 字
              </p>
            </div>

            <div className="flex gap-3 py-3">
              <input
                type="text"
                placeholder="輸入盒子名"
                onChange={handleChange}
                name="title"
                value={menu.title}
                required
                maxLength={10}
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

export default MenuForm;
