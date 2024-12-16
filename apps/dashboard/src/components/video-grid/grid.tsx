'use client';
import { Button } from '@/components/ui/button';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useId, useRef, useState } from 'react';
import { Badge } from '../ui/badge';

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

export type Item = {
  thumbnail: string;
  title: string;
  playbackId: string;
  subtitle: string;
  season: number;
  session: number;
  courseDescription: string;
  tags: string[];
  category: string;
  createdAt: Date;
};

type GridProps = {
  itens: Item[];
  onPlay: (playbackId: string) => void;
};

export default function Grid(props: GridProps) {
  const [active, setActive] = useState<Item | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(null);
      }
    }

    if (active && typeof active === 'object') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === 'object' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 size-full bg-black/20"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === 'object'
          ? (
              <div className="fixed inset-0  z-[100] grid place-items-center">
                <motion.button
                  key={`button-${active.title}-${id}`}
                  layout
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: 0.05,
                    },
                  }}
                  className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-white lg:hidden"
                  onClick={() => setActive(null)}
                >
                  <CloseIcon />
                </motion.button>
                <motion.div
                  layoutId={`card-${active.title}-${id}`}
                  ref={ref}
                  className="flex size-full  max-w-[850px] flex-col overflow-hidden  rounded-md  bg-white md:h-fit md:max-h-[90%]"
                >
                  <motion.div className="relative flex aspect-video" layoutId={`image-${active.title}-${id}`}>
                    <div className="z-10 size-full bg-gray-400">
                      <Image
                        src={active.thumbnail}
                        alt={active.title}
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute size-full bg-black/30"></div>
                    </div>
                    <button
                      type="button"
                      onClick={() => props.onPlay(active.playbackId)}
                      className="absolute left-1/2 top-1/2 z-30 w-fit -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/30 text-white"
                    >
                      <PlayCircle className="size-12" />
                    </button>
                    <div className="absolute left-0 top-0 z-20 flex size-full flex-col justify-between px-12 py-10">
                      <div className="flex flex-col gap-7">
                        <div className="flex flex-col gap-2">
                          <h1 className="text-5xl font-bold text-white">
                            {active.title}
                          </h1>
                          <h2 className="text-2xl text-white">
                            {active.subtitle}
                          </h2>
                        </div>
                        <span className="text-2xl text-white">
                          Season
                          {' '}
                          {active.season}
                          , Session
                          {' '}
                          {active.session}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="lg"
                          type="button"
                          onClick={() => props.onPlay(active.playbackId)}
                        >
                          <Play />
                          Play
                        </Button>
                      </div>
                    </div>
                  </motion.div>

                  <div className="px-12 py-10">
                    <div className="flex items-start justify-between">
                      {/* <div> */}
                      {/*   <motion.h3 */}
                      {/*     className="text-base font-medium text-neutral-700 dark:text-neutral-200" */}
                      {/*   > */}
                      {/*     {active.title} */}
                      {/*   </motion.h3> */}
                      {/*   <motion.p */}
                      {/*     className="text-base text-neutral-600 dark:text-neutral-400" */}
                      {/*   > */}
                      {/*     {active.subtitle} */}
                      {/*   </motion.p> */}
                      {/* </div> */}
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="flex w-full flex-col gap-4">
                        <div>
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center gap-2">
                              {Date.now() - new Date(active.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000 && (
                                <Badge variant="success" className="font-bold">New</Badge>
                              )}
                              <span className="text-neutral-500">
                                Released in
                                {' '}
                                {new Date(active.createdAt).getFullYear()}
                              </span>
                            </div>
                            <div>
                              <span className="text-neutral-500">Category:</span>
                              {' '}
                              <span>{active.category}</span>
                            </div>
                          </div>
                          <div className="mt-1 flex gap-1">
                            {active.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                          </div>
                        </div>

                        {active.courseDescription}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            )
          : null}
      </AnimatePresence>
      <ul className="grid w-full grid-cols-1 items-start gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {props.itens.map(item => (
          <motion.div
            layoutId={`card-${item.title}-${id}`}
            key={item.title}
            onClick={() => setActive(item)}
            className="flex w-full  cursor-pointer flex-col overflow-hidden rounded-sm shadow-lg"
          >
            <motion.div layoutId={`image-${item.title}-${id}`} className="relative">
              <div className="aspect-video w-full bg-neutral-300">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute left-1/2 top-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/30 text-white">
                <PlayCircle className="size-12" />
              </div>
            </motion.div>
            <div className="flex flex-col gap-5 px-3 py-5">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-neutral-500">
                  <p>
                    Season
                    {' '}
                    {item.season}
                  </p>
                  <p>
                    Session
                    {' '}
                    {item.session}
                  </p>
                </div>
                <h3 className="text-lg font-bold">
                  {item.title}
                </h3>
                <p>
                  {item.subtitle}
                </p>
              </div>
              <div>
                {/* TODO: Limit the description and put elipsis */}
                {item.courseDescription}
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}
