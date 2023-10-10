"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Skeleton from "@/components/skeleton";
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
  categoryId: string;
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1),
});

export const CategoryForm = ({
  categoryId,
  courseId,
  options,
}: CategoryFormProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { categoryId: categoryId },
  });

  const updateCategory = async (values: { categoryId: string }) => {
    const response = await axios.patch(`/api/courses/${courseId}`, values);
    return response.data;
  };
  const queryClient = useQueryClient();
  const { mutate, isLoading, data } = useMutation(
    (values: z.infer<typeof formSchema>) => updateCategory(values),
    {
      // Define onSuccess callback to handle the mutation success
      onSuccess: () => {
        toast({
          title: "Course category has been updated.",
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
        queryClient.invalidateQueries(["category", categoryId]);
      },
    }
  );
  const { isValid } = form.formState;

  const selectedOption = options.find((option) => option.value === categoryId);
  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        Course category
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PencilIcon className="w-4 mr-2 h4" />
              Edit category
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !categoryId && !data?.categoryId && "text-slate-500 italic"
          )}
        >
          {isLoading ? <Skeleton /> : selectedOption?.label || "No category"}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values: { categoryId: string }) => {
              toggleEdit();
              mutate(values);
            })}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={...options} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isLoading} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
