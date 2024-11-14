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

  // TODO*方式二,測試透過 dataAllTemplate 取得exercise, 加快圖片顯示速度
  const { dataAllTemplate } = usePracticeModal();
  const findTemplate = dataAllTemplate.find(item => item.id === templateId);


  const [template, setTemplate] = useState<TemplateType>({
    userId: userId || "Guest",
    menuId: menuId,
    templateId: templateId,
    templateCategory: "",
    templateTitle: "",
    templateExercises: [],
  });

  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      try {
        if (userId) {
          // TODO:方式二, 測試dataAllTemplate
          if (findTemplate) {
            setTemplate(findTemplate)
          }
          // 方式一抓資料庫資料, 刷新網頁正常
          // const fetchedTemplate = await getTemplateById(templateId);
          // if (fetchedTemplate) {
          //   setTemplate(fetchedTemplate);
          // } else {
          //   console.log("Template not found");
          // }
        } else {
          // 本地
          if (existingTemplate) {
            setTemplate(existingTemplate);
          }
        }
      } catch (error) {
        console.error("Failed to fetch template", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [existingTemplate, findTemplate, templateId, userId]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      if (userId) {
        // 資料庫
        await upsertTemplate(template as TemplateType);
      } else {
        // 本地
        if (template) {
          const editTemplateData: TemplateType = {
            ...template,
            templateCategory: template.templateCategory,
            templateTitle: template.templateTitle,
            templateExercises: template.templateExercises || [],
          };
          editTemplate(template.templateId ?? '', editTemplateData);
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
      type="編輯"
      template={template}
      setTemplateState={setTemplate}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  )
}

export default UpdateTemplate;
