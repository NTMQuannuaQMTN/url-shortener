import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const { data, error } = await supabase
      .from("links")
      .select("original_url")
      .eq("shortened_url", code)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Short code not found." }, { status: 404 });
    }

    return NextResponse.json(data);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const originalUrl = body?.original_url?.trim();
  const shortenedUrl = body?.shortened_url?.trim();

  if (!originalUrl || !shortenedUrl) {
    return NextResponse.json(
      { error: "Please provide both original_url and shortened_url." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("links")
    .insert([
      {
        original_url: originalUrl,
        shortened_url: shortenedUrl,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
