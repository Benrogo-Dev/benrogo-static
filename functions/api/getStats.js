function shiftText(text, n) {
    n = n % text.length;
    return text.slice(n) + text.slice(0, n);
}

const getStats = async (context) => {
    const cache = caches.default;
    const url = new URL(context.request.url)
    const searchParams = url.searchParams;

    let response = await cache.match(context.request);

    if (response) {
      response = new Response(response.body, response);
      return response;
    } else {
        return new Response(
            `UNCACHED ${Math.random()}`
        );
    }
};

export const onRequest = [getStats];