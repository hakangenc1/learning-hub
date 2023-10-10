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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Skeleton from "@/components/skeleton";

interface TitleFormProps {
  title: string;
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

export const TitleForm = ({ title, courseId }: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: title },
  });
  const updateTitle = async (values: { title: string }) => {
    const response = await axios.patch(`/api/courses/${courseId}`, values);
    return response.data;
  };
  const queryClient = useQueryClient();
  const { mutate, isLoading, data } = useMutation(
    (values: z.infer<typeof formSchema>) => updateTitle(values),
    {
      // Define onSuccess callback to handle the mutation success
      onSuccess: () => {
        toast({
          title: "Course title has been updated.",
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
        queryClient.invalidateQueries(["title", courseId]);
      },
    }
  );
  const { isValid } = form.formState;

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        Course title
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PencilIcon className="w-4 mr-2 h4" />
              Edit title
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className="mt-2 text-sm">
          {isLoading ? <Skeleton /> : data?.title || title}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              toggleEdit();
              mutate(values);
            })}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="e.g. 'Advanced Web Development'"
                      {...field}
                    />
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
