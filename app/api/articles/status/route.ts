import { NextResponse } from 'next/server';
export async function GET(){
  return NextResponse.json({connected:Boolean(process.env.BLOB_READ_WRITE_TOKEN)});
}
