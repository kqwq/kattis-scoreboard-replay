// import fs from "fs";
import { parse } from "csv-parse";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  // const comp_file = String(url.searchParams.get("file"));
  // let location = `./static/${comp_file}`;

  const static_url =
    "https://raw.githubusercontent.com/wzid/kattis-scoreboard-replay/main/static/rmc2023.csv";

  const csv_data = [];
  const res = await fetch(static_url);
  const text = await res.text();

  const data = await new Promise((resolve) => {
    parse(text)
      .on("data", (row) => {
        // row = row.split(",");
        csv_data.push({
          name: row[1],
          problems: row.slice(6).map((s) => {
            const match = s.match(/(\d+)\n(\d+) min/);
            if (match)
              return { attempts: parseInt(match[1]), time: parseInt(match[2]) };
            return undefined;
          }),
        });
      })
      .on("end", () => resolve(csv_data));
  });

  return json(data);
}
