"use client"

import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react"



type Props = {
  type: string,
  menu: MenuType,
  setMenu: React.Dispatch<React.SetStateAction<MenuType>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading?: boolean;
};

const MenuForm = ({ type, menu, setMenu, handleSubmit, isLoading }: Props) => {
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
          <div className="flex items-center">
            <div
              onClick={() => router.back()}
              className='p-2 rounded-full w-8 h-8 cursor-pointer bg-white hover:bg-gray-200 flex justify-center items-center'
            >
              <ChevronLeft size={16} />
            </div>

            <h3 className="font-bold pl-2">{type}</h3>
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
                placeholder="來取名吧 🤔"
                onChange={handleChange}
                name="title"
                value={menu.title}
                required
                maxLength={20}
                className="w-full rounded-md border px-3 py-2 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 placeholder:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end mt-10">
            <Button disabled={isLoading} className='flex w-full md:w-fit'>建立</Button>
          </div>
        </form>
      </Wrapper>
    </div>
  );
};

export default MenuForm;
