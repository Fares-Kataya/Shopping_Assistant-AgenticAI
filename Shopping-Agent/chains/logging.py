import json
from datetime import datetime
from pathlib import Path

INTERACTION_LOG = "logs/interaction_log.jsonl"


def log_interaction(user_id: str, prompt: str, response: str) -> None:
    """
    Append a JSONL entry containing the user_id, full prompt text,
    raw LLM response, and an ISO timestamp.
    """
    Path("logs").mkdir(exist_ok=True)
    entry = {
        "user_id": user_id,
        "prompt": prompt,
        "response": response,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    with open(INTERACTION_LOG, "a") as f:
        f.write(json.dumps(entry) + "\n")


def load_recent_interactions(user_id: str, limit: int=3) -> list[dict]:
    interactions = []
    if not Path(INTERACTION_LOG).exists():
        return interactions
    with open(INTERACTION_LOG) as f:
        for line in f:
            try:
                entry = json.loads(line)
            except json.JSONDecodeError:
                continue
        if entry.get("user_id") == user_id:
            interactions.append(entry)
    return interactions[-limit:]