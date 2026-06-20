import requests
from bs4 import BeautifulSoup
from langchain_core.tools import tool

@tool
def scrape_varsity(search_query: str) -> str:
    """Scrapes Zerodha Varsity for a given search query and returns the article content.
    Use this tool when you need more educational context about mutual funds, investing, or finance.
    """
    try:
        url = f"https://zerodha.com/varsity/?s={search_query.replace(' ', '+')}"
        res = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        if res.status_code != 200:
            return "Failed to search Varsity."

        soup = BeautifulSoup(res.text, "html.parser")
        links = soup.select("a")
        # Find the first valid chapter link
        article_url = None
        for link in links:
            if "href" in link.attrs and "/chapter/" in link["href"]:
                article_url = link["href"]
                break
        
        if not article_url:
            return "No relevant article found on Varsity."
            
        article_res = requests.get(article_url, headers={"User-Agent": "Mozilla/5.0"})
        if article_res.status_code != 200:
            return f"Failed to fetch article from {article_url}."
            
        article_soup = BeautifulSoup(article_res.text, "html.parser")
        paragraphs = article_soup.find_all("p")
        if paragraphs:
            text = "\n".join([p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True)])
            return f"Source: {article_url}\n\nContent:\n{text[:2000]}"
            
        return f"Could not extract content from {article_url}."
    except Exception as e:
        return f"Error scraping Varsity: {str(e)}"
