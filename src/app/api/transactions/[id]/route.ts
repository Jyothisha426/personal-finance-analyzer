// src/app/api/transactions/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import Transaction from '@/app/lib/models/Transaction';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const data = await request.json();
  const transaction = await Transaction.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json(transaction);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  await Transaction.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Transaction deleted' });
}
