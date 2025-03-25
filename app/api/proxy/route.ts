import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log("apiUrl", apiUrl);

  if (!apiUrl) {
    return NextResponse.json(
      { error: "API URL no está configurada" },
      { status: 500 }
    );
  }

  const cookieHeader = req.headers.get("cookie") || "";
  console.log("cookieHeader", cookieHeader);

  const { searchParams } = new URL(req.url);
  console.log("searchParams", searchParams);
  const endpoint = searchParams.get("endpoint");
  console.log("endpoint", endpoint);
  searchParams.delete("endpoint");

  if (!endpoint) {
    return NextResponse.json({ error: "Endpoint requerido" }, { status: 400 });
  }

  const finalUrl = `${apiUrl}/${endpoint}?${searchParams.toString()}`;
  console.log("finalUrl", finalUrl);

  const response = await fetch(finalUrl, {
    method: "GET",
    headers: {
      Cookie: cookieHeader,
    },
  });
  console.log("response", response.ok);

  const data = await response.json();
  console.log("data", data);
  return NextResponse.json(data, { status: response.status });
}
