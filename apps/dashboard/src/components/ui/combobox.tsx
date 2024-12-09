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
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

type ComboboxProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  list: { value: string; label: string }[];
  buttonClassName?: string;
  disabled?: boolean;
  onCreate?: (value: string) => void;
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
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="popover-content-width-same-as-its-trigger p-0">
        <Command>
          <CommandInput
            value={query}
            onValueChange={(value: string) => setQuery(value)}
            placeholder="Search..."
          />
          <CommandList>
            {props.onCreate
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
