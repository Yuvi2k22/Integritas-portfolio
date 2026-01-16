import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const html = `
  <html>
    <body>
      <script>
        (function() {
          const code = "${code}";
          if (window.opener) {
            window.opener.postMessage({ code }, "*");
          }
          localStorage.setItem('notionCode', code);
          window.close();
        })();
      </script>
      <p>You can close this window.</p>
    </body>
  </html>
`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
