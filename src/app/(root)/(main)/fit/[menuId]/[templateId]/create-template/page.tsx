"use client"


import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TemplateForm from '../TemplateForm'
import { useTemplateStore } from '@/lib/store'

import { useSession } from 'next-auth/react'
import { getTemplateExerciseByTemplateId, upsertTemplate } from '@/actions/user-create'



const CreateTemplate = ({ params }: { params: { menuId: string; templateId: string } }) => {
  const { menuId, templateId } = params;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession()
  const userId = session?.user?.id

  // 用戶未登入
  const { templates, addTemplate, editTemplate } = useTemplateStore(state => state);
  const localTemplate = templates.find(template => template.id === templateId);

  // 下載模板到本地: 透過 dataAllTemplate 取得exercise
  // const { dataAllTemplate, setNewDataTemplate } = usePracticeModal();
  // const findTemplate = dataAllTemplate.find(item => item.id === templateId)

  const [template, setTemplate] = useState<TemplateType>({
    id: templateId,
    userId: userId || "Guest",
    menuId,
    templateCategory: "胸",
    templateTitle: "新模板",
    templateExercises: [],
  });

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        if (userId && templateId) {
          // 原本方式, 讀取資料庫(路由跳轉, 所以會自動更新 UI), 改成bottomSheet後: 添加動作後, 需要手動刷新頁面。 
          // const exercises = await getTemplateExerciseByTemplateId(templateId);
          // setTemplate(prevTemplate => ({
          //   ...prevTemplate,
          //   templateExercises: exercises,
          // }));

          // 方式二, 傳遞setTemplate到 bottomSheet, 直接更新狀態
          await getTemplateExerciseByTemplateId(templateId);

          // 方式三, 添加到本地, 再把資料給setTemplate
          // // 第一步: 先把建立的模板給本地dataAllTemplate
          // setNewDataTemplate(template)
          // // 第二步: 找到新建的模板, 然後把資料給setTemplate
          // if (findTemplate) {
          //   setTemplate(findTemplate)
          // }
        } else if (localTemplate) {
          // 用戶沒登入
          setTemplate(localTemplate);
        }
      } catch (error) {
        console.error("Failed to fetch template", error);
      }
    };

    fetchExercises();
  }, [localTemplate, templateId, userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      if (userId) {
        // 資料庫
        await upsertTemplate({
          ...template,
          templateExercises: template.templateExercises || [],
        })

      } else {
        // 用戶未登入
        const updatedTemplate: TemplateType = {
          ...template,
        };

        if (localTemplate) {
          editTemplate(templateId, updatedTemplate);
        } else {
          addTemplate(updatedTemplate);
        }
      }

      router.push("/fit");
    } catch (error) {
      console.log('伺服器忙碌中, 請稍後再試', error)
      setIsLoading(false);
    }
  };

  return (
    <TemplateForm
      type="新增"
      template={template}
      setTemplateState={setTemplate}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  )
}

export default CreateTemplate