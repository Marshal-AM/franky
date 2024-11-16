from fastapi import FastAPI, WebSocket
import random
import uvicorn

app = FastAPI()

# Define the knowledge base
knowledge_base = {
    "What is the capital of France?": "The capital of France is Paris.",
    "Who invented the telephone?": "Alexander Graham Bell invented the telephone.",
    "What is the largest planet in our solar system?": "Jupiter is the largest planet in our solar system.",
    "When was the Declaration of Independence signed?": "The Declaration of Independence was signed in 1776.",
    "What is the tallest mountain in the world?": "Mount Everest is the tallest mountain in the world."
}

# Define the Markov chain transitions
transitions = {
    "greeting": ["greeting", "answer", "clarify"],
    "answer": ["answer", "clarify", "greeting"],
    "clarify": ["clarify", "answer", "greeting"]
}

@app.websocket("/qa")
async def question_answering(websocket: WebSocket):
    await websocket.accept()
   
    # Initialize the Markov chain at the "greeting" state
    current_state = "greeting"
   
    while True:
        # Get the question from the client
        question = await websocket.receive_text()
       
        # Generate a response based on the Markov chain and knowledge base
        next_state = random.choice(transitions[current_state])
       
        if next_state == "greeting":
            response = "Hello! How can I assist you today?"
        elif next_state == "answer":
            # Look up the answer in the knowledge base
            response = knowledge_base.get(question, "I'm sorry, I don't have information about that.")
        elif next_state == "clarify":
            response = "Could you please rephrase your question?"
       
        # Send the response back to the client
        await websocket.send_text(response)
       
        # Update the current state
        current_state = next_state

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)