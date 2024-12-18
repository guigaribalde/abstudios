'use client';
import { Button } from '@/components/ui/button';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, PlayCircle } from 'lucide-react';
import React, { useEffect, useId, useRef, useState } from 'react';

const cards = [
  {
    description: 'Lana Del Rey',
    title: 'Summertime Sadness',
    src: 'https://assets.aceternity.com/demos/lana-del-rey.jpeg',
    ctaText: 'Visit',
    ctaLink: 'https://ui.aceternity.com/templates',
    content: () => {
      return (
        <p>
          Lana Del Rey, an iconic American singer-songwriter, is celebrated for
          her melancholic and cinematic music style. Born Elizabeth Woolridge
          Grant in New York City, she has captivated audiences worldwide with
          her haunting voice and introspective lyrics.
          {' '}
          <br />
          {' '}
          <br />
          {' '}
          Her songs
          often explore themes of tragic romance, glamour, and melancholia,
          drawing inspiration from both contemporary and vintage pop culture.
          With a career that has seen numerous critically acclaimed albums, Lana
          Del Rey has established herself as a unique and influential figure in
          the music industry, earning a dedicated fan base and numerous
          accolades.
        </p>
      );
    },
  },
  {
    description: 'Babbu Maan',
    title: 'Mitran Di Chhatri',
    src: 'https://assets.aceternity.com/demos/babbu-maan.jpeg',
    ctaText: 'Visit',
    ctaLink: 'https://ui.aceternity.com/templates',
    content: () => {
      return (
        <p>
          Babu Maan, a legendary Punjabi singer, is renowned for his soulful
          voice and profound lyrics that resonate deeply with his audience. Born
          in the village of Khant Maanpur in Punjab, India, he has become a
          cultural icon in the Punjabi music industry.
          {' '}
          <br />
          {' '}
          <br />
          {' '}
          His songs
          often reflect the struggles and triumphs of everyday life, capturing
          the essence of Punjabi culture and traditions. With a career spanning
          over two decades, Babu Maan has released numerous hit albums and
          singles that have garnered him a massive fan following both in India
          and abroad.
        </p>
      );
    },
  },

  {
    description: 'Metallica',
    title: 'For Whom The Bell Tolls',
    src: 'https://assets.aceternity.com/demos/metallica.jpeg',
    ctaText: 'Visit',
    ctaLink: 'https://ui.aceternity.com/templates',
    content: () => {
      return (
        <p>
          Metallica, an iconic American heavy metal band, is renowned for their
          powerful sound and intense performances that resonate deeply with
          their audience. Formed in Los Angeles, California, they have become a
          cultural icon in the heavy metal music industry.
          {' '}
          <br />
          {' '}
          <br />
          {' '}
          Their
          songs often reflect themes of aggression, social issues, and personal
          struggles, capturing the essence of the heavy metal genre. With a
          career spanning over four decades, Metallica has released numerous hit
          albums and singles that have garnered them a massive fan following
          both in the United States and abroad.
        </p>
      );
    },
  },
  {
    description: 'Lord Himesh',
    title: 'Aap Ka Suroor',
    src: 'https://assets.aceternity.com/demos/aap-ka-suroor.jpeg',
    ctaText: 'Visit',
    ctaLink: 'https://ui.aceternity.com/templates',
    content: () => {
      return (
        <p>
          Himesh Reshammiya, a renowned Indian music composer, singer, and
          actor, is celebrated for his distinctive voice and innovative
          compositions. Born in Mumbai, India, he has become a prominent figure
          in the Bollywood music industry.
          {' '}
          <br />
          {' '}
          <br />
          {' '}
          His songs often feature
          a blend of contemporary and traditional Indian music, capturing the
          essence of modern Bollywood soundtracks. With a career spanning over
          two decades, Himesh Reshammiya has released numerous hit albums and
          singles that have garnered him a massive fan following both in India
          and abroad.
        </p>
      );
    },
  },
];

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

export default function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null,
  );
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(false);
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
                    <div className="size-full bg-gray-400">
                    </div>
                    <div className="absolute left-1/2 top-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/30 text-white">
                      <PlayCircle className="size-12" />
                    </div>
                    <div className="absolute left-0 top-0 flex size-full flex-col justify-between px-12 py-10">
                      <div className="flex flex-col gap-7">
                        <div className="flex flex-col gap-2">
                          <h1 className="text-5xl font-bold text-white">
                            Title
                          </h1>
                          <h2 className="text-2xl text-white">
                            Subtitle
                          </h2>
                        </div>
                        <span className="text-2xl text-white">Season 1, Session 2</span>
                      </div>
                      <div>
                        <Button size="lg">
                          <Play />
                          Play
                        </Button>
                      </div>
                    </div>
                  </motion.div>

                  <div className="px-12 py-10">
                    <div className="flex items-start justify-between">
                      <div>
                        <motion.h3
                          className="text-base font-medium text-neutral-700 dark:text-neutral-200"
                        >
                          {active.title}
                        </motion.h3>
                        <motion.p
                          className="text-base text-neutral-600 dark:text-neutral-400"
                        >
                          {active.description}
                        </motion.p>
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {typeof active.content === 'function'
                        ? active.content()
                        : active.content}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            )
          : null}
      </AnimatePresence>
      <ul className="mx-auto grid w-full max-w-2xl grid-cols-1 items-start gap-4 md:grid-cols-2">
        {cards.map(card => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="flex w-full max-w-sm cursor-pointer flex-col overflow-hidden rounded-sm shadow-lg"
          >
            <motion.div layoutId={`image-${card.title}-${id}`} className="relative">
              <div className="aspect-video w-full bg-neutral-300"></div>
              <div className="absolute left-1/2 top-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/30 text-white">
                <PlayCircle className="size-12" />
              </div>
            </motion.div>
            <div className="flex flex-col gap-5 px-3 py-5">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-neutral-500">
                  <p>Season 1</p>
                  <p>Session 1</p>
                </div>
                <h3 className="text-lg font-bold">
                  {card.title}
                </h3>
                <p>
                  {card.description}
                </p>
              </div>
              <div>Description</div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}
