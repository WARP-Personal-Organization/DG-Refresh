export default function FacebookPagePlugin() {
  const src =
    "https://www.facebook.com/plugins/page.php" +
    "?href=https%3A%2F%2Fwww.facebook.com%2FDailyGuardianPH" +
    "&tabs=timeline" +
    "&width=340" +
    "&height=700" +
    "&small_header=false" +
    "&adapt_container_width=true" +
    "&hide_cover=false" +
    "&show_facepile=false" +
    "&appId";

  return (
    // Clip the top 130px (Facebook's page-info header) and show only the posts
    <div style={{ overflow: "hidden", height: "570px", borderRadius: "0.75rem" }}>
      <iframe
        src={src}
        width="340"
        height="700"
        style={{
          border: "none",
          display: "block",
          width: "100%",
          marginTop: "-130px",
        }}
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        title="Daily Guardian Facebook Page"
      />
    </div>
  );
}
