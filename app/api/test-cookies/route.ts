export async function GET(req: Request) {
  const cookie = req.headers.get("cookie");
  console.log("cookie", cookie);

  const token = cookie
    ?.split(";")
    .find((c) => c.trim().startsWith("access_token="))
    ?.split("=")
    .pop();

  console.log("access_token", token);

  const user = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (user.ok) {
    console.log("user", await user.json());
  } else {
    console.log("NO USER");
  }

  return new Response("Hello World", { status: 200 });
}
