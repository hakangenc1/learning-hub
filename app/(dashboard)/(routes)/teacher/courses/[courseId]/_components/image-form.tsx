"use client";

import * as z from "zod";
import axios from "axios";
import { Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { ImageIcon, PencilIcon, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import FileUpload from "@/components/file-upload";
import { useRouter } from "next/navigation";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, { message: "Image is required" }),
});

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const updateImageUrl = async (values: { imageUrl: string }) => {
    const response = await axios.patch(`/api/courses/${courseId}`, values);
    return response.data;
  };

  const queryClient = useQueryClient();
  const { mutate, data, status } = useMutation(
    (values: z.infer<typeof formSchema>) => updateImageUrl(values),
    {
      // Define onSuccess callback to handle the mutation success
      onSuccess: () => {
        toggleEdit();
        toast({
          title: "Course image has been uploaded.",
        });
        router.refresh();
      },
      // Define onError callback to handle the mutation error
      onError: () => {
        toast({
          title: "Oops!",
          description: "Something went wrong.",
        });
      },
      // Invalidate queries related to this data upon success
      onSettled: () => {
        queryClient.invalidateQueries(["imageUrl", courseId]);
      },
    }
  );

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        Course image
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <PencilIcon className="w-4 mr-2 h4" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center rounded-md h-60 bg-slate-200">
            <ImageIcon className="w-10 h-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image
              alt="upload"
              fill
              className="object-cover rounded-md"
              src={data?.imageUrl || initialData.imageUrl}
              placeholder="empty"
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                mutate({ imageUrl: url });
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};
