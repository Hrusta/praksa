from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from .models import Product, Order
import json
from pathlib import Path
from datetime import datetime, timedelta
import smtplib
from email.message import EmailMessage

SECRET_KEY = "CHANGE_THIS_TO_A_RANDOM_SECRET"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
SMTP_SERVER = "localhost"
SMTP_PORT = 25
ADMIN_EMAIL = "faris.hrustic@hotmai.com"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
DATA_DIR   = Path(__file__).parent / "data"
PROD_FILE  = DATA_DIR / "products.json"
ORD_FILE   = DATA_DIR / "orders.json"
USERS_FILE = DATA_DIR / "users.json"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def read_json(path: Path):
    return json.loads(path.read_text())

def write_json(path: Path, data):
    path.write_text(json.dumps(data, default=str, indent=2))

def authenticate_user(username: str, password: str):
    return any(u["username"] == username and u["password"] == password for u in read_json(USERS_FILE))

def user_exists(username: str):
    return any(u["username"] == username for u in read_json(USERS_FILE))

def create_access_token(data: dict, expires: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_admin(token: str = Depends(oauth2_scheme)):
    exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate":"Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if not sub or not user_exists(sub):
            raise exc
    except JWTError:
        raise exc
    return sub

def send_order_email(order: dict):
    msg = EmailMessage()
    msg["Subject"] = f"New Order #{order['id']}"
    msg["From"]    = "no-reply@yourshop.com"
    msg["To"]      = ADMIN_EMAIL

    lines = [
        f"Order ID: {order['id']}",
        f"Created: {order['createdAt']}",
        f"Status: {order['status']}",
        "",
        "Customer:",
        f"  {order['customer']['name']} {order['customer']['surname']}",
        f"  {order['customer']['address']}",
        f"  {order['customer']['phone']}",
        f"  {order['customer'].get('email','(no email)')}",
        "",
        "Items:"
    ]
    for i in order["items"]:
        lines.append(f"  - {i['name']} x{i['qty']} @ {i['price']}€")
    msg.set_content("\n".join(lines))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as smtp:
        smtp.send_message(msg)

@app.post("/register")
def register(reg: dict):
    users = read_json(USERS_FILE)
    if not users:
        u, p = reg.get("username"), reg.get("password")
        if not u or not p:
            raise HTTPException(400, "username and password required")
        users.append({"username": u, "password": p})
        write_json(USERS_FILE, users)
        return {"msg": "First admin created"}
    a_u, a_p = reg.get("adminUsername"), reg.get("adminPassword")
    n_u, n_p = reg.get("username"), reg.get("password")
    if not all([a_u, a_p, n_u, n_p]):
        raise HTTPException(400, "adminUsername, adminPassword, username and password required")
    if not authenticate_user(a_u, a_p):
        raise HTTPException(401, "Invalid admin credentials")
    if any(u["username"] == n_u for u in users):
        raise HTTPException(400, "Username already exists")
    users.append({"username": n_u, "password": n_p})
    write_json(USERS_FILE, users)
    return {"msg": "User registered successfully"}

@app.post("/token")
def login_for_token(form: OAuth2PasswordRequestForm = Depends()):
    if not authenticate_user(form.username, form.password):
        raise HTTPException(401, "Incorrect username or password")
    token = create_access_token({"sub": form.username})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/products", response_model=list[Product])
def list_products():
    return read_json(PROD_FILE)

@app.get("/products/{id}", response_model=Product)
def get_product(id: int):
    for p in read_json(PROD_FILE):
        if p["id"] == id:
            return p
    raise HTTPException(404, "Product not found")

@app.post("/products", response_model=Product, dependencies=[Depends(get_current_admin)])
def create_product(prod: Product):
    prods = read_json(PROD_FILE)
    prods.append(prod.dict())
    write_json(PROD_FILE, prods)
    return prod

@app.put("/products/{id}", response_model=Product, dependencies=[Depends(get_current_admin)])
def update_product(id: int, upd: Product):
    prods = read_json(PROD_FILE)
    for idx, p in enumerate(prods):
        if p["id"] == id:
            prods[idx] = upd.dict()
            write_json(PROD_FILE, prods)
            return upd
    raise HTTPException(404, "Product not found")

@app.delete("/products/{id}", dependencies=[Depends(get_current_admin)])
def delete_product(id: int):
    write_json(PROD_FILE, [p for p in read_json(PROD_FILE) if p["id"] != id])
    return {"ok": True}

@app.post("/orders", response_model=Order)
def create_order(order: Order):
    ords = read_json(ORD_FILE)
    o = order.dict()
    o["createdAt"] = datetime.utcnow().isoformat()
    o["status"]    = "Accepted"
    o["totalPrice"] = sum(item["price"] * item["qty"] for item in o["items"])
    ords.append(o)
    write_json(ORD_FILE, ords)
    try:
        send_order_email(o)
    except:
        pass
    return o

@app.get("/orders", response_model=list[Order], dependencies=[Depends(get_current_admin)])
def list_orders():
    return read_json(ORD_FILE)

@app.get("/orders/{id}", response_model=Order, dependencies=[Depends(get_current_admin)])
def get_order(id: int):
    for o in read_json(ORD_FILE):
        if o["id"] == id:
            return o
    raise HTTPException(404, "Order not found")

@app.patch("/orders/{id}", response_model=Order, dependencies=[Depends(get_current_admin)])
def update_order(id: int, status: dict):
    ords = read_json(ORD_FILE)
    for idx, o in enumerate(ords):
        if o["id"] == id:
            o["status"]     = status["status"]
            o["acceptedAt"] = datetime.utcnow().isoformat()
            ords[idx]       = o
            write_json(ORD_FILE, ords)
            return o
    raise HTTPException(404, "Order not found")
