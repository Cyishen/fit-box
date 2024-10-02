"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TemplateForm, { TemplateType } from '../TemplateForm'
import { useTemplateStore } from '@/lib/store'


const CreateTemplate = ({ params }: { params: { menuId: string; templateId: string } }) => {
  const { menuId, templateId } = params;

  const router = useRouter()

  const templates = useTemplateStore(state => state.templates);
  const existingTemplate = templates.find(template => template.cardId === templateId);

  const addTemplate = useTemplateStore((state) => state.addTemplate);
  const editTemplate = useTemplateStore((state) => state.editTemplate);

  const [template, setTemplate] = useState<TemplateType>({
    cardId: templateId,
    category: "",
    title: "",
    menuId,
    exercises: [],
  });

  useEffect(() => {
    if (existingTemplate) {
      setTemplate(existingTemplate);
    }
  }, [existingTemplate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedTemplate: TemplateType = {
      ...template,
    };

    if (existingTemplate) {
      editTemplate(templateId, updatedTemplate);
    } else {
      addTemplate(updatedTemplate);
    }

    router.push("/fit");
  };

  return (
    <TemplateForm
      type="新增"
      template={template}
      setTemplateState={setTemplate}
      handleSubmit={handleSubmit}
    />
  )
}

export default CreateTemplate