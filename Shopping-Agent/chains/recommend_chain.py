import json
import re
from langchain.prompts import PromptTemplate
from llm.llm_provider import get_chat_llm


def get_available_categories():
    try:
        from chains.search_chain import load_catalog
        catalog = load_catalog()
        categories = list(set(item.get("category")
                          for item in catalog if item.get("category")))
        return categories
    except Exception as e:
        print(f"Warning: Could not load catalog categories: {e}")
        return ["electronics", "sportswear", "home"]

template = PromptTemplate.from_template(
    """
You are a shopping assistant analyzing purchase history to recommend new product categories.
    Given this purchase history:
    {history}
    Available product categories in our catalog:
    {available_categories}
    IMPORTANT: You MUST choose ONE category from the available categories list above.
    Do NOT create new categories or suggest categories not in the list.
    Analyze the user's purchase history and recommend ONE category from the available list that they might be interested in but haven't purchased from recently.
    Consider their spending patterns and product preferences.
    Respond ONLY with valid JSON in this exact format:
    {{"category": "category_name", "reason": "brief explanation of why this category fits their preferences"}}
    The category MUST be exactly one of: {available_categories}
    """
)


def recommend_category(history: list, api_key: str = None, model_name: str = None, model_provider: str = None) -> dict:
    available_categories = get_available_categories()
    llm = get_chat_llm(api_key=api_key, model_name=model_name,
                       temperature=0.7, model_provider=model_provider)
    chain = template | llm
    raw_response = chain.invoke({
        "history": history,
        "available_categories": available_categories
    })
    if hasattr(raw_response, 'content'):
        content = raw_response.content
    elif hasattr(raw_response, 'text'):
        content = raw_response.text
    else:
        content = str(raw_response)

    print(f"🤖 Raw LLM Response: {content}")

    try:
        return json.loads(content)
    except json.JSONDecodeError as e:
        print(f"⚠️ JSON parsing failed: {e}")
        print(f"Raw content: {content}")

        content_clean = content.strip()


        json_match = re.search(r'\{.*\}', content_clean, re.DOTALL)
        if json_match:
            try:
                json_str = json_match.group(0)
                print(f"🔍 Extracted JSON: {json_str}")
                return json.loads(json_str)
            except json.JSONDecodeError:
                pass

        lines = content_clean.split('\n')
        category = "home"  # default fallback
        reason = "Based on your purchase history"

        for line in lines:
            if 'category' in line.lower():
                if ':' in line:
                    category = line.split(':', 1)[1].strip().strip('"\'')
            elif 'reason' in line.lower():
                if ':' in line:
                    reason = line.split(':', 1)[1].strip().strip('"\'')
        if category not in available_categories:
            category = available_categories[0] if available_categories else "electronics"
            reason = f"Defaulting to {category} category as it's available in our catalog"
        return {"category": category, "reason": reason}
