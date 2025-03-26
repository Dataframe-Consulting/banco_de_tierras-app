export async function GET(req: Request) {
  const cookie = req.headers.get("cookie");
  console.log("cookie", cookie);

  console.log(
    "accces_token",
    cookie
      ?.split(";")
      .find((c) => c.trim().startsWith("access_token="))
      ?.split("=")
      .pop()
  );

  const user = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: {
      // Authorization: `${token?.value}`,
      Authorization: `${cookie
        ?.split(";")
        .find((c) => c.trim().startsWith("access_token="))
        ?.split("=")
        .pop()},
        }`,
    },
  });

  if (user.ok) {
    console.log("user", await user.json());
  } else {
    console.log("NO USER");
  }

  return new Response("Hello World", { status: 200 });
}
