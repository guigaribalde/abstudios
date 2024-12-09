"use client"

import { CreateExampleSchema } from "@acme/database/schema";
import AddExampleForm from "./form"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";

export default function Page(){
  async function postExample(data: z.infer<typeof CreateExampleSchema>) {
    const response = await fetch("/api/example", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create course");
    }

    return response.json();
  }

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postExample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examples"] });
      toast.success('Example created!')
    },
    onError: () => {
      toast.error('Failed to create example :(')
    }
  });
  return (
    <AddExampleForm
      onSubmit={async (data)=>{
        await mutation.mutateAsync(data)
      }}
    />
  )
}
