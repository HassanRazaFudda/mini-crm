'use server';

import { supabase, Lead } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }

  return data || [];
}

export async function addLead(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const company = formData.get('company') as string;

  if (!name || !email) {
    return { error: 'Name and email are required' };
  }

  const { error } = await supabase.from('leads').insert([
    {
      name,
      email,
      phone: phone || null,
      company: company || null,
      status: 'new',
    },
  ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

export async function updateLeadStatus(
  id: string,
  status: Lead['status']
) {
  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

export async function deleteLead(id: string) {
  const { error } = await supabase.from('leads').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}
