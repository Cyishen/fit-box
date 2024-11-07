"use client"


import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTemplateStore } from '@/lib/store'
import TemplateForm from '../TemplateForm'

import { useSession } from 'next-auth/react'
import { upsertTemplate } from '@/actions/user-create'
// import { getTemplateById } from '@/actions/user-create'

import { usePracticeModal } from '@/lib/use-practice-modal';

const UpdateTemplate = ({ params }: { params: { menuId: string, templateId: string } }) => {
  const { menuId, templateId } = params;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession()
  const userId = session?.user?.id

  // 本地
  const templates = useTemplateStore((state) => state.templates);
  const existingTemplate = templates.find(template => template.templateId === templateId);
  const editTemplate = useTemplateStore((state) => state.editTemplate);
  
  // TODO*測試透過 dataAllTemplateSession 取得exercise, 加快顯示速度
  const { dataAllTemplateSession } = usePracticeModal();
  const findTemplateById = dataAllTemplateSession.find(item => item.templateId === templateId);


  const [template, setTemplate] = useState<TemplateType>({
    userId: userId || "Guest",
    menuId: menuId,
    templateId: templateId,
    templateCategory: "",
    templateTitle: "",
    exercises: [],
  });

  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      try {
        if (userId && templateId) {
          //  TODO* 測試透過 dataAllTemplateSession, 加快載入速度, 顯示template內容, 
          setTemplate(findTemplateById as TemplateType);

          // 原本抓資料庫, 顯示template內容
          // const fetchedTemplate = await getTemplateById(templateId);
          // setTemplate(prevTemplate => ({
          //   ...prevTemplate,
          //   exercises: fetchedTemplate?.exercises || [],
          //   templateTitle: fetchedTemplate?.templateTitle || '',
          //   templateCategory: fetchedTemplate?.templateCategory || '',
          // }));
        } else if (existingTemplate) {
          setTemplate(existingTemplate);
        }
      } catch (error) {
        console.error("Failed to fetch template or exercises", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [existingTemplate, findTemplateById, templateId, userId]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userId) {
      // 資料庫
      await upsertTemplate(template)
    } else {
      // 本地
      if (template) {
        const editTemplateData: TemplateType = {
          ...template,
          templateCategory: template.templateCategory,
          templateTitle: template.templateTitle,
          exercises: template.exercises || [],
        };
        editTemplate(template.templateId ?? '', editTemplateData);
      }
    }
    router.push("/fit");
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
      isPending={isLoading}
    />
  )
}

export default UpdateTemplate;
