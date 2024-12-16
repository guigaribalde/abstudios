'use server';

import supabase from '@/lib/supabase';

export const uploadFile = async (file: File) => {
  const uuid = crypto.randomUUID();
  return supabase.storage.from('files').upload(`${uuid}-${file.name}`, file);
};

export const deleteFile = async (path: string) => {
  return supabase.storage.from('files').remove([path]);
};
