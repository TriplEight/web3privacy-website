import { run } from "jsr:@hugojosefson/run-simple@2.3.12";
import { join } from "jsr:@std/path@1.0.8";

const IMG_DIR = "./public/gen-img/events";

const data = {};
for await (const f of Deno.readDir(IMG_DIR)) {
  const [name, ext] = f.name.split(".");
  if (ext !== "png") {
    continue;
  }
  const explain = await run(`identify ${join(IMG_DIR, f.name)}`);
  const [_, format, resolution] = explain.split(" ");
  const [width, height] = resolution.split("x").map((c) => Number(c));

  data[name] = { format, width, height, ratio: width / height };
}

await Deno.writeTextFile(
  "./src/gen-images.json",
  JSON.stringify(data, null, 2),
);
console.log(`File ./src/gen-images.json saved`);
