from app import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_products_list():
    res = client.get("/products")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert all("id" in p and "name" in p for p in data)
