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
    : z.string().min(3, { message:'最少3個字' }),
  // both
  email: z.string().email({ message:'輸入正確email' }),
  password: z.string().min(6, { message:'最少6個數字' }),
})
