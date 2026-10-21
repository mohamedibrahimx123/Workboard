import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Supabase Auth request failed",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Supabase client initialized",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Could not initialize Supabase client",
      },
      { status: 500 },
    );
  }
}
