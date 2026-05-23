import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/category";

export async function GET() {
  await connectDB();
  try {
    const categories = await Category.find();
    return NextResponse.json(categories);
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  try {
    const category = await Category.create(body);

    return NextResponse.json(category);
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
