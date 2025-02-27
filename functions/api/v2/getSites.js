export function shiftText(text, n) {
  n = n % text.length;
  return text.slice(n) + text.slice(0, n);
}

export function createCachedResponse(body, contentType, source, cache, cacheKey) {
  const response = new Response(
    typeof body === "string" ? body : JSON.stringify(body),
    {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "s-maxage=1800, max-age=0, public",
        "Access-Control-Allow-Origin": "*",
        "X-Rogo-Source": source
      }
    }
  );
  cache.put(cacheKey, response.clone());
  return response;
}

export async function onRequest(context) {
  const { request, env } = context;
  const cache = caches.default;
  const url = new URL(request.url);
  const cacheKey = new Request(url, request);

  let response = await cache.match(request);
  if (response) return new Response(response.body, response);

  const page = Number(url.searchParams.get("page")) || 1;
  let results;
  let source = "LOCAL-DB";

  const localAPIResponse = await fetch(`https://api.benrogo.net/edge-api/getSites?page=${page}`);

  if (localAPIResponse.ok) {
    results = await localAPIResponse.json();
  } else {
    const dbResponse = await env.DB.prepare(
      "SELECT url,request_count,check_status FROM site_summary ORDER BY request_count DESC LIMIT ?,80"
    )
      .bind((page - 1) * 80)
      .all();
    source = "EDGE-DB";
    results = dbResponse.results;
  }

  const obfuscatedResults = results.map(result => ({
    "u": btoa(result.url),
    "r": result.request_count,
    "s": result.check_status
  }));

  const obfuscatedResponse = btoa(JSON.stringify(obfuscatedResults));
  const shiftValue = (Math.floor(Math.random() * obfuscatedResponse.length) + 1).toString();
  const shiftedResponse = shiftText(obfuscatedResponse, shiftValue);

  return createCachedResponse(shiftedResponse + ":" + shiftValue + ":FUCKITWEBALL", "text/plain", source, cache, cacheKey);
}
