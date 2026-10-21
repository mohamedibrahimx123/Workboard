import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet, headers) {
          // Update cookies on the incoming request.
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          // Recreate the response with the updated request.
          supabaseResponse = NextResponse.next({
            request,
          });

          // Forward updated cookies to the browser.
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });

          // Preserve any headers supplied by Supabase SSR.
          if (headers) {
            for (const [name, value] of Object.entries(headers)) {
              supabaseResponse.headers.set(name, value);
            }
          }
        },
      },
    }
  );

  // Refresh the session if needed and verify the token.
  await supabase.auth.getClaims();

  return supabaseResponse;
}