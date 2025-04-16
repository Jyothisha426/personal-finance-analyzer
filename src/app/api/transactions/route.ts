// src/app/api/transactions/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import Transaction from '@/app/lib/models/Transaction';

export async function GET() {
    try {
      await dbConnect(); // Ensure connection is made
      const transactions = await Transaction.find({}); // Fetch all
      return NextResponse.json(transactions); // Return array
    } catch (error) {
      console.error('API Error:', error); // Log it in terminal
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const transaction = await Transaction.create(data);
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('POST /api/transactions error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
