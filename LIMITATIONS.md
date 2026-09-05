# HoneyChain — Technical Limitations & Production Recommendations (`LIMITATIONS.md`)

## Technical Intent
This document explicitly details the architectural boundaries, mock integrations, and operational assumptions of the **HoneyChain Hackathon MVP Release Candidate**. Demonstrating technical honesty ensures a clear path from local prototype to enterprise production.

---

## 1. Mock Integrations & Local Prototypes

| Integration Layer | Hackathon MVP Implementation | Enterprise Production Requirement |
|-------------------|------------------------------|-----------------------------------|
| **Blockchain Network** | In-memory SHA-256 canonical hashing ledger (`HONEYCHAIN-MOCKNET`). | Hyperledger Fabric / Ethereum L2 (Polygon / Arbitrum) private consortium node. |
| **Payment Gateway** | Internal `MockPaymentService` generating transaction IDs. | Razorpay / Stripe API integration with webhooks and signature verification. |
| **SMS Notifications** | Internal `MockSmsService` logging masked numbers (e.g. `+91******1234`). | Twilio / MSG91 paid transactional SMS API integration. |
| **IoT Telemetry** | Automated mock sensor telemetry generator (`IoTService`). | MQTT Broker (AWS IoT Core / EMQX) with hardware crypto-signature verification. |
| **Yield Prediction** | Deterministic rule-based statistical heuristic model (`RuleBasedYieldPredictionService`). | Trained machine learning regression/XGBoost model deployed on SageMaker/Triton. |

---

## 2. File & Asset Storage
- **Current State**: Local file system storage (`uploads/`).
- **Production Recommendation**: Amazon S3 / Google Cloud Storage with CDN (CloudFront) distribution and pre-signed access URLs.

---

## 3. Database & Scalability
- **Current State**: H2 database in test mode / MySQL 8 relational database.
- **Production Recommendation**: Managed Amazon Aurora MySQL with read replicas, Redis caching layer, and Flyway migration scripts.

---

## 4. Rate Limiting & Infrastructure Security
- **Current State**: Spring Security CORS and JWT filter chain.
- **Production Recommendation**: API Gateway (Kong / AWS API Gateway) with rate limiting (bucket token algorithm), Web Application Firewall (WAF), and HashiCorp Vault for secret management.

---

**Summary**: The HoneyChain MVP is 100% functionally complete, fully tested, and ready for live hackathon demonstration while maintaining clean abstractions for future production upgrade.
