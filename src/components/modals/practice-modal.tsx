"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { usePracticeModal } from "@/lib/use-practice-modal";
import Link from "next/link";
import { useTemplateStore } from "@/lib/store";
import Image from "next/image";


export const PracticeModal = () => {
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close, menuId, templateId } = usePracticeModal();

  const templates = useTemplateStore(state => state.templates);
  const openTemplate = templates.find(template => template.cardId === templateId);

  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            {openTemplate?.title}
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            持續訓練, 維持體態
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-100 px-3 py-5">
          <div className="grid grid-cols-2 gap-3 overflow-y-scroll min-h-20 max-h-48">
            {openTemplate?.exercises.map((exercise) => (
              <div key={exercise.exerciseId}>
                <div className="p-2 bg-white rounded-md">
                  <div className="flex flex-col items-center">
                    <Image
                      src='/icons/dumbbell.svg'
                      alt={exercise.name}
                      width={36}
                      height={36}
                    />
                    <p className="text-sm mt-2">{exercise.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <div className="flex w-full gap-3">
            <Link href={`/fit/${menuId}/${templateId}/update`} className="flex w-full">
              <Button
                onClick={close}
                className="w-full"
              >
                編輯模板 ({openTemplate?.exercises.length})
              </Button>
            </Link>

            <Link href={`/fit/workout/${menuId}/${templateId}`} className="flex w-full">
              <Button
                onClick={close}
                className="w-full"
              >
                開始訓練
              </Button>
            </Link>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
