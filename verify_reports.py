import requests
import requests
import sys
import time
import sys

# Simple script to check if backend analytics endpoints are reachable
# and returning valid JSON structure.
# Since we can't run browser tests easily in this headless env without setup,
# we rely on HTTP checks and simple console output.

ANALYTICS_URL = "http://localhost:8000"

def verify_reports():
    print("1. Checking Analytics API Health...")
    try:
        res = requests.get(f"{ANALYTICS_URL}/")
        if res.status_code == 200:
            print("Analytics Service is UP.")
        else:
            print(f"Analytics Service DOWN: {res.status_code}")
            sys.exit(1)
    except Exception as e:
        print(f"Analytics Service Unreachable: {e}")
        sys.exit(1)

    print("2. Fetching Task Stats...")
    try:
        res = requests.get(f"{ANALYTICS_URL}/stats/tasks")
        if res.status_code == 200:
            print(f"Task Stats: {res.json()}")
        else:
            print(f"Task Stats Failed: {res.status_code} {res.text}")
    except Exception as e:
        print(f"Task Stats Error: {e}")

    print("3. Fetching Productivity Stats...")
    try:
        res = requests.get(f"{ANALYTICS_URL}/stats/productivity")
        if res.status_code == 200:
            data = res.json()
            print(f"Productivity Stats (Count): {len(data)}")
            if len(data) > 0:
                print(f"Sample: {data[0]}")
        else:
            print(f"Productivity Stats Failed: {res.status_code} {res.text}")
    except Exception as e:
        print(f"Productivity Stats Error: {e}")

if __name__ == "__main__":
    verify_reports()
