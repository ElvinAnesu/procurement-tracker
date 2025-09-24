import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// GET - Fetch a single item request with related data
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id || isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid request ID' }, { status: 400 });
    }

    // Fetch the request with related department and officer data
    const { data, error } = await supabase
      .from('item_requests')
      .select(`
        *,
        departments:department(name),
        procurement_officers:assigned_to(firstname, lastname, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching item request:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
    }

    // Transform the data to include the related information
    const transformedData = {
      ...data,
      department_name: data.departments?.name || 'Unknown Department',
      officer_name: data.procurement_officers ? 
        `${data.procurement_officers.firstname} ${data.procurement_officers.lastname}` : 
        null,
      officer_email: data.procurement_officers?.email || null
    };

    return NextResponse.json({ success: true, data: transformedData });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
