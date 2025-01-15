import { NextRequest, NextResponse } from 'next/server';

export const config = {
    api: {
        bodyParser: false, // Disable automatic body parsing for handling FormData
    }
};

export async function POST(req: NextRequest){
    const data = await req.formData();
    const file = data.get('file');

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    

}