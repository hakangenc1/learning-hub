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

interface DescriptionFormProps {
  description: string;
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
});

export const DescriptionForm = ({
  description,
  courseId,
}: DescriptionFormProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: description },
  });

  const updateDescription = async (values: { description: string }) => {
    const response = await axios.patch(`/api/courses/${courseId}`, values);
    return response.data;
  };
  const queryClient = useQueryClient();
  const { mutate, isLoading, data } = useMutation(
    (values: z.infer<typeof formSchema>) => updateDescription(values),
    {
      // Define onSuccess callback to handle the mutation success
      onSuccess: () => {
        toast({
          title: "Course description has been updated.",
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
        queryClient.invalidateQueries(["description", courseId]);
      },
    }
  );
  const { isValid } = form.formState;
  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        Course description
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PencilIcon className="w-4 mr-2 h4" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !description && !data?.description && "text-slate-500 italic"
          )}
        >
          {isLoading ? (
            <Skeleton />
          ) : (
            data?.description || description || "No Description"
          )}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values: { description: string }) => {
              toggleEdit();
              mutate(values);
            })}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      placeholder="e.g. 'This course is about...'"
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
