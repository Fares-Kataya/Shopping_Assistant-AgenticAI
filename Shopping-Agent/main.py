import os
import requests
from chains.recommend_chain import recommend_category
from chains.search_chain import recommend_top_3_products
from chains.purchase_chain import log_purchase
from memory.memory_manager import update_buyer_history
from dotenv import load_dotenv

load_dotenv()

# the only value to change to switch llm -> Options: "OPENAI", "ANTHROPIC", "GOOGLE"
model = "GOOGLE"

API_KEY = os.getenv(f"{model}_API_KEY")
MODEL = os.getenv(f"{model}_MODEL")
PROVIDER = os.getenv(f"{model}_PROVIDER")
API_URL = "http://localhost:8080/api/buyers"

print(f"Using {PROVIDER} with model {MODEL}")

if __name__ == "__main__":

    user_ID = "A123"
    try:
    #Fetching Buyer History
        resp = requests.get(f"{API_URL}/{user_ID}/history")
        resp.raise_for_status()
        data = resp.json()
        history = data["history"]
    #piplining the history to feed the LLM

    #recommendation chain
        reco = recommend_category(history, api_key=API_KEY,model_name=MODEL, model_provider=PROVIDER)
        category = reco.get("category")
        reason = reco.get("reason")
        print(f"Recommendation: {category}\nJustification: {reason}")

    #Product Search
        avg_price = sum(item["price"] for item in history) / len(history)
        top3 = recommend_top_3_products(category, avg_price)
        print("Top 3 Products for you:")
        for i, product in enumerate(top3, 1):
            print(f"  {i}. {product}")

    #Purchase Simulation logging
        selected = top3[0] if top3 else None
        if selected:
            result = log_purchase(user_ID, selected)
            print(f"✅ {result}")

            # Memory Update
            print("💾 Updating memory...")
            update_buyer_history(user_ID, selected)
            print("✅ Flow complete!")
        else:
            print("No products found in the recommended category")
    except requests.RequestException as e:
        print(f"API Error: {e}")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()