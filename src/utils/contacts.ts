
import { supabase } from "@/integrations/supabase/client";

export interface ContactData {
  name?: string;
  email?: string;
  phone_number?: string;
  company_name?: string;
  contact_position?: string;
  address?: string;
  status?: string;
  tags?: string[];
  // Allow for alternative field names that might come from different APIs
  phone?: string;
  company?: string;
  position?: string;
  headline?: string;
  location?: string;
  full_name?: string;
  firstName?: string;
  lastName?: string;
  contact_info?: {
    email?: string;
    phone?: string;
  };
  title?: string;
}

export const addContactsToDatabase = async (contacts: ContactData[], userId: string) => {
  try {
    // Map contacts and add user_id and current timestamp
    const contactsToInsert = contacts.map(contact => ({
      user_id: userId,
      name: contact.name || contact.full_name || (contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : null) || null,
      email: contact.email || contact.contact_info?.email || null,
      phone_number: contact.phone_number || contact.phone || contact.contact_info?.phone || null,
      company_name: contact.company_name || contact.company || null,
      contact_position: contact.contact_position || contact.position || contact.headline || contact.title || null,
      address: contact.address || contact.location || null,
      status: contact.status || 'new',
      tags: contact.tags || null,
      // added_at_date will be set by the database default
    }));

    const { data, error } = await supabase
      .from('contacts')
      .insert(contactsToInsert)
      .select();

    if (error) {
      console.error('Error inserting contacts:', error);
      throw new Error(`Failed to add contacts: ${error.message}`);
    }

    return { success: true, count: data?.length || 0, data };
  } catch (error) {
    console.error('Error in addContactsToDatabase:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const normalizeContactData = (rawData: any): ContactData[] => {
  if (!rawData) return [];
  
  // Handle different data structures
  let contacts: any[] = [];
  
  if (Array.isArray(rawData)) {
    contacts = rawData;
  } else if (rawData.leads && Array.isArray(rawData.leads)) {
    contacts = rawData.leads;
  } else if (rawData.data && Array.isArray(rawData.data)) {
    contacts = rawData.data;
  } else if (typeof rawData === 'object') {
    contacts = [rawData];
  }

  // Normalize field names to match our database schema
  // Explicitly ignore tags and added_at_date from imported data
  return contacts.map(contact => {
    // Create a copy without tags and added_at_date
    const { tags, added_at_date, ...cleanContact } = contact;
    
    return {
      name: cleanContact.name || cleanContact.full_name || (cleanContact.firstName && cleanContact.lastName ? `${cleanContact.firstName} ${cleanContact.lastName}` : null) || null,
      email: cleanContact.email || cleanContact.contact_info?.email || null,
      phone_number: cleanContact.phone || cleanContact.phone_number || cleanContact.contact_info?.phone || null,
      company_name: cleanContact.company || cleanContact.company_name || null,
      contact_position: cleanContact.position || cleanContact.contact_position || cleanContact.headline || cleanContact.title || null,
      address: cleanContact.address || cleanContact.location || null,
      status: cleanContact.status || 'new',
      // tags will be handled separately by the application
      tags: null
    };
  });
};
