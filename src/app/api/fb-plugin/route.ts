import { NextResponse } from "next/server";

const FB_URL =
  "https://www.facebook.com/plugins/page.php" +
  "?href=https%3A%2F%2Fwww.facebook.com%2FDailyGuardianPH" +
  "&tabs=timeline&width=340&height=700" +
  "&small_header=false&adapt_container_width=true" +
  "&hide_cover=false&show_facepile=true&appId";

// Injected into the proxied HTML:
// 1. Intercepts XHR/fetch so Facebook's AJAX calls go through our /api/fb-ajax proxy
// 2. Removes the hardcoded 130px header height constraint
const INJECT = `
<style>
  [style*="height: 130px"] { height: auto !important; min-height: 100px !important; }
  [style*="max-height: 130px"] { max-height: none !important; }
</style>
<script>
(function(){
  function proxy(url){
    if(typeof url==='string' && url.match(/https?:\\/\\/(www\\.|static\\.|scontent\\.)?f?bcdn?\\.net|facebook\\.com/)
      && !url.includes('/api/fb-ajax')){
      return '/api/fb-ajax?url='+encodeURIComponent(url);
    }
    return url;
  }
  // Intercept fetch
  var _f=window.fetch;
  window.fetch=function(u,o){return _f.call(this,proxy(u),o);};
  // Intercept XHR
  var _open=XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open=function(m,u){
    return _open.call(this,m,proxy(u),[].slice.call(arguments,2));
  };
})();
</script>`;

export async function GET() {
  try {
    const res = await fetch(FB_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return new NextResponse("Failed to load", { status: 502 });

    let html = await res.text();

    // Fix hardcoded header height constraint
    html = html
      .replace(/style="height:\s*130px;"/g, 'style="height:auto;min-height:100px;"')
      .replace(/style="max-height:\s*130px;"/g, 'style="max-height:none;"');

    // Inject XHR interceptor + CSS before </head>
    html = html.replace("</head>", INJECT + "</head>");

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch {
    return new NextResponse("Failed to load", { status: 502 });
  }
}
