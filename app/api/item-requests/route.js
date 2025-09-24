import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET - Fetch all item requests
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('item_requests')
      .select(`
        *,
        procurement_officers:assigned_to (
          firstname,
          middlename,
          lastname,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching item requests:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new item request
export async function POST(request) {
  try {
    const { item, requested_by, priority, department } = await request.json();

    // Validate required fields
    if (!item || !requested_by || !priority || !department) {
      return NextResponse.json({ 
        success: false, 
        error: 'Item, requested_by, priority, and department are required' 
      }, { status: 400 });
    }

    // Validate priority enum
    const validPriorities = ['normal', 'high', 'low'];
    if (!validPriorities.includes(priority)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid priority level' 
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('item_requests')
      .insert([{
        item,
        requested_by,
        priority,
        department,
        status: 'pending-assignment'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating item request:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update an item request
export async function PUT(request) {
  try {
    const { id, item, requested_by, priority, department, status, assigned_to } = await request.json();

    // Validate required fields
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID is required' 
      }, { status: 400 });
    }

    const updateData = {};
    if (item !== undefined) updateData.item = item;
    if (requested_by !== undefined) updateData.requested_by = requested_by;
    if (priority !== undefined) updateData.priority = priority;
    if (department !== undefined) updateData.department = department;
    if (status !== undefined) updateData.status = status;
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to;

    const { data, error } = await supabase
      .from('item_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating item request:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete an item request
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Request ID is required' 
      }, { status: 400 });
    }

    const { error } = await supabase
      .from('item_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting item request:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
