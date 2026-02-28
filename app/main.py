from claude_client import chat

def main():
    print("Social Context Translator")
    print("type 'quit' to close")

    conversation_history = []

    while True:
        user_input = input("You: ").strip()
        if user_input.lower() == "quit":
            break
        if not user_input:
            continue

        response = chat(user_input, conversation_history)
        print(f"\nAssistant: {response}\n")

if __name__ == "__main__":
    main()