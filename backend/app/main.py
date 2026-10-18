import json
import os
import re
import secrets
import sqlite3
from datetime import datetime, timedelta, timezone

from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel

from .seed import DEALS

DB = os.getenv("DB_PATH", "data.db")
MIN_INVEST = 500_000  # Toman
DEMO_OTP = os.getenv("DEMO_OTP", "1") == "1"  # echo the OTP back until an SMS provider is wired
PHONE = re.compile(r"^09\d{9}$")

app = FastAPI(title="Iran Funders Club API")
otps: dict[str, str] = {}  # ponytail: in-memory OTPs, lost on restart; move to Redis when multi-instance


def q(sql, args=(), one=False):
    with sqlite3.connect(DB) as c:
        c.row_factory = sqlite3.Row
        rows = [dict(r) for r in c.execute(sql, args).fetchall()]
    return (rows[0] if rows else None) if one else rows


def now():
    return datetime.now(timezone.utc)


def init():
    q("CREATE TABLE IF NOT EXISTS deals (slug TEXT PRIMARY KEY, data TEXT, target INT, raised INT, investors INT, closes_at TEXT)")
    q("CREATE TABLE IF NOT EXISTS users (phone TEXT PRIMARY KEY, token TEXT UNIQUE)")
    q("CREATE TABLE IF NOT EXISTS investments (id INTEGER PRIMARY KEY, phone TEXT, slug TEXT, amount INT, created_at TEXT)")
    if not q("SELECT 1 FROM deals LIMIT 1"):
        for d in DEALS:
            q(
                "INSERT INTO deals VALUES (?,?,?,?,?,?)",
                (d["slug"], json.dumps(d), d["target"], d["raised"], d["investors"], (now() + timedelta(days=d["days"])).isoformat()),
            )


init()


def deal_out(row):
    d = json.loads(row["data"])
    d |= {k: row[k] for k in ("raised", "investors", "target")}
    d["days_left"] = max(0, (datetime.fromisoformat(row["closes_at"]) - now()).days)
    d["min_invest"] = MIN_INVEST
    return d


def current_user(authorization: str = Header("")):
    row = q("SELECT phone FROM users WHERE token=?", (authorization.removeprefix("Bearer "),), one=True)
    if not row:
        raise HTTPException(401, "unauthorized")
    return row["phone"]


@app.get("/api/health")
def health():
    return {"ok": True}


@app.get("/api/stats")
def stats():
    s = q("SELECT SUM(raised) raised, SUM(investors) investors, COUNT(*) deals FROM deals", one=True)
    return s | {"avg_return": round(sum(d["return"] for d in DEALS) / len(DEALS))}


@app.get("/api/deals")
def deals():
    return [deal_out(r) for r in q("SELECT * FROM deals ORDER BY raised * 1.0 / target DESC")]


@app.get("/api/deals/{slug}")
def deal(slug: str):
    row = q("SELECT * FROM deals WHERE slug=?", (slug,), one=True)
    if not row:
        raise HTTPException(404, "not_found")
    return deal_out(row)


class Phone(BaseModel):
    phone: str


class Verify(Phone):
    code: str


@app.post("/api/auth/otp")
def send_otp(body: Phone):
    if not PHONE.match(body.phone):
        raise HTTPException(422, "invalid_phone")
    otps[body.phone] = f"{secrets.randbelow(10000):04d}"
    return {"sent": True} | ({"demo_code": otps[body.phone]} if DEMO_OTP else {})


@app.post("/api/auth/verify")
def verify(body: Verify):
    if otps.get(body.phone) != body.code:
        raise HTTPException(400, "wrong_code")
    del otps[body.phone]
    token = secrets.token_urlsafe(32)
    q("INSERT INTO users VALUES (?,?) ON CONFLICT(phone) DO UPDATE SET token=excluded.token", (body.phone, token))
    return {"token": token, "phone": body.phone}


class Invest(BaseModel):
    amount: int


@app.post("/api/deals/{slug}/invest")
def invest(slug: str, body: Invest, phone: str = Depends(current_user)):
    if body.amount < MIN_INVEST:
        raise HTTPException(422, "min_amount")
    first = not q("SELECT 1 FROM investments WHERE phone=? AND slug=?", (phone, slug))
    with sqlite3.connect(DB) as c:  # one transaction: cap check + ledger insert
        cur = c.execute(
            "UPDATE deals SET raised=raised+?, investors=investors+? WHERE slug=? AND raised+?<=target AND closes_at>?",
            (body.amount, int(first), slug, body.amount, now().isoformat()),
        )
        if cur.rowcount == 0:
            raise HTTPException(409, "over_capacity")
        c.execute("INSERT INTO investments (phone, slug, amount, created_at) VALUES (?,?,?,?)", (phone, slug, body.amount, now().isoformat()))
    return deal(slug)


@app.get("/api/me/portfolio")
def portfolio(phone: str = Depends(current_user)):
    txs = q("SELECT slug, amount, created_at FROM investments WHERE phone=? ORDER BY id DESC", (phone,))
    by_deal = {d["slug"]: d for d in DEALS}
    holdings = {}
    for tx in txs:
        h = holdings.setdefault(tx["slug"], {k: by_deal[tx["slug"]][k] for k in ("slug", "name", "industry", "hue", "return", "months", "risk")} | {"amount": 0})
        h["amount"] += tx["amount"]
    total = sum(h["amount"] for h in holdings.values())
    expected = sum(h["amount"] * h["return"] / 100 * h["months"] / 12 for h in holdings.values())
    return {"phone": phone, "total": total, "expected_profit": round(expected), "holdings": list(holdings.values()), "transactions": txs}
