from pathlib import Path
from datetime import datetime
import json

INTERACTION_LOG = "logs/interaction_log.jsonl"


def log_interaction(user_id: str, prompt: str, response: str) -> None:
    Path("logs").mkdir(exist_ok=True)
    entry = {
        "user_id": user_id,
        "prompt": prompt,
        "response": response,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    with open(INTERACTION_LOG, "a") as f:
        f.write(json.dumps(entry) + "\n")


def load_recent_interactions(user_id: str, limit: int = 3) -> list[dict]:
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