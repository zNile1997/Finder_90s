export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ✅ GET / -> tes online
    if (url.pathname === "/") {
      return new Response("Worker online ✅", { status: 200 });
    }

    // ✅ POST /log -> simpan data dari bot ke KV
    if (url.pathname === "/log" && request.method === "POST") {
      try {
        const body = await request.json();

        // simpan data di KV (key = timestamp, value = JSON)
        const key = `log-${Date.now()}`;
        await env.ROBOT_DATA.put(key, JSON.stringify(body));

        return new Response(
          JSON.stringify({ success: true, savedAs: key }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } catch (e) {
        return new Response("Invalid JSON", { status: 400 });
      }
    }

    // ✅ GET /list -> ambil semua log
    if (url.pathname === "/list") {
      const keys = await env.ROBOT_DATA.list();
      let allData = [];

      for (const k of keys.keys) {
        const val = await env.ROBOT_DATA.get(k.name);
        if (val) allData.push({ key: k.name, data: JSON.parse(val) });
      }

      return new Response(JSON.stringify(allData, null, 2), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // ✅ GET /secret -> contoh akses terakhir
    if (url.pathname === "/secret") {
      const keys = await env.ROBOT_DATA.list({ limit: 1 });
      if (keys.keys.length === 0) {
        return new Response("No secret found", { status: 404 });
      }

      const val = await env.ROBOT_DATA.get(keys.keys[0].name);
      return new Response(val, {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Not found", { status: 404 });
  }
};
