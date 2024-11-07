"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TemplateForm from '../TemplateForm'
import { useTemplateStore } from '@/lib/store'

import { useSession } from 'next-auth/react'
import { getExerciseByTemplateId, upsertTemplate } from '@/actions/user-create'


const CreateTemplate = ({ params }: { params: { menuId: string; templateId: string } }) => {
  const { menuId, templateId } = params;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession()
  const userId = session?.user?.id

  // 本地
  const { templates, addTemplate, editTemplate } = useTemplateStore(state => state);
  const existingTemplate = templates.find(template => template.templateId === templateId);


  const [template, setTemplate] = useState<TemplateType>({
    userId: userId || "Guest",
    menuId,
    templateId: templateId,
    templateCategory: "胸",
    templateTitle: "未命名模板🗒︎",
    exercises: [],
  });

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        if (userId && templateId) {
          // 資料庫
          const exercises = await getExerciseByTemplateId(templateId);

          setTemplate(prevTemplate => ({
            ...prevTemplate,
            exercises: exercises,
          }));
        } else if (existingTemplate) {
          // 本地
          setTemplate(existingTemplate);
        }
      } catch (error) {
        console.error("Failed to fetch template", error);
      }
    };

    fetchExercises();
  }, [existingTemplate, templateId, userId]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      if (userId) {
        // 資料庫
        await upsertTemplate(template)

      } else {
        // 本地
        const updatedTemplate: TemplateType = {
          ...template,
        };

        if (existingTemplate) {
          editTemplate(templateId, updatedTemplate);
        } else {
          addTemplate(updatedTemplate);
        }
      }
      router.push("/fit");
    } catch (error) {
      console.log('伺服器忙碌中, 請稍後再試', error)
    }

    setIsLoading(false);
  };

  return (
    <TemplateForm
      type="新增"
      template={template}
      setTemplateState={setTemplate}
      handleSubmit={handleSubmit}
      isPending={isLoading}
    />
  )
}

export default CreateTemplate