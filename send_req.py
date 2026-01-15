from datetime import datetime
import random
import requests

def publish_event(user_id: int):
    url = "http://localhost:3000/api/publish"
    headers = {
        "Content-Type": "application/json"
    }
    fullname = f"{random.choice(['Alice', 'Bob', 'Charlie', 'Diana'])} {random.choice(['Smith', 'Johnson', 'Williams', 'Brown'])}"
    payload = {
        "event": f"user.{random.choice(['created', 'updated', 'deleted'])}",
        "value": {
            "userId": user_id,
            "name": fullname,
            "email": f"user{user_id}@example.com"
        },
        "timestamp": f"{datetime.now().isoformat()}Z"
    }

    requests.post(url, headers=headers, json=payload)

if __name__ == "__main__":
    print(f"Start from [0-99]")
    for id in range(100):
        publish_event(id)

    # sleep(30)

    # print(f"Continue from 10-29")
    # for id in range(10, 30):
    #     publish_event(id)

    # sleep(30)

    # print(f"Continue from 30-59")
    # for id in range(30, 60):
    #     publish_event(id)