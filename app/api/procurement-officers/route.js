import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET - Fetch all procurement officers
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('procurement-officers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching procurement officers:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new procurement officer
export async function POST(request) {
  try {
    const { firstname, middlename, lastname, email } = await request.json();

    // Validate required fields
    if (!firstname || !lastname || !email) {
      return NextResponse.json({ 
        success: false, 
        error: 'First name, last name, and email are required' 
      }, { status: 400 });
    }

    // Check if email already exists
    const { data: existingOfficer, error: checkError } = await supabase
      .from('procurement-officers')
      .select('id')
      .eq('email', email)
      .single();

    if (existingOfficer) {
      return NextResponse.json({ 
        success: false, 
        error: 'Officer with this email already exists' 
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('procurement-officers')
      .insert([{
        firstname,
        middlename: middlename || null,
        lastname,
        email
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating procurement officer:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update a procurement officer
export async function PUT(request) {
  try {
    const { id, firstname, middlename, lastname, email } = await request.json();

    // Validate required fields
    if (!id || !firstname || !lastname || !email) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID, first name, last name, and email are required' 
      }, { status: 400 });
    }

    // Check if email already exists for another officer
    const { data: existingOfficer, error: checkError } = await supabase
      .from('procurement-officers')
      .select('id')
      .eq('email', email)
      .neq('id', id)
      .single();

    if (existingOfficer) {
      return NextResponse.json({ 
        success: false, 
        error: 'Officer with this email already exists' 
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('procurement-officers')
      .update({
        firstname,
        middlename: middlename || null,
        lastname,
        email
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating procurement officer:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a procurement officer
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Officer ID is required' 
      }, { status: 400 });
    }

    const { error } = await supabase
      .from('procurement-officers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting procurement officer:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
