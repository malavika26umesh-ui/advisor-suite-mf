import csv
import os
import random
import emoji
from datetime import datetime, timedelta
from google_play_scraper import Sort, reviews

# Target CSV path
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "../pulse_data.csv")

# Constants
APP_ID = "com.nextbillion.groww"
WEEKS_TO_SCRAPE = 12

def remove_emojis(text: str) -> str:
    return emoji.replace_emoji(text, replace='')

def is_valid_review(text: str) -> bool:
    if not text:
        return False
    text_no_emoji = remove_emojis(text).strip()
    if len(text_no_emoji.split()) < 4:
        return False
    return True

def get_recent_reviews(app_id: str, weeks: int):
    # Fetch reviews (fetch a batch, filter by date)
    result, continuation_token = reviews(
        app_id,
        lang='en', # defaults to 'en'
        country='in', # defaults to 'us'
        sort=Sort.NEWEST, # defaults to Sort.MOST_RELEVANT
        count=1000 # fetch a good chunk
    )
    
    cutoff_date = datetime.now() - timedelta(weeks=weeks)
    valid_reviews = []
    
    for r in result:
        review_date = r['at']
        if review_date < cutoff_date:
            continue
            
        content = r['content']
        rating = r['score']
        
        if is_valid_review(content):
            valid_reviews.append({
                "event_type": "reviews_data",
                "timestamp": review_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "topic_category": "",
                "user_text": content.replace("\n", " "),
                "rating": rating
            })
            
    return valid_reviews

def generate_mock_events():
    events = []
    now = datetime.now()
    
    # 1. Mock FAQ searches
    faq_queries = [
        ("fee_education", "What is the exit load for a thematic fund?"),
        ("fee_education", "Explain the total expense ratio and how it affects my returns"),
        ("fee_education", "How much stamp duty is levied on SIPs?"),
        ("fee_education", "What does STT mean when withdrawing mutual funds?"),
        ("key_concepts", "What is the difference between direct and regular mutual funds?"),
        ("fund_categories", "Are thematic funds more risky than index funds?"),
        ("investor_processes", "How to update nominee details for my mutual fund investment?")
    ]
    
    for i in range(15):
        bucket, query = random.choice(faq_queries)
        ts = now - timedelta(days=random.randint(1, 6), hours=random.randint(0, 23))
        events.append({
            "event_type": "faq_search",
            "timestamp": ts.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "topic_category": bucket,
            "user_text": query,
            "rating": ""
        })

    # 2. Mock Bookings
    booking_topics = ["portfolio_review", "new_investment", "tax_planning", "general_advice"]
    for i in range(10):
        topic = random.choice(booking_topics)
        ts = now - timedelta(days=random.randint(1, 6), hours=random.randint(0, 23))
        events.append({
            "event_type": "booking_created",
            "timestamp": ts.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "topic_category": topic,
            "user_text": "",
            "rating": ""
        })

    # 3. Mock Feedback
    ratings = ["very_useful", "somewhat_useful", "not_useful"]
    for i in range(10):
        rating = random.choices(ratings, weights=[0.7, 0.2, 0.1])[0]
        ts = now - timedelta(days=random.randint(1, 6), hours=random.randint(0, 23))
        events.append({
            "event_type": "meeting_feedback",
            "timestamp": ts.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "topic_category": "",
            "user_text": "",
            "rating": rating
        })

    return events

def main():
    print(f"Scraping reviews for {APP_ID} from the last {WEEKS_TO_SCRAPE} weeks...")
    app_reviews = get_recent_reviews(APP_ID, WEEKS_TO_SCRAPE)
    print(f"Found {len(app_reviews)} valid reviews.")
    
    print("Generating mock telemetry events...")
    mock_events = generate_mock_events()
    print(f"Generated {len(mock_events)} mock events.")
    
    all_data = mock_events + app_reviews
    
    # Write to CSV
    fields = ["event_type", "timestamp", "topic_category", "user_text", "rating"]
    with open(OUTPUT_FILE, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(all_data)
        
    print(f"Successfully generated {OUTPUT_FILE} with {len(all_data)} rows.")

if __name__ == "__main__":
    main()
