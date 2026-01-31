import requests
import uuid

API_URL = "http://localhost:3004"

def verify_edit():
    # 1. Login (or Signup if needed)
    email = f"user_{uuid.uuid4()}@example.com"
    password = "password123"
    
    print(f"1. Signing up {email}...")
    requests.post(f"{API_URL}/auth/signup", json={"email": email, "password": password, "name": "Test User"})
    
    print("2. Logging in...")
    res = requests.post(f"{API_URL}/auth/login", json={"email": email, "password": password})
    if res.status_code != 200 and res.status_code != 201:
        print(f"Login failed: {res.status_code}")
        return
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create Project
    print("3. Creating project...")
    res = requests.post(f"{API_URL}/projects", json={"name": "Original Name", "description": "Original Desc"}, headers=headers)
    if res.status_code != 201:
        print(f"Create failed: {res.status_code}")
        return
    project_id = res.json()["id"]
    print(f"Project created: {project_id}")

    # 3. Update Project
    print("4. Updating project...")
    new_name = "Updated Name"
    new_desc = "Updated Description"
    res = requests.patch(f"{API_URL}/projects/{project_id}", json={"name": new_name, "description": new_desc}, headers=headers)
    if res.status_code != 200:
        print(f"Update failed: {res.status_code} {res.text}")
        return
    
    updated_project = res.json()
    if updated_project["name"] == new_name and updated_project["description"] == new_desc:
        print("SUCCESS: Project updated successfully!")
    else:
        print(f"FAILURE: Project fields did not match. Got: {updated_project}")

if __name__ == "__main__":
    verify_edit()
