'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { TagsInput } from '@/components/ui/tag-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ExtraFormSchema = z.object({
  tags: z.array(z.string()).nonempty(),
});

export type ExtraFormType = z.infer<typeof ExtraFormSchema>;
type ExtraFormProps = {
  defaultValues?: ExtraFormType;
  onSubmit: (data: ExtraFormType) => void;
};

const initialValues: ExtraFormType = {
  tags: [] as unknown as [string],
};

export type ExtraFormRef = {
  values: () => ExtraFormType;
  valid: () => Promise<boolean>;
  submit: () => void;
};

const ExtraForm = forwardRef<ExtraFormRef, ExtraFormProps>(({
  defaultValues = initialValues,
  onSubmit,
}, ref) => {
  const form = useForm<ExtraFormType>({
    mode: 'onChange',
    resolver: zodResolver(ExtraFormSchema),
    defaultValues,
  });

  useImperativeHandle(ref, () => ({
    values: () => {
      return form.getValues();
    },
    valid: async () => {
      const { errors } = await form.control._executeSchema(Object.keys(initialValues));
      const valid = Object.keys(errors).length === 0;
      return valid;
      // return form.formState.isValid;
    },
    submit: () => {
      form.handleSubmit(onSubmit)();
    },
  }));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex size-full flex-col justify-between"
      >
        <div className="mt-2 flex w-full gap-8">
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Title</FormLabel>

                <FormControl>
                  <TagsInput
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Tags..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full justify-end gap-3">
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
          >
            Next
            <ArrowRight />
          </Button>
        </div>
      </form>
    </Form>
  );
},
);

export default ExtraForm;
