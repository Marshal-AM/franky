import requests

# Server URL
SERVER_URL = "https://c3b4-210-1-49-174.ngrok-free.app/markov"

# Nillion API configurations
NILLION_BASE_URL = "https://nillion-storage-apis-v0.onrender.com"
APP_ID = "555b0e44-dd3f-4c0c-bec1-2c4fb92076ff"
USER_SEED = "user_123"

def decrypt_response_with_nillion(store_id: str, secret_name: str) -> str:
    """
    Retrieve and decrypt the secret using Nillion's API.
    """
    url = f"{NILLION_BASE_URL}/api/secret/retrieve/{store_id}"
    params = {
        "retrieve_as_nillion_user_seed": USER_SEED,
        "secret_name": secret_name,
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise Exception(f"Error retrieving secret: {response.text}")
    return response.json()

def get_encrypted_response(input_text: str):
    """
    Send the input text to the server and receive the encrypted response.
    """
    response = requests.post(
        f"{SERVER_URL}/markov", json={"input": input_text}
    )
    if response.status_code != 200:
        raise Exception(f"Error from server: {response.json()}")

    encrypted_response = response.json()["encrypted_response"]
    return encrypted_response

# Test the flow
input_text = "The"
encrypted_data = get_encrypted_response(input_text)

# Retrieve and decrypt the response
store_id = encrypted_data["store_id"]
secret_name = "markov_response"
decrypted_response = decrypt_response_with_nillion(store_id, secret_name)

print("Decrypted Response:", decrypted_response)
