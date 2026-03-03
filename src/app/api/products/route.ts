import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { Product } from "@/models/product";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newProduct = await Product.create(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const featured = searchParams.get("featured");

  try {
    await connectDB();
    const filter: any = {};
    if (status && status !== "all") {
      filter.status = status;
    }
    if (featured !== null) {
      filter.featured = featured === "true";
    }
    const products = await Product.find(filter);
    return NextResponse.json(products, { status: 200 });
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
