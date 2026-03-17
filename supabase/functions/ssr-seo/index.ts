import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getAbsoluteUrl(origin: string, path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${p}`;
}

function generateHomeMetaHTML(origin: string): string {
  const url = getAbsoluteUrl(origin, "/");
  const title = "Last Chad Standing - The first MMA Battle Royale";
  const description =
    "Last Chad Standing - The first MMA Battle Royale. Join the ultimate combat experience.";
  const imageUrl = getAbsoluteUrl(origin, "/lovable-uploads/3f5e7815-4bdc-4a67-a0a6-adc4051e8144.png");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="author" content="DeHub Games">
  
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:alt" content="Last Chad Standing Cover Image">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Last Chad Standing">
  
  <meta name="twitter:card" content="summary">
  <meta name="twitter:site" content="@lcs_game">
  <meta name="twitter:url" content="${url}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">
  
  <meta http-equiv="refresh" content="0; url=${url}">
</head>
<body>
  <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 100px auto; text-align: center; padding: 20px;">
    <h1>Last Chad Standing</h1>
    <p>Redirecting... <a href="${url}">Click here</a> if not redirected.</p>
  </div>
</body>
</html>`;
}

function generateSaleMetaHTML(origin: string): string {
  const url = getAbsoluteUrl(origin, "/sale");
  const title = "Strategic Sale | Last Chad Standing";
  const description =
    "Register your interest for the Last Chad Standing Strategic Sale. The first MMA Battle Royale - join the ultimate combat experience.";
  const imageUrl = getAbsoluteUrl(origin, "/lovable-uploads/3f5e7815-4bdc-4a67-a0a6-adc4051e8144.png");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="author" content="DeHub Games">
  
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:alt" content="Last Chad Standing Sale Image">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Last Chad Standing">
  
  <meta name="twitter:card" content="summary">
  <meta name="twitter:site" content="@lcs_game">
  <meta name="twitter:url" content="${url}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">
  
  <meta http-equiv="refresh" content="0; url=${url}">
</head>
<body>
  <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 100px auto; text-align: center; padding: 20px;">
    <h1>Strategic Sale - Last Chad Standing</h1>
    <p>Redirecting... <a href="${url}">Click here</a> if not redirected.</p>
  </div>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path") || "/";
    const origin = url.searchParams.get("origin") || "https://lastchadstanding.com";

    const normalizedPath = path.replace(/\/$/, "") || "/";

    let html: string;
    if (normalizedPath === "/" || normalizedPath === "") {
      html = generateHomeMetaHTML(origin);
    } else if (normalizedPath === "/sale") {
      html = generateSaleMetaHTML(origin);
    } else {
      html = generateHomeMetaHTML(origin);
    }

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error in ssr-seo:", error);
    return new Response("Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
