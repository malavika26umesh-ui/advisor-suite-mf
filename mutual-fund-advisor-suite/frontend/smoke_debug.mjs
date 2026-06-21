import { chromium } from "playwright";

const FRONTEND_URL = "https://advisor-suite-mf-frontend.vercel.app";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on("console", (msg) => console.log("CONSOLE:", msg.type(), msg.text()));
  page.on("requestfailed", (req) => console.log("REQ_FAILED:", req.url(), req.failure()?.errorText));
  page.on("response", (res) => {
    if (res.url().includes("/api/")) console.log("API_RESPONSE:", res.status(), res.url());
  });

  await page.goto(
    FRONTEND_URL + "/faq?q=" + encodeURIComponent("What is the exit load for Parag Parikh Flexi Cap Fund?"),
    { waitUntil: "networkidle" }
  );
  await page.waitForTimeout(5000);

  const bodyText = await page.locator("body").textContent();
  console.log("BODY_SNIPPET:", bodyText.slice(0, 1500));

  await page.screenshot({ path: "smoke_debug.png", fullPage: true });
  await browser.close();
}

main().catch((err) => { console.error("ERROR", err); process.exit(1); });
