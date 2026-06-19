import asyncio
import json
import os
import httpx
from datetime import datetime
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from app.core.config import settings
from app.models.db_models import NavData

# Setup DB
engine = create_async_engine(settings.DATABASE_URL, echo=False)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

async def refresh_nav():
    # Load top 20 schemes
    top20_path = os.path.join("corpus", "sources", "top20_schemes.json")
    with open(top20_path, "r") as f:
        data = json.load(f)
        schemes = data.get("schemes", [])

    async with httpx.AsyncClient() as client:
        async with async_session_maker() as session:
            for scheme in schemes:
                scheme_id = scheme["id"]
                scheme_name = scheme["name"]
                
                # Step 1: Search for the scheme to get its schemeCode
                search_url = f"https://api.mfapi.in/mf/search?q={scheme_name.split()[0]}" # using first word for broader match
                try:
                    search_resp = await client.get(search_url)
                    search_resp.raise_for_status()
                    search_results = search_resp.json()
                    
                    if not search_results:
                        print(f"No results found for {scheme_name}")
                        continue
                        
                    # Basic match, take the first one or exact match
                    scheme_code = search_results[0]["schemeCode"]
                    
                    # Step 2: Fetch NAV data
                    nav_url = f"https://api.mfapi.in/mf/{scheme_code}"
                    nav_resp = await client.get(nav_url)
                    nav_resp.raise_for_status()
                    nav_data = nav_resp.json()
                    
                    if nav_data and "data" in nav_data and len(nav_data["data"]) > 0:
                        latest_nav = nav_data["data"][0]
                        nav_value = float(latest_nav["nav"])
                        nav_date = latest_nav["date"]
                        
                        # Upsert or Insert
                        existing = await session.get(NavData, scheme_id)
                        if existing:
                            existing.nav_value = nav_value
                            existing.nav_date = nav_date
                            existing.fetched_at = datetime.utcnow()
                        else:
                            new_nav = NavData(
                                scheme_id=scheme_id,
                                scheme_name=scheme_name,
                                nav_value=nav_value,
                                nav_date=nav_date,
                                fetched_at=datetime.utcnow()
                            )
                            session.add(new_nav)
                        print(f"Updated NAV for {scheme_name}: {nav_value} on {nav_date}")
                    else:
                        print(f"No NAV data returned for {scheme_name}")
                except Exception as e:
                    print(f"Error fetching NAV for {scheme_name}: {e}")
                    
            await session.commit()
            print("NAV refresh completed.")

if __name__ == "__main__":
    asyncio.run(refresh_nav())
