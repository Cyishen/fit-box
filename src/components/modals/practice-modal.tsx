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


export const PracticeModal = () => {
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close, menuId, templateId } = usePracticeModal();

  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-2xl">
            模板
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            堅持練習, 維持體態
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <div className="flex w-full gap-3">
            <Link href={`/fit/${menuId}/${templateId}/update`} className="flex w-full">
              <Button
                onClick={close}
                className="w-full"
              >
                編輯模板
              </Button>
            </Link>

            <Button
              onClick={close}
              className="w-full"
            >
              開始訓練
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
