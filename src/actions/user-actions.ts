"use server"

import { authFormSchema } from "@/lib/utils";
import { z } from "zod";
import { signIn } from "@/auth";

import { hash } from 'bcryptjs';
import { prismaDb } from "@/lib/db";
import { getUserByEmail } from "@/data/queries";


const loginSchema = authFormSchema('sign-in');
const signUpSchema = authFormSchema('sign-up');

export const signUpAuth = async (values: z.infer<typeof signUpSchema>) => {
  const validateValue = signUpSchema.safeParse(values);

  if (!validateValue.success) {
    return { error: "帳號或密碼錯誤" };
  }

  const { name, email, password } = validateValue.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email 已被註冊" };
  }

  const hashedPassword = await hash(password, 10);

  const newUser = await prismaDb.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return { success: "註冊成功", user: newUser };
};


export const loginAuth = async (values: z.infer<typeof loginSchema>) => {
  const validateValue = loginSchema.safeParse(values);

  if (!validateValue.success) {
    return { error: "帳號或密碼錯誤" };
  }

  const { email, password } = validateValue.data;

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: "登入成功" };
  } catch (error) {
    console.error(error);
    return { error: "登入失敗，請稍後再試" };
  }
};
