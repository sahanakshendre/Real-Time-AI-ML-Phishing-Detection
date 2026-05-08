import random
from datetime import datetime
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline

class PhishingModel:
    def __init__(self):
        self.training_samples = [
            "http://secure-login.example.com/account/verify",
            "https://banking.example.com.secure-login.com/confirm",
            "http://update.payment-info.verify-account.com",
            "http://example.com/login",
            "https://example.com/dashboard",
            "https://secure.example.org/profile",
            "http://paypal.com.login.verify-account.info",
            "https://google.com/accounts/signin",
            "http://accounts.example.net/security-check",
            "https://safe-site.org/home", 
            "http://freegift.example.com",
            "https://invoice.example.com/pay",
            "https://facebook.com/profile",
            "http://microsoft.com-support.com/update",
            "https://shop.example.org/cart"
        ]
        self.labels = [1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0]
        self.pipeline = make_pipeline(CountVectorizer(ngram_range=(1, 2)), LogisticRegression(max_iter=500))
        self._train_model()

    def _train_model(self):
        self.pipeline.fit(self.training_samples, self.labels)
        self._compute_metrics()

    def _compute_metrics(self):
        X_train, X_test, y_train, y_test = train_test_split(
            self.training_samples,
            self.labels,
            test_size=0.2,
            random_state=42,
            stratify=self.labels
        )

        y_pred = self.pipeline.predict(X_test)
        y_prob = self.pipeline.predict_proba(X_test)[:, 1]

        self.model_metrics = {
            "accuracy": accuracy_score(y_test, y_pred),
            "precision": precision_score(y_test, y_pred, zero_division=0),
            "recall": recall_score(y_test, y_pred, zero_division=0),
            "f1_score": f1_score(y_test, y_pred, zero_division=0),
            "auc_roc": roc_auc_score(y_test, y_prob),
            "total_predictions": len(y_test),
            "true_positives": int(((y_test == 1) & (y_pred == 1)).sum()),
            "false_positives": int(((y_test == 0) & (y_pred == 1)).sum()),
            "true_negatives": int(((y_test == 0) & (y_pred == 0)).sum()),
            "false_negatives": int(((y_test == 1) & (y_pred == 0)).sum())
        }

        self.dataset_stats = {
            "total_samples": len(self.training_samples),
            "phishing_samples": int(sum(self.labels)),
            "legitimate_samples": int(len(self.labels) - sum(self.labels)),
            "phishing_percentage": float(sum(self.labels) / len(self.labels) * 100),
            "legitimate_percentage": float((len(self.labels) - sum(self.labels)) / len(self.labels) * 100),
            "features_count": len(self.pipeline.named_steps['countvectorizer'].get_feature_names_out()),
            "training_samples": len(y_train),
            "test_samples": len(y_test),
            "class_balance_ratio": f"{sum(self.labels)}:{len(self.labels)-sum(self.labels)}"
        }

    def predict_url(self, url: str):
        probability = self.pipeline.predict_proba([url])[0][1]
        label = self.pipeline.predict([url])[0]
        return {
            "url": url,
            "prediction": "phishing" if label == 1 else "safe",
            "confidence": round(float(probability) * 100, 2)
        }

    def explain(self, url: str):
        lower = url.lower()
        reasons = []
        if "login" in lower and "secure" in lower:
            reasons.append("Suspicious login/secure token pattern")
        if lower.count(".") > 3:
            reasons.append("Unusual subdomain count")
        if "verify" in lower or "update" in lower:
            reasons.append("Urgency or verification wording")
        if not reasons:
            reasons.append("No obvious phishing token found; model prediction based on learned features")
        return reasons

    def sample_attack_data(self):
        locations = [
            {"city": "New York", "lat": 40.7128, "lng": -74.0060},
            {"city": "London", "lat": 51.5074, "lng": -0.1278},
            {"city": "Mumbai", "lat": 19.0760, "lng": 72.8777},
            {"city": "Tokyo", "lat": 35.6762, "lng": 139.6503},
            {"city": "Sydney", "lat": -33.8688, "lng": 151.2093},
            {"city": "São Paulo", "lat": -23.5505, "lng": -46.6333},
            {"city": "Cape Town", "lat": -33.9249, "lng": 18.4241}
        ]
        return [
            {
                "city": location["city"],
                "lat": location["lat"],
                "lng": location["lng"],
                "threat_level": random.randint(45, 95),
                "active_attacks": random.randint(2, 12)
            }
            for location in locations
        ]

    def sample_url_history(self):
        return [
            {"id": 1, "url": "http://secure-login.example.com/account/verify", "status": "Phishing", "detected_at": "2026-05-06 11:22"},
            {"id": 2, "url": "https://example.com/dashboard", "status": "Safe", "detected_at": "2026-05-06 10:55"},
            {"id": 3, "url": "http://paypal.com.login.verify-account.info", "status": "Phishing", "detected_at": "2026-05-06 09:40"},
            {"id": 4, "url": "https://google.com/accounts/signin", "status": "Safe", "detected_at": "2026-05-06 08:15"},
            {"id": 5, "url": "http://microsoft.com-support.com/update", "status": "Phishing", "detected_at": "2026-05-05 21:34"}
        ]

    def sample_alerts(self):
        return [
            {"id": 1, "source": "Inbound Mail", "subject": "URGENT: Account verification needed", "severity": "High", "timestamp": "2026-05-06 11:30"},
            {"id": 2, "source": "Gateway", "subject": "Suspicious sign-in attempt detected", "severity": "Medium", "timestamp": "2026-05-06 10:10"},
            {"id": 3, "source": "Phishing Engine", "subject": "Credential harvesting page blocked", "severity": "High", "timestamp": "2026-05-06 09:05"}
        ]

    def sample_gmail_alerts(self):
        return [
            {"id": 1, "sender": "alert@google.com", "subject": "Verify your Google account", "status": "Quarantined", "timestamp": "2026-05-06 12:02"},
            {"id": 2, "sender": "support@gma-il.com", "subject": "Your mailbox will be deactivated", "status": "Blocked", "timestamp": "2026-05-06 10:42"}
        ]

    def send_phishing_alert_email(self, url: str, confidence: float, recipient_email: str = "user@example.com"):
        """Simulate sending email alert when phishing is detected."""
        alert = {
            "email_sent_to": recipient_email,
            "subject": f"Security Alert: Phishing URL Detected ({confidence}% confidence)",
            "body": f"A phishing URL has been detected and blocked: {url}",
            "timestamp": "2026-05-06 " + str(__import__('datetime').datetime.now().strftime('%H:%M:%S'))
        }
        print(f"[EMAIL ALERT] {alert['subject']} -> {recipient_email}")
        return alert

    def prevention_methods(self):
        return [
            {"title": "Multi-Factor Authentication", "description": "Require MFA for all accounts to reduce credential theft risk."},
            {"title": "Browser URL Inspection", "description": "Verify domain authenticity before entering sensitive credentials."},
            {"title": "Real-Time URL Analysis", "description": "Use AI-driven scoring to flag suspicious links instantly."},
            {"title": "Email Content Filtering", "description": "Scan inbound email content and attachments for phishing indicators."}
        ]

    def dashboard_summary(self):
        return {
            "detected_threats": random.randint(80, 160),
            "resolved_incidents": random.randint(30, 72),
            "blocked_emails": random.randint(120, 280),
            "live_attacks": random.randint(7, 19)
        }

    def get_model_metrics(self):
        return self.model_metrics

    def get_dataset_stats(self):
        return self.dataset_stats
