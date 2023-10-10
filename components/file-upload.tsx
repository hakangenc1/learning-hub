"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { OurFileRouter, ourFileRouter } from "@/app/api/uploadthing/core";
import { useToast } from "./ui/use-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  const { toast } = useToast();
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(err: Error) => {
        toast({
          title: err?.message,
        });
      }}
    />
  );
};

export default FileUpload;
