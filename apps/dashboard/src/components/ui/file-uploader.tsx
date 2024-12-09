'use client';

import { cn, formatBytes } from '@/lib/utils';

import { Upload } from 'lucide-react';
import * as React from 'react';
import Dropzone, {
  type DropzoneProps,
} from 'react-dropzone';

type FileUploaderProps = {
  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  value?: File[];

  /**
   * Function to be called when the value changes.
   * @type (files: File[]) => void
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: (files: File[]) => void;

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  accept?: DropzoneProps['accept'];

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  maxSize?: DropzoneProps['maxSize'];

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFileCount={4}
   */
  maxFileCount?: DropzoneProps['maxFiles'];

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  multiple?: boolean;

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  disabled?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function FileUploader(props: FileUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onDrop,
    accept = {
      'video/*': [],
    },
    maxSize = 1024 * 1024 * 2,
    maxFileCount = 1,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
  } = props;

  return (
    <div className="relative flex w-full flex-col gap-6 overflow-hidden">
      <Dropzone
        onDrop={onValueChange}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFileCount}
        multiple={maxFileCount > 1 || multiple}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
              'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isDragActive && 'border-muted-foreground/50',
              disabled && 'pointer-events-none opacity-60',
              className,
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            {isDragActive
              ? (
                  <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                    <div className="rounded-full border border-dashed p-3">
                      <Upload
                        className="size-7 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="font-medium text-muted-foreground">
                      Drop the files here
                    </p>
                  </div>
                )
              : (
                  <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                    <div className="rounded-full border border-dashed p-3">
                      <Upload
                        className="size-7 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex flex-col gap-px">
                      <p className="font-medium text-muted-foreground">
                        Drop files here, or click to select files
                      </p>
                      <p className="text-sm text-muted-foreground/70">
                        You can upload
                        {maxFileCount > 1
                          ? ` ${maxFileCount === Infinity ? 'multiple' : maxFileCount}
                      files (up to ${formatBytes(maxSize)} each)`
                          : ` a file with ${formatBytes(maxSize)}`}
                      </p>
                    </div>
                  </div>
                )}
          </div>
        )}
      </Dropzone>
    </div>
  );
}
