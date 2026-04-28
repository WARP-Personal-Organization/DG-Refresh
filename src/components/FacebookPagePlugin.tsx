export default function FacebookPagePlugin() {
  const src =
    "https://www.facebook.com/plugins/page.php" +
    "?href=https%3A%2F%2Fwww.facebook.com%2FDailyGuardianPH" +
    "&tabs=timeline" +
    "&width=340" +
    "&height=900" +
    "&small_header=true" +
    "&adapt_container_width=true" +
    "&hide_cover=true" +
    "&show_facepile=false" +
    "&appId";

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
        <span className="text-black font-black text-xs tracking-widest uppercase">Follow Us on Facebook</span>
      </div>

      {/* Clipped iframe — hides FB page header, shows posts only */}
      <div style={{ overflow: "hidden", height: "660px" }}>
        <iframe
          src={src}
          width="340"
          height="900"
          style={{
            border: "none",
            display: "block",
            width: "100%",
            marginTop: "-70px",
          }}
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          title="Daily Guardian Facebook Page"
        />
      </div>
    </div>
  );
}
