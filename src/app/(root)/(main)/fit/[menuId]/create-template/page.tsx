"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Form, { TemplateType } from './Form'
import { useTemplateStore } from '@/lib/store'


const CreateCard = ({ params }: { params: { menuId: string } }) => {
  const { menuId } = params;

  const router = useRouter()

  const [template, setTemplate] = useState<TemplateType>({
    cardId:"",
    category: "",
    title: "",
    menuId,
  })

  const addTemplate = useTemplateStore((state) => state.addTemplate);

  const generateShortId = () => {
    return Math.random().toString(36).substring(2, 6);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTemplate: TemplateType = {
      cardId: generateShortId(), 
      category: template.category,
      title: template.title,
      menuId,
    };

    addTemplate(newTemplate)
    router.push("/fit")
  };

  return (
    <Form
      type="新增"
      template={template}
      setTemplateState={setTemplate}
      handleSubmit={handleSubmit}
    />
  )
}

export default CreateCard