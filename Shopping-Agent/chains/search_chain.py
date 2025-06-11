import json
from typing import List, Dict

CATALOG_PATH = "catalog/product_catalog.json"

def load_catalog() -> List[Dict]:
    with open(CATALOG_PATH) as f:
        return json.load(f)

def recommend_top_3_products(category: str, target_price: float) -> List[Dict]:
    catalog = load_catalog()
    filtered = [item for item in catalog if item.get("category") == category]
    ranked = sorted(filtered, key=lambda x: abs(
        x.get("price", 0) - target_price))
    return ranked[:3]
