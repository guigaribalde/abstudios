'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import * as React from 'react';

type ComboboxProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  list: { value: string; label: string; disabled?: boolean }[];
  buttonClassName?: string;
  disabled?: boolean;
  onCreate?: (value: string) => void;
  loading?: boolean;
};

export function Combobox(props: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState<string>('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', props.buttonClassName)}
          disabled={props.disabled}
        >
          {props.value
            ? props.list.find(item => item.value === props.value)?.label
            : props.placeholder ?? 'Select...'}
          {props.loading ? <Loader2 className="ml-auto size-4 animate-spin" /> : <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-h-[var(--radix-popover-content-available-height)] w-[max(10rem,var(--radix-popover-trigger-width))] p-0">
        <Command>
          <CommandInput
            value={query}
            onValueChange={(value: string) => setQuery(value)}
            placeholder="Search..."
          />
          <CommandList>
            {props.onCreate && query.length
              ? (

                  <CommandEmpty
                    onClick={() => {
                      if (props.onCreate) {
                        props.onCreate(query);
                        setQuery('');
                        setOpen(false);
                      }
                    }}
                    className="flex p-1"
                  >
                    <div
                      className={
                        cn(
                          buttonVariants({ variant: 'ghost', size: 'sm' }),
                          'w-full flex justify-start cursor-pointer',
                        )
                      }
                    >
                      <p>Create </p>
                      <p className="block max-w-48 truncate text-primary">
                        "
                        {query}
                        "
                      </p>
                    </div>
                  </CommandEmpty>
                )
              : (
                  <CommandEmpty>No items found.</CommandEmpty>
                )}
            <CommandGroup>

              {props.onCreate
                ? (
                    query.length
                      ? (
                          <button
                            type="button"
                            className="mb-1 flex w-full"
                            onClick={() => {
                              if (props.onCreate) {
                                props.onCreate(query);
                                setQuery('');
                                setOpen(false);
                              }
                            }}
                          >
                            <div
                              className={
                                cn(
                                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                                  'w-full flex justify-start cursor-pointer',
                                )
                              }
                            >
                              <p>Create </p>
                              <p className="block max-w-48 truncate text-primary">
                                "
                                {query}
                                "
                              </p>
                            </div>
                          </button>
                        )
                      : null
                  )
                : null}
              {props.loading
                ? (
                    <CommandItem>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Loading...
                    </CommandItem>
                  )
                : null}
              {props.list.map(item => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={() => {
                    props.onChange(
                      item.value === props.value ? '' : item.value,
                    );
                    setOpen(false);
                  }}
                  disabled={item.disabled}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      props.value === item.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
