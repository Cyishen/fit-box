"use client"

import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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
          <div className="flex justify-between">
            <Button size='sm' onClick={() => router.back()} className='font-bold'>返回</Button>

            <h3 className="font-bold">{type}</h3>

            <Button variant='ghost' size='sm' type="button" className='font-bold'>盒子</Button>
          </div>

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
                placeholder="來取名吧 🤔"
                onChange={handleChange}
                name="title"
                value={menu.title}
                required
                maxLength={10}
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 placeholder:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end mt-10">
            <Button className='flex w-full md:w-fit'>建立</Button>
          </div>
        </form>
      </Wrapper>
    </div>
  );
};

export default MenuForm;
