import { chromium } from "playwright";

const FRONTEND_URL = "https://advisor-suite-mf-frontend.vercel.app";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const results = {};

  // --- a. Home page loads ---
  const homeResp = await page.goto(FRONTEND_URL + "/", { waitUntil: "networkidle" });
  results.home_status = homeResp.status();
  results.home_title = await page.title();

  // --- b. FAQ Centre query ---
  await page.goto(
    FRONTEND_URL + "/faq?q=" + encodeURIComponent("What is the exit load for Parag Parikh Flexi Cap Fund?"),
    { waitUntil: "networkidle" }
  );
  // Wait for either an answer or an error state to settle
  await page.waitForTimeout(4000);

  const sourcesLabel = await page.locator("text=Sources:").first();
  results.has_sources_label = await sourcesLabel.count() > 0;

  const disclaimer = await page.locator('[aria-label="Compliance disclaimer"]').first();
  results.has_disclaimer = await disclaimer.count() > 0;
  results.disclaimer_text = results.has_disclaimer ? (await disclaimer.textContent()) : null;

  const bodyText = await page.locator("body").textContent();
  results.answer_mentions_exit_load = bodyText.toLowerCase().includes("exit load");

  await page.screenshot({ path: "smoke_test_faq.png", fullPage: true });

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error("SMOKE_TEST_ERROR", err);
  process.exit(1);
});
