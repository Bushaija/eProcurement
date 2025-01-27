import * as React from "react";
import type { UploadedFile } from "@/types";
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/handle-error"


interface UseUploadFileProps {
  defaultUploadedFiles?: UploadedFile[];
  headers?: Record<string, string>;
  onUploadBegin?: (files: File[]) => void;
  onUploadProgress?: (file: string, pogress: number) => void;
};

export function useUploadFile({
  defaultUploadedFiles = [],
  headers,
  onUploadBegin,
  onUploadProgress
}: UseUploadFileProps = {}) {
  const [ uploadedFiles, setUploadedFiles ] = React.useState<UploadedFile[]>(defaultUploadedFiles);
  const [progresses, setProgresses] = React.useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = React.useState(false);

  async function onUpload(files: File[]) {
    setIsUploading(true);
    try {
      if(onUploadBegin) onUploadBegin(files);
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      console.log("files", files);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          ...(headers || {}),
        },
        body: formData,
      });

      if(!response.ok) {
        throw new Error("failed to upload files");
      }

      const result: UploadedFile[] = await response.json();
      setUploadedFiles((prev) => (prev? [...prev, ...result]: result));

      const updatedProgresses = files.reduce((acc, file) => {
        acc[file.name] = 100;
        return acc;
      },{} as Record<string, number>);
      setProgresses((prev) => ({ ...prev, ...updatedProgresses}));
    } catch(err) {
      toast.error(getErrorMessage(err));
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
    onUploadProgress
  }
}


