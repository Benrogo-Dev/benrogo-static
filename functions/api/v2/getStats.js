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
  const { env } = context;
  const cache = caches.default;
  const cacheKey = new Request(context.request.url, context.request);

  let response = await cache.match(context.request);
  if (response) return new Response(response.body, response);

  let results;
  let source = "LOCAL-DB";

  const localAPIResponse = await fetch("https://api.benrogo.net/edge-api/getStats");

  if (localAPIResponse.ok) {
    results = await localAPIResponse.json();
  } else {
    const dbResponse = await env.DB.prepare("SELECT * FROM stats").all();
    source = "EDGE-DB";
    results = dbResponse.results;
  }

  return createCachedResponse(results, "application/json", source, cache, cacheKey);
}