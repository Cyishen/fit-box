"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTemplateStore } from '@/lib/store'
import TemplateForm from '../TemplateForm'

import { useSession } from 'next-auth/react'
import { getTemplateById, upsertTemplate } from '@/actions/user-create'


const UpdateTemplate = ({ params }: { params: { menuId: string, templateId: string } }) => {
  const { menuId, templateId } = params;
  const router = useRouter();
  // const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession()
  const userId = session?.user?.id

  // 本地
  const templates = useTemplateStore((state) => state.templates);
  const existingTemplate = templates.find(template => template.templateId === templateId);
  const editTemplate = useTemplateStore((state) => state.editTemplate);

  const [template, setTemplate] = useState<TemplateType>({
    userId: userId || "Guest",
    menuId: menuId,
    templateId: templateId,
    templateCategory: "",
    templateTitle: "",
    exercises: [],
  });

  // useEffect(() => {
  //   const fetchExercises = () => {
  //     startTransition(async () => {
  //       // 資料庫
  //       if (userId && templateId) {
  //         try {
  //           const template = await getTemplateById(templateId);

  //           setTemplate(prevTemplate => ({
  //             ...prevTemplate,
  //             exercises: template?.exercises || [],
  //             templateTitle: template?.templateTitle || '',
  //             templateCategory: template?.templateCategory || '',
  //           }));
  //         } catch (error) {
  //           console.error("Failed to fetch template or exercises", error);
  //         }
  //       } else if (existingTemplate) {
  //         // 本地
  //         setTemplate(existingTemplate);
  //       }
  //     })
  //   };

  //   fetchExercises();
  // }, [existingTemplate, templateId, userId]);

  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      try {
        if (userId && templateId) {
          const fetchedTemplate = await getTemplateById(templateId);

          setTemplate(prevTemplate => ({
            ...prevTemplate,
            exercises: fetchedTemplate?.exercises || [],
            templateTitle: fetchedTemplate?.templateTitle || '',
            templateCategory: fetchedTemplate?.templateCategory || '',
          }));
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
  }, [existingTemplate, templateId, userId]);


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
