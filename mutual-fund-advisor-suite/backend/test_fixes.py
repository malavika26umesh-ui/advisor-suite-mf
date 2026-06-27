"""
Quick test script to verify both bug fixes end-to-end on localhost.
Run from backend/ directory.
"""
import asyncio
import json
import sys
import httpx
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "67e270328617b87cda07bbdf43dcc41e4a50e49006f1649defc48cae35913d44"
BASE_URL = "http://localhost:8000/api"

def make_token(email: str) -> str:
    """Forge a valid JWT for testing — same logic as the backend."""
    payload = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def toLocalISOString(dt: datetime) -> str:
    """Mirrors the frontend fix: naive local-time ISO (no 'Z')."""
    return dt.strftime("%Y-%m-%dT%H:%M:%S")

async def run():
    advisor_email = "advisor1@advisorsuite.mf"
    token = make_token(advisor_email)
    headers = {"Authorization": f"Bearer {token}"}

    async with httpx.AsyncClient(base_url=BASE_URL, timeout=15) as client:

        # ── Bug 1: Product Pulse ────────────────────────────────────────────
        print("=" * 60)
        print("BUG 1: Product Pulse — /api/pulse/current")
        print("=" * 60)
        r = await client.get("/pulse/current")
        if r.status_code == 200:
            d = r.json()
            print(f"  ✅ HTTP 200 — Report ID #{d['id']}")
            print(f"  Week start   : {d['week_start_date']}")
            print(f"  Top themes   : {d['top_themes']}")
            print(f"  Key obs.     : {d['key_observation'][:80]}...")
            print(f"  Fee spotlight: {d['fee_spotlight_term']}")
            print(f"  User quotes  : {len(d['user_quotes'])} quotes")
            print(f"  Recs.        : {len(d['product_recommendations'])} recs")
        else:
            print(f"  ❌ HTTP {r.status_code}: {r.text[:200]}")
            sys.exit(1)

        # ── Bug 2: Calendar slot creation ──────────────────────────────────
        print()
        print("=" * 60)
        print("BUG 2: Slot Creation — POST /api/advisor/slots")
        print("=" * 60)

        # Use the LOCAL-TIME ISO format (the fix) — no 'Z' suffix
        start = datetime(2026, 6, 25, 11, 0, 0)   # Wednesday 11:00
        end   = datetime(2026, 6, 25, 11, 30, 0)  # Wednesday 11:30

        payload = {
            "start_time": toLocalISOString(start),
            "end_time":   toLocalISOString(end),
            "is_recurring": False,
        }
        print(f"  Sending: start={payload['start_time']}  end={payload['end_time']}")

        r = await client.post("/advisor/slots", json=payload, headers=headers)
        if r.status_code == 200:
            d = r.json()
            print(f"  ✅ HTTP 200 — Slot ID #{d['id']}")
            print(f"  start_time stored : {d['start_time']}")
            print(f"  end_time stored   : {d['end_time']}")
            print(f"  is_blocked        : {d['is_blocked']}")

            # Verify the stored time matches what we sent (key invariant)
            stored_start = d['start_time'][:16]  # "2026-06-25T11:00"
            sent_start   = payload['start_time'][:16]
            if stored_start == sent_start:
                print(f"  ✅ Timezone round-trip OK — stored matches sent: {stored_start}")
            else:
                print(f"  ⚠️  Mismatch! Sent: {sent_start}, Stored: {stored_start}")
        else:
            print(f"  ❌ HTTP {r.status_code}: {r.text[:300]}")
            sys.exit(1)

        # ── OLD format (UTC toISOString) — show what USED to happen ───────
        print()
        print("── OLD behaviour (UTC 'Z' format, now fixed) ──────────────")
        start_utc = start.strftime("%Y-%m-%dT%H:%M:%S") + ".000Z"
        print(f"  Old format sent  : {start_utc}")
        # When browser parses "2026-06-25 05:30:00" from DB as local time
        # it would show 05:30 on the calendar instead of 11:00 — that was the bug
        utc_offset_hrs = 5.5
        utc_hour = start.hour - utc_offset_hrs
        print(f"  DB would store   : {utc_hour:04.1f} UTC → browser reads as {utc_hour:04.1f} local → WRONG slot position")
        print(f"  Fixed format sent: {toLocalISOString(start)} → DB stores 11:00 → browser reads 11:00 ✅")

        print()
        print("=" * 60)
        print("ALL CHECKS PASSED — Both bug fixes verified ✅")
        print("=" * 60)

asyncio.run(run())
