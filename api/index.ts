import { ServerRequest } from "https://deno.land/std@0.80.0/http/server.ts";
import { readerFromStreamReader } from "https://deno.land/std@0.80.0/io/mod.ts";
import { ms } from "https://deno.land/x/ms@v0.1.0/ms.ts";

export default async (req: ServerRequest) => {
  const { pathname, search } = new URL(req.url, "http://localhost");
  console.log(req.url, pathname, search);
  const age = (ms(pathname.slice(1)) as number / 1000).toFixed();
  const url = decodeURIComponent(search.slice(1));

  const headers = new Headers({
    "Cache-Control": `max-age=${age}, public`,
  });

  const body = (await fetch(url)).body!;
  const reader = readerFromStreamReader(body.getReader());

  req.respond({ headers, body: reader });
};
