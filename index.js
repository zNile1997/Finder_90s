const GITHUB_RAW_URL = "https://raw.githubusercontent.com/zNile1997/Finder_90s/main/extra_items.json";

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === "POST") {
    try {
      const data = await request.json(); // { itemName, player, timestamp, serverId }
      let currentItems = await SECRET_ITEMS.get("foundItems", { type: "json" }) || [];
      currentItems.push(data);
      await SECRET_ITEMS.put("foundItems", JSON.stringify(currentItems));
      return new Response(JSON.stringify({ status: "success" }), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ status: "error", message: err.message }), { status: 400 });
    }
  }

  if (request.method === "GET") {
    try {
      const response = await fetch(GITHUB_RAW_URL);
      const githubData = await response.json();
      await SECRET_ITEMS.put("extraItemsFromGitHub", JSON.stringify(githubData));

      const foundItems = await SECRET_ITEMS.get("foundItems", { type: "json" }) || [];

      return new Response(JSON.stringify({
        status: "success",
        foundItems,
        extraItems: githubData
      }), { headers: { "Content-Type": "application/json" }});
    } catch (err) {
      return new Response(JSON.stringify({ status: "error", message: err.message }), { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
}
