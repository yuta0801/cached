import { ServerRequest } from "https://deno.land/std@0.80.0/http/server.ts";
import { readerFromStreamReader } from "https://deno.land/std@0.80.0/io/mod.ts";
import { ms } from "https://deno.land/x/ms@v0.1.0/ms.ts";

export default async (req: ServerRequest) => {
  const { pathname, search } = new URL(req.url, "http://localhost");

  const age = (ms(pathname.slice(1)) as number / 1000).toFixed();
  const url = decodeURIComponent(search.slice(1));

  const res = await fetch(url);
  const body = res.body!;
  const reader = readerFromStreamReader(body.getReader());

  const headers = res.headers;
  headers.set("Cache-Control", `max-age=${age}, public`);

  req.respond({ headers, body: reader });
};
