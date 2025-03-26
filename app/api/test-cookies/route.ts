export async function GET(req: Request) {
  console.log(req);
  return new Response("Hello World", { status: 200 });
}
