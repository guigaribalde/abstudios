'use server';
import { client } from '@acme/database/supabase';

export const uploadFile = async (file: File) => {
  const uuid = crypto.randomUUID();
  return client.storage.from('files').upload(`${uuid}-${file.name}`, file);
};

export const deleteFile = async (path: string) => {
  return client.storage.from('files').remove([path]);
};
