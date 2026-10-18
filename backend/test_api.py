import os, tempfile

os.environ["DB_PATH"] = os.path.join(tempfile.mkdtemp(), "t.db")
from fastapi.testclient import TestClient
from app.main import app

c = TestClient(app)


def test_flow():
    assert c.get("/api/stats").json()["deals"] == 6
    assert c.post("/api/auth/otp", json={"phone": "123"}).status_code == 422
    code = c.post("/api/auth/otp", json={"phone": "09121234567"}).json()["demo_code"]
    assert c.post("/api/auth/verify", json={"phone": "09121234567", "code": "x"}).status_code == 400
    h = {"Authorization": "Bearer " + c.post("/api/auth/verify", json={"phone": "09121234567", "code": code}).json()["token"]}
    assert c.post("/api/deals/shafa-lab/invest", json={"amount": 1000}, headers=h).status_code == 422
    assert c.post("/api/deals/shafa-lab/invest", json={"amount": 10**12}, headers=h).status_code == 409
    before = c.get("/api/deals/shafa-lab").json()
    after = c.post("/api/deals/shafa-lab/invest", json={"amount": 2_000_000}, headers=h).json()
    assert after["raised"] == before["raised"] + 2_000_000 and after["investors"] == before["investors"] + 1
    p = c.get("/api/me/portfolio", headers=h).json()
    assert p["total"] == 2_000_000 and p["holdings"][0]["slug"] == "shafa-lab"
    assert c.get("/api/me/portfolio").status_code == 401
