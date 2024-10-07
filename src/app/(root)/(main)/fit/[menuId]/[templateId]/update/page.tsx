"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTemplateStore } from '@/lib/store'
import TemplateForm from '../TemplateForm'


const UpdateTemplate = ({ params }: { params: { templateId: string } }) => {
  const { templateId } = params;
  const router = useRouter();

  // Todo?: 取得zustand 所有模板, 並找出 id 一樣的模板
  const templates = useTemplateStore((state) => state.templates);
  const existingTemplate = templates.find(template => template.cardId === templateId);


  const [template, setTemplate] = useState<TemplateType>({
    cardId: "",
    category: "",
    title: "",
    menuId: "",
    exercises: [],
  });

  useEffect(() => {
    if (existingTemplate) {
      setTemplate(existingTemplate);
    }
  }, [existingTemplate]);

  const editTemplate = useTemplateStore((state) => state.editTemplate);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (template) {
      const editTemplateData: TemplateType = {
        cardId: template.cardId, 
        category: template.category,
        title: template.title,
        menuId: template.menuId,
        exercises: template.exercises || [],
      };

      editTemplate(template.cardId, editTemplateData);
      router.push("/fit");
    }
  };

  if (!template) {
    return <div>Loading...</div>
  }

  return (
    <TemplateForm
      type="編輯"
      template={template}
      setTemplateState={setTemplate}
      handleSubmit={handleSubmit}
    />
  )
}

export default UpdateTemplate;
