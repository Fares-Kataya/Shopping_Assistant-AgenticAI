from pydantic import BaseModel
from langchain.agents import Tool
from chains.recommend_chain import recommend_category
from chains.search_chain import recommend_top_3_products
from chains.purchase_chain import log_purchase
from chains.logging import load_recent_interactions
from memory.memory_manager import update_buyer_history
import requests


class NoInput(BaseModel):
    """No arguments."""


def run_shopping_flow(user_id: str, api_key: str, model_name: str, model_provider: str, spring_url: str):
    resp = requests.get(f"{spring_url}/{user_id}/history")
    resp.raise_for_status()
    history = resp.json().get("history", [])

    rec = recommend_category(user_id, history, api_key=api_key,
                             model_name=model_name, model_provider=model_provider)
    category, reason = rec["category"], rec["reason"]

    avg_price = sum(item["price"] for item in history) / (len(history) or 1)
    top3 = recommend_top_3_products(category, avg_price)

    if not top3:
        return f"No products found in category {category}."
    chosen = top3[0]
    purchase_res = log_purchase(user_id, chosen)

    update_buyer_history(user_id, chosen)

    return (
        f"Recommended category: {category} ({reason})\n"
        f"Top 3: {top3}\n"
        f"Purchased: {chosen['product']} → {purchase_res['message']}"
    )


def make_tools(user_id, api_key, model_name, model_provider, spring_url):
    return [
        Tool(
            name="run_shopping_flow",
            func=lambda _: run_shopping_flow(
                user_id, api_key, model_name, model_provider, spring_url),
            description="Run the end‑to‑end shopping pipeline: recommend, search, purchase, memory.",
            args_schema=NoInput
        )
    ]
