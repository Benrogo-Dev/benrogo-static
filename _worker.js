// Text shifting function (for obfuscation)
function shiftText(text, n) {
  n = n % text.length;
  return text.slice(n) + text.slice(0, n);
}

async function fetchData(url, dbQuery, dbParams, env, fallbackSource, transformDBResult) {
  const response = await fetch(url);
  if (response.ok) {
    return { results: await response.json(), source: "LOCAL-DB" };
  } else if (env.EDGEDB_ENABLED === "true") {
    const dbResponse = await env.DB.prepare(dbQuery).bind(...dbParams).all();
    return { results: transformDBResult(dbResponse.results), source: fallbackSource };
  } else {
    return null;
  }
}

async function handleRequest(request, env) {
  const cache = caches.default;
  const url = new URL(request.url);
  const cacheKey = new Request(url, request);
  const { pathname, searchParams } = url;
  let response = await cache.match(request);

  if (response) return new Response(response.body, response);

  let fetchConfig = {
    // Stats API (home page information)
    "/edge-api/getStats": {
      apiUrl: "https://api.benrogo.net/edge-api/getStats",
      dbQuery: "SELECT * FROM stats",
      dbParams: [],
      transformDBResult: (data) => data,
      formatResponse: (data) => JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      cacheEnabled: true,
    },
    // Sites API (Linkies page list)
    "/edge-api/getSites": {
      apiUrl: `https://api.benrogo.net/edge-api/getSites?page=${Number(searchParams.get("page")) || 1}`,
      dbQuery: "SELECT url,request_count,check_status FROM site_summary ORDER BY request_count DESC LIMIT ?,81",
      dbParams: [(Number(searchParams.get("page")) - 1 || 0) * 80],
      transformDBResult: (data) => {
        return data.map(({ url, request_count, check_status }) => ({
          u: btoa(url),
          r: request_count,
          s: check_status,
        }));
      },
      formatResponse: (data) => {
        let encoded = btoa(JSON.stringify(data));
        let shift = (Math.floor(Math.random() * encoded.length) + 1).toString();
        return shiftText(encoded, shift) + ":" + shift + ":FUCKITWEBALL";
      },
      headers: { "Content-Type": "text/plain" },
      cacheEnabled: true,
    },
    // BYOD domain registration API
    "/edge-api/registerBYOD": {
      apiUrl: "https://byod.benrogo.net/registerBYOD",
      dbQuery: null,
      dbParams: [],
      transformDBResult: (data) => data,
      formatResponse: (data) => JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      cacheEnabled: false,
    },
    // Announcements / notifications API
    "/edge-api/getAnnouncement": {
      "apiUrl": "https://api.benrogo.net/edge-api/getAnnouncement",
      dbQuery: null,
      dbParams: [],
      transformDBResult: (data) => data,
      formatResponse: (data) => JSON.stringify(data),
      headers: { "Content-Type": "text/plain" },
      cacheEnabled: false,
    },
  };

  // Try local DB first, if that fails then try edge DB
if (pathname === "/envtest") {
  return new Response(await env.DB.prepare("SELECT * FROM site_summary"));
}

  if (fetchConfig[pathname]) {
    const { apiUrl, dbQuery, dbParams, transformDBResult, formatResponse, headers, cacheEnabled } = fetchConfig[pathname];
    if (dbQuery) {
      const { results, source } = await fetchData(apiUrl, dbQuery, dbParams, env, "EDGE-DB", transformDBResult);
      response = new Response(formatResponse(results), {
        headers: { ...headers, "Cache-Control": "s-maxage=1800, max-age=0, public", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "X-Rogo-Source": source },
      });
    } else {
      const proxyResponse = await fetch(apiUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== "GET" ? await request.text() : null,
      });
      response = new Response(proxyResponse.body, { status: proxyResponse.status, headers: { ...proxyResponse.headers, "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" } });
    }
    if (cacheEnabled) {
      await cache.put(cacheKey, response.clone());
    }
    return response;
  }

  // If request doesn't match an edge-api path, try static files
  return env.ASSETS.fetch(request);
}

export default { fetch: handleRequest };