import requests

# Change this if hosted somewhere else
API_URL = "http://localhost:8000/suggest-career"

# Sample data (matches your UserInput model)
payload = {
    "name": "Alice",
    "age": 24,
    "gender": "Female",
    "education": "Bachelor's in Computer Science",
    "skills": ["Python", "Machine Learning", "Problem Solving"],
    "preferences": ["Remote work", "Flexible hours", "AI Industry"]
}

response = requests.post(API_URL, json=payload)

print("Status Code:", response.status_code)
print("Response JSON:")
print(response.json())
