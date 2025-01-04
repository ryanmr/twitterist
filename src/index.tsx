import { Hono } from "hono";
import { ConversionRequest, ConversionRequestSchema, convert } from "./convert";
import { Layout } from "./layout";

const app = new Hono<{ Bindings: CloudflareBindings }>();

/**
 * Landing page route.
 */
app.get("/", (ctx) => {
  return ctx.html(
    <Layout>
      <h1>Twitterist</h1>
      <main>
        <form method="post" action="/convert">
          <label>
            URL:{" "}
            <input
              type="text"
              name="url"
              placeholder="Enter x.com URL"
              required
            />
          </label>
          <fieldset>
            <legend>Referrer Mode</legend>
            <div class="group">
              <label>
                <input type="radio" name="referrerMode" value="keep" /> Keep
              </label>
              <label>
                <input
                  type="radio"
                  name="referrerMode"
                  value="randomize"
                  checked={true}
                />{" "}
                Randomize
              </label>
              <label>
                <input type="radio" name="referrerMode" value="remove" /> Remove
              </label>
            </div>
          </fieldset>
          <button type="submit">Convert</button>
        </form>
        <hr />

        <div class="text-sm credits">
          <ul>
            <li>
              <a href="https://twitter.com/ryanmr">twitter</a>
            </li>
            <li>
              <a href="https://github.com/ryanmr/twitterist">repository</a>
            </li>
          </ul>
        </div>
      </main>
    </Layout>
  );
});

/**
 * Form route.
 */
app.post("/convert", async (ctx) => {
  const body = await ctx.req.parseBody();
  const url = `${body.url}`;
  const referrerMode = (body.referrerMode ||
    "randomize") as ConversionRequest["referrerMode"];
  const req: ConversionRequest = { url, referrerMode };
  return handleConversion(ctx, req);
});

/**
 * Prefix route. Add <root>/https://x.com/... to automatically parse and convert it.
 */
app.get("/:urlSegment/*", async (ctx) => {
  const fullUrl = ctx.req.path.slice(1);
  console.log({ fullUrl });
  const referrerMode = "randomize";
  const req: ConversionRequest = { url: fullUrl, referrerMode };
  return handleConversion(ctx, req);
});

export default app;

function renderConversionPage(
  ctx: any,
  originalUrl: string,
  convertedUrl: string
) {
  return ctx.html(
    <Layout>
      <h1>Twitterist</h1>
      <h2>🎉 Converted successfully!</h2>

      <main>
        <table>
          <tr>
            <td>
              <b>Original URL</b>
            </td>
            <td>
              <a class="text-sm" href={originalUrl} target="_blank">
                {originalUrl}
              </a>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <input type="text" value={originalUrl} data-copy-on-click />
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <b>Converted URL</b>
            </td>
            <td>
              <a class="text-sm" href={convertedUrl} target="_blank">
                {convertedUrl}
              </a>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <input type="text" value={convertedUrl} data-copy-on-click />
            </td>
          </tr>
        </table>
        <hr />
        <a href="/">Convert Another</a>
      </main>
    </Layout>
  );
}

// Utility function for handling validation and conversion
async function handleConversion(ctx: any, req: ConversionRequest) {
  const validatedReq = ConversionRequestSchema.safeParse(req);
  if (!validatedReq.success) {
    return ctx.html(
      <Layout>
        <h1>Error</h1>
        <p>Validation errors occurred:</p>
        <ul>
          {validatedReq.error.errors.map((error) => (
            <li>{error.message}</li>
          ))}
        </ul>
        <a href="/">Go Back</a>
      </Layout>
    );
  }

  const { url: validatedUrl } = validatedReq.data;

  try {
    const convertedUrl = convert({
      url: validatedReq.data.url,
      referrerMode: validatedReq.data.referrerMode,
    });
    return renderConversionPage(ctx, validatedUrl, convertedUrl);
  } catch (e) {
    return ctx.html(
      <Layout>
        <h1>Error</h1>
        <p>There was an issue processing your request. Please try again.</p>
        <a href="/">Go Back</a>
      </Layout>
    );
  }
}
