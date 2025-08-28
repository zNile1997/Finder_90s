export default {
  async fetch(request, env) {
    return new Response("Worker online ✅", { status: 200 });
  }
}
