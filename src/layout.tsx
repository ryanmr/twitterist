import "hono/jsx";
import { PropsWithChildren } from "hono/jsx";

export interface LayoutProps extends PropsWithChildren {}

export function Layout(props: LayoutProps) {
  return (
    <html>
      <head>
        <title>Twitterist</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        {props.children}
        <script src="/script.js" />
      </body>
    </html>
  );
}
