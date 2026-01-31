import requests

API_URL = "http://localhost:3004"

def test_flow():
    email = "test@example.com"
    password = "password123"

    print(f"1. Signing up {email}...")
    try:
        res = requests.post(f"{API_URL}/auth/signup", json={"email": email, "password": password, "name": "Test User"})
        print(f"Signup status: {res.status_code}")
        if res.status_code == 201:
             print("Signup successful")
        elif res.status_code == 409:
             print("User already exists, proceeding to login")
        else:
             print(f"Signup failed: {res.text}")
             return
    except Exception as e:
        print(f"Signup failed with exception: {e}")
        return

    print("2. Logging in...")
    res = requests.post(f"{API_URL}/auth/login", json={"email": email, "password": password})
    if res.status_code != 200 and res.status_code != 201:
        print(f"Login failed: {res.status_code} {res.text}")
        return
    
    token = res.json()["access_token"]
    print("Login successful, token obtained")
    headers = {"Authorization": f"Bearer {token}"}

    print("3. Creating project...")
    res = requests.post(f"{API_URL}/projects", json={"name": "Test Project", "description": "A test project"}, headers=headers)
    if res.status_code != 201:
        print(f"Create project failed: {res.status_code} {res.text}")
        return
    
    project = res.json()
    project_id = project["id"]
    print(f"Project created: {project_id}")

    print(f"4. Fetching project {project_id}...")
    res = requests.get(f"{API_URL}/projects/{project_id}", headers=headers)
    if res.status_code == 200:
        print(f"Project fetched successfully: {res.json()}")
    else:
        print(f"Fetch project failed: {res.status_code} {res.text}")

if __name__ == "__main__":
    test_flow()
