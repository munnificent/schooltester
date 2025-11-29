import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_lesson_completion():
    # 1. Login as student
    print("Logging in as student...")
    response = requests.post(f"{BASE_URL}/token/", json={"username": "student1@school.kz", "password": "student123"})
    if response.status_code != 200:
        print(f"Login failed: {response.text}")
        return
    
    tokens = response.json()
    access_token = tokens['access']
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # 2. Get enrolled courses
    print("Fetching enrolled courses...")
    response = requests.get(f"{BASE_URL}/courses/my/", headers=headers)
    courses = response.json()
    if not courses:
        print("No enrolled courses found.")
        return
    
    course_id = courses[0]['id']
    print(f"Using course ID: {course_id}")
    
    # 3. Get course details (lessons)
    print("Fetching course details...")
    response = requests.get(f"{BASE_URL}/courses/{course_id}/", headers=headers)
    course_data = response.json()
    lessons = course_data.get('lessons', [])
    
    if not lessons:
        print("No lessons found in this course.")
        return
        
    lesson_id = lessons[0]['id']
    print(f"Using lesson ID: {lesson_id}")
    
    # 4. Toggle completion (Mark as complete)
    print("Marking lesson as complete...")
    response = requests.post(f"{BASE_URL}/courses/{course_id}/lessons/{lesson_id}/toggle_completion/", headers=headers)
    print(f"Toggle response: {response.json()}")
    assert response.json()['status'] == 'completed'
    
    # 5. Verify completion status in course details
    print("Verifying completion status...")
    response = requests.get(f"{BASE_URL}/courses/{course_id}/", headers=headers)
    updated_lessons = response.json()['lessons']
    target_lesson = next(l for l in updated_lessons if l['id'] == lesson_id)
    assert target_lesson['is_completed'] == True
    print("Lesson is correctly marked as completed!")
    
    # 6. Toggle completion (Mark as incomplete)
    print("Marking lesson as incomplete...")
    response = requests.post(f"{BASE_URL}/courses/{course_id}/lessons/{lesson_id}/toggle_completion/", headers=headers)
    print(f"Toggle response: {response.json()}")
    assert response.json()['status'] == 'uncompleted'
    
    print("Test passed successfully!")

if __name__ == "__main__":
    try:
        test_lesson_completion()
    except Exception as e:
        print(f"Test failed: {e}")
