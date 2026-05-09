from flask import Flask, jsonify, request
from flask_cors import CORS
from model import PhishingModel
from email_service import EmailService

app = Flask(__name__)
CORS(app)
model = PhishingModel()
email_service = EmailService()

ADMIN_CREDENTIALS = {
    "username": "admin",
    "password": "SecurePass123"
}

@app.route("/api/login", methods=["POST"])
def login():
    payload = request.json or {}
    username = payload.get("username")
    password = payload.get("password")

    if username == ADMIN_CREDENTIALS["username"] and password == ADMIN_CREDENTIALS["password"]:
        return jsonify({"success": True, "token": "admin-session-token", "message": "Login successful."})
    return jsonify({"success": False, "message": "Invalid credentials."}), 401

@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    return jsonify({
        "summary": model.dashboard_summary(),
        "attack_map": model.sample_attack_data(),
        "alerts": model.sample_alerts(),
        "top_threats": [
            {"name": "Credential Harvesting", "score": 92},
            {"name": "Brand Impersonation", "score": 87},
            {"name": "Malicious Redirect", "score": 74}
        ]
    })

@app.route("/api/url-history", methods=["GET"])
def url_history():
    return jsonify({"history": model.sample_url_history()})

@app.route("/api/analyze-url", methods=["POST"])
def analyze_url():
    payload = request.json or {}
    url = payload.get("url", "")
    email = payload.get("email", "")
    sender_email = payload.get("sender_email")
    sender_password = payload.get("sender_password")
    
    print(f"\n[DEBUG] Received analyze-url request:")
    print(f"  URL: {url}")
    print(f"  Recipient Email: {email}")
    print(f"  Sender Email: {sender_email}")
    print(f"  correct Password: {'Yes' if sender_password else 'No'}")
    
    if not url:
        return jsonify({"error": "URL is required."}), 400

    result = model.predict_url(url)
    result["reasons"] = model.explain(url)
    
    # Send email alert if phishing is detected
    if result["prediction"] == "phishing":
        print(f"[DEBUG] Phishing detected! Confidence: {result['confidence']}%")
        email_alert = model.send_phishing_alert_email(url, result["confidence"], email)
        result["email_alert"] = email_alert
        # Actually send the email
        print(f"[DEBUG] Attempting to send email alert...")
        email_sent = email_service.send_phishing_alert(email, url, result["confidence"], sender_email, sender_password)
        result["email_sent"] = email_sent
        print(f"[DEBUG] Email send result: {email_sent}")
    
    return jsonify(result)

@app.route("/api/email-alerts", methods=["GET"])
def email_alerts():
    return jsonify({"email_alerts": model.sample_alerts()})

@app.route("/api/prevention", methods=["GET"])
def prevention():
    return jsonify({"methods": model.prevention_methods()})

@app.route("/api/ml-metrics", methods=["GET"])
def ml_metrics():
    return jsonify(model.get_model_metrics())

@app.route("/api/dataset-stats", methods=["GET"])
def dataset_stats():
    return jsonify(model.get_dataset_stats())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
