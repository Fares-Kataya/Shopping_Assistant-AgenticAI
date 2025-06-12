import os
import traceback
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import asyncio
from dotenv import load_dotenv

from chains.recommend_chain import recommend_category
from chains.search_chain import recommend_top_3_products
from chains.purchase_chain import log_purchase
from memory.memory_manager import update_buyer_history

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
model = "GOOGLE"
API_KEY = os.getenv(f"{model}_API_KEY")
MODEL = os.getenv(f"{model}_MODEL")
PROVIDER = os.getenv(f"{model}_PROVIDER")
API_URL = os.getenv("API_URL")

print(f"DEBUG: API_KEY loaded: {'Set' if API_KEY else 'NOT SET'}")
print(f"DEBUG: MODEL loaded: {MODEL}")
print(f"DEBUG: PROVIDER loaded: {PROVIDER}")

class RunRequest(BaseModel):
    user_id: str
    history: List[Dict[str, Any]]


class PurchaseRequest(BaseModel):
    user_id: str
    product: Dict[str, Any]


@app.post("/run-shopping-flow")
async def run_flow(req: RunRequest):
    try:
        print(f"Starting recommendation for user_id: {req.user_id}")
        print(f"Received history from client: {req.history}")
        if not API_KEY or not MODEL or not PROVIDER:
            print("ERROR: Missing API_KEY, MODEL, or PROVIDER. Cannot proceed with recommendation.")
            raise HTTPException(status_code=500, detail="LLM configuration missing on server.")

        loop = asyncio.get_event_loop()
        rec = await loop.run_in_executor(
            None,
            lambda: recommend_category(
                user_id=req.user_id,
                history=req.history,
                api_key=API_KEY,
                model_name=MODEL,
                model_provider=PROVIDER
            )
        )

        print(f"Recommendation result: {rec}")
        print(f"Type of rec: {type(rec)}")

        if rec is None:
            raise HTTPException(
                status_code=500, detail="recommend_category returned None")

        if not isinstance(rec, dict):
            raise HTTPException(
                status_code=500, detail=f"Expected dict, got {type(rec)}")

        if "category" not in rec or "reason" not in rec:
            raise HTTPException(
                status_code=500,
                detail=f"Missing required keys. Got keys: {list(rec.keys()) if isinstance(rec, dict) else 'N/A'}"
            )
        avg_price = sum(item.get("price", 0) for item in req.history) / max(len(req.history), 1)
        products = recommend_top_3_products(rec["category"], avg_price)

        return {"category": rec["category"], "reason": rec["reason"], "products": products}

    except Exception as e:
        print(f"Error in run_flow: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/log-purchase")
async def log_purchase_endpoint(req: PurchaseRequest):
    try:
        result = log_purchase(req.user_id, req.product)
        print("✅ log_purchase result:", result)
        return result
    except Exception as e:
        print("❌ Error in log_purchase_endpoint:", e)
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/update-memory")
async def update_memory_endpoint(req: PurchaseRequest):
    try:
        payload = await req.json()
        user_id = payload["user_id"]
        product = payload["product"]
        update_buyer_history(user_id, product)
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
