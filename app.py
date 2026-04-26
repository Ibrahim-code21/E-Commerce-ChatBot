from flask import Flask, request, jsonify, render_template
from chatbot import handle_query

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    response = handle_query(user_message)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)