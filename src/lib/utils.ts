import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const authFormSchema = (type: string) => z.object({
  // sign up
  userName: type === 'sign-in'
    ? z.string().optional()
    : z.string()
      .trim()
      .min(2, { message: '最少2個字' })
      .max(20, { message: '最多20個字' })
      .regex(/^\S+$/, { message: '不能包含空格' }),
  // both
  email: z.string().email({ message: '輸入正確email' }),
  password: type === 'sign-in'
    ? z.string().min(1, { message: '輸入密碼' })
    : z.string().min(6, { message: '最少6個數字' }),
})
