# HoneyChain — API Audit & Gaps Analysis

> **Audit Date**: 2026-09-04  
> **Backend Base URL**: `/api`  
> **OpenAPI Version**: v1.0.0 (`/v3/api-docs`)

---

## 1. Executive Summary

This document captures the **actual existing state** of the HoneyChain REST API. All 30 controllers and 55+ distinct endpoint paths were audited against their respective services, entities, DTOs, security configurations, and OpenAPI specifications.

---

## 2. Implemented & Functional Endpoint Groups

The following endpoint groups are fully implemented, backed by JPA repositories and services, and tested:

### 2.1 Authentication (`/api/auth`)
- `POST /api/auth/send-otp`: Sends mock OTP for phone number registration / login.
- `POST /api/auth/verify-otp`: Verifies OTP and returns JWT token + role.
- `POST /api/auth/login`: Direct phone + password authentication.

### 2.2 Beekeeper Profile (`/api/beekeepers/profile`)
- `POST /api/beekeepers/profile`: Create beekeeper profile (KVIC ID, GPS, village, name, language).
- `GET /api/beekeepers/profile`: Retrieve profile of authenticated beekeeper.
- `PUT /api/beekeepers/profile`: Update beekeeper profile details.
- `GET /api/beekeepers/profile/status`: Get profile completion & verification status.
- `POST /api/beekeepers/profile/photo` (multipart): Upload beekeeper avatar photo.

### 2.3 Hive Management (`/api/beekeepers/hives`)
- `POST /api/beekeepers/hives`: Register a new hive with GPS and cluster name.
- `GET /api/beekeepers/hives`: Get list of owned hives with health status.
- `GET /api/beekeepers/hives/{id}`: Get detailed hive metadata.
- `PUT /api/beekeepers/hives/{id}`: Update hive code, cluster, coordinates.
- `PATCH /api/beekeepers/hives/{id}/status`: Change status (`ACTIVE`, `INACTIVE`, `MAINTENANCE`, `QUARANTINED`).
- `GET /api/beekeepers/hives/count`: Aggregate count of total and active hives.

### 2.4 Honey Batch Management (`/api/beekeepers/batches`)
- `POST /api/beekeepers/batches` (multipart & JSON): Create harvest batch with optional photo and `X-Idempotency-Key` deduplication.
- `GET /api/beekeepers/batches`: Paginated list of beekeeper's batches.
- `GET /api/beekeepers/batches/{batchId}`: Batch details by unique batch ID (`HC-YYYY-XXXXXXXX`).
- `PUT /api/beekeepers/batches/{batchId}` (multipart & JSON): Update batch quantity/date (only when status is `CREATED`).
- `POST /api/beekeepers/batches/{batchId}/send-testing`: Transition status `CREATED` → `SENT_FOR_TESTING`.
- `GET /api/beekeepers/batches/stats`: Summary counts of batches by status (`created`, `sentForTesting`, `total`).

### 2.5 Blockchain Records & Verification (`/api/beekeepers/batches/{batchId}/blockchain`)
- `GET /api/beekeepers/batches/{batchId}/blockchain`: Retrieve SHA-256 ledger block and transaction hash.
- `POST /api/beekeepers/batches/{batchId}/blockchain/verify`: Recalculates canonical SHA-256 hash from database state and detects any tampering.

### 2.6 Laboratory Testing (`/api/lab`)
- `GET /api/lab/profile`: Technician profile.
- `GET /api/lab/tests/pending`: Batches in `SENT_FOR_TESTING` state awaiting analysis.
- `GET /api/lab/tests/{batchId}`: Details of lab test for batch.
- `POST /api/lab/tests/{batchId}` (multipart & JSON): Submit purity score, result (`PURE`, `UNDER_REVIEW`, `FAILED`), remarks, certificate. Updates batch status and records `LAB_RESULT` on blockchain ledger.
- `GET /api/lab/stats`: Aggregate counts of tests (`pending`, `pure`, `underReview`, `failed`, `completed`).
- `GET /api/beekeepers/batches/{batchId}/lab-result`: Beekeeper access to lab result for owned batch.

### 2.7 QR Generation & Public Verification (`/api/beekeepers/batches/{batchId}`, `/api/public/verify`)
- `POST /api/beekeepers/batches/{batchId}/generate-qr`: Generates 500x500 PNG QR code for `PURE` batches pointing to public verification URL. Idempotent.
- `GET /api/beekeepers/batches/{batchId}/qr`: Retrieve generated QR code URL and value.
- `GET /api/public/verify/{batchId}`: Public verification endpoint (No auth required).
- `POST /api/public/verify/{batchId}/scan`: Record scan event and update anti-counterfeit heuristics (No auth required).
- `GET /api/public/verify/{batchId}/history`: Public verification timeline and scan count (No auth required).
- `GET /api/beekeepers/batches/{batchId}/verification-history`: Beekeeper analytics on scan locations/counts.

### 2.8 IoT Hive Health Monitoring (`/api/beekeepers/hives`)
- `GET /api/beekeepers/hives/health`: Health status across all owned hives.
- `GET /api/beekeepers/hives/{hiveId}/health`: Health analysis (temperature, humidity, activity) with heuristic classifications (`HEALTHY`, `WATCH`, `ALERT`).
- `GET /api/beekeepers/hives/{hiveId}/sensors/latest`: Latest telemetry reading.
- `GET /api/beekeepers/hives/{hiveId}/sensors/history`: Historical sensor time-series.

### 2.9 AI Yield Prediction (`/api/beekeepers/hives`)
- `GET /api/beekeepers/hives/{hiveId}/yield-prediction`: Harvest yield estimate (min/max kg, confidence, predicted harvest date).
- `GET /api/beekeepers/hives/yield-predictions`: Yield estimates across all hives.
- `POST /api/beekeepers/hives/{hiveId}/yield-prediction/refresh`: Force re-evaluation of yield heuristics.

### 2.10 Marketplace & Catalog (`/api/products`, `/api/beekeepers/products`)
- `GET /api/products`: Public product listing with search, category, floral source, and price filters.
- `GET /api/products/{id}`: Product details with beekeeper story and batch provenance.
- `POST /api/beekeepers/products`: List a batch as a marketplace product (Beekeeper role).
- `GET /api/beekeepers/products`: List beekeeper's listed products.
- `PUT /api/beekeepers/products/{id}`: Update listing details/pricing.
- `PATCH /api/beekeepers/products/{id}/status`: Toggle listing active/inactive.

### 2.11 Cart & Checkout (`/api/cart`, `/api/orders`)
- `GET /api/cart`: Get current customer's shopping cart.
- `POST /api/cart/items`: Add item to cart.
- `PUT /api/cart/items/{id}`: Update cart item quantity.
- `DELETE /api/cart/items/{id}`: Remove item from cart.
- `DELETE /api/cart`: Clear cart.
- `POST /api/orders/checkout`: Place order with mock payment processing.
- `GET /api/orders`: List customer's orders.
- `GET /api/orders/{orderNumber}`: Order details with tracking timeline.
- `PUT /api/orders/{orderNumber}/cancel`: Cancel pending order.
- `GET /api/beekeepers/orders`: Beekeeper view of incoming orders.
- `PUT /api/beekeepers/orders/{orderNumber}/status`: Update order fulfillment (`PACKED`, `SHIPPED`, `DELIVERED`).

### 2.12 Ratings & Reviews (`/api/reviews`, `/api/products/{productId}/reviews`)
- `POST /api/reviews`: Submit verified customer review for delivered order item.
- `GET /api/products/{productId}/reviews`: Public paginated reviews for a product.
- `GET /api/reviews/my`: Customer's review history.
- `GET /api/reviews/order-item/{orderItemId}`: Review status for specific order item.
- `PUT /api/reviews/{id}`: Update review text/rating.
- `DELETE /api/reviews/{id}`: Delete customer review.

### 2.13 Notifications (`/api/notifications`)
- `GET /api/notifications`: Paginated user notifications.
- `GET /api/notifications/unread-count`: Badge counter for navbar.
- `PUT /api/notifications/{id}/read`: Mark notification read.
- `PUT /api/notifications/read-all`: Mark all read.

### 2.14 Admin & KVIC Oversight (`/api/admin`)
- `GET /api/admin/dashboard`: Overview KPIs and platform statistics.
- `GET /api/admin/profile`: Admin account info.
- `GET /api/admin/stats`: Quick database table entity counts.
- `GET /api/admin/beekeepers`: List beekeepers with verification status.
- `GET /api/admin/beekeepers/{id}`: Beekeeper inspection details.
- `PATCH /api/admin/beekeepers/{id}/status`: Approve / reject beekeeper KYC.
- `GET /api/admin/hives`: All hives across all beekeepers.
- `GET /api/admin/batches`: All batches platform-wide.
- `GET /api/admin/batches/{batchId}`: Batch inspection.
- `GET /api/admin/lab-tests`: All lab test records.
- `GET /api/admin/disputes`: Consumer dispute reports.
- `PATCH /api/admin/disputes/{id}/status`: Resolve / investigate dispute.
- `GET /api/admin/analytics/purity`: Purity distribution analytics.
- `GET /api/admin/analytics/regions`: Regional production volume breakdown.
- `GET /api/admin/analytics/production`: Monthly production trends.
- `GET /api/admin/analytics/sales`: Marketplace sales volume.
- `GET /api/admin/analytics/verification-risk`: Risk alerts & anomalous scan clusters.

### 2.15 User Management (`/api/users`)
- `GET /api/users/me`: Current authenticated user profile (Authenticated).
- `GET /api/users`: All registered user accounts (ADMIN / KVIC_OFFICER only).
- `GET /api/users/{id}`: Inspect specific user account (ADMIN / KVIC_OFFICER only).

---

## 3. Mock & Simulated Implementations (Documented Limitations)

As required by the Honesty Rule, the following subsystems use simulated / abstraction implementations:

| Subsystem | Implementation Type | Active Flag | Production Replacement Path |
|-----------|---------------------|-------------|----------------------------|
| **Blockchain** | In-memory SHA-256 hashing persisted in MySQL (`HONEYCHAIN-MOCKNET`) | `BLOCKCHAIN_MODE=mock` | Implement `HyperledgerFabricService` or `PolygonWeb3Service` |
| **IoT Telemetry** | Scheduled background simulation (`RandomHiveSensorSimulator`) | `IOT_MOCK_ENABLED=true` | Ingest via MQTT/HTTP broker connected to ESP32/LoRa nodes |
| **AI Yield Predictor** | Rule-based heuristics (weight adjustment by temperature/humidity/activity) | `AI_PREDICTION_MAX_AGE=24` | Connect Python FastAPI service hosting XGBoost/RandomForest model |
| **Payment Gateway** | Instant mock approval on checkout | `PAYMENT_MODE=mock` | Integrate Razorpay / Stripe SDK |
| **SMS Delivery** | Console / event-bus logger masking phone numbers | `NOTIFICATION_SMS_ENABLED=false` | Connect Twilio / Gupshup / Fast2SMS API client |

---

## 4. Contract Issues & Remediation Summary

During this audit, the following contract and security items were addressed:

1. **User Endpoint Security (`/api/users`, `/api/users/{id}`)**:
   - *Finding*: `/api/users` and `/api/users/{id}` were accessible to any authenticated user under `.anyRequest().authenticated()`.
   - *Fix*: Added `@PreAuthorize("hasAnyRole('ADMIN', 'KVIC_OFFICER')")` and explicit `SecurityConfig` matcher rules.
   - *Verified*: Integration test `SystemSecurityOwnershipIntegrationTest` confirms 403 Forbidden for non-admin roles.

2. **Blockchain Lab Result Type**:
   - *Verified*: `recordLabResult` creates records with `BlockchainRecordType.LAB_RESULT` (not `BATCH_CREATED`).

3. **Tamper Detection**:
   - *Verified*: `verifyBatch` recalculates data hash from current entity state; returns `tampered=true` if database records are manipulated after hashing.

4. **Public Verification Privacy**:
   - *Verified*: No phone numbers, passwords, or exact GPS coordinates are exposed on unauthenticated `/api/public/verify/*` routes.
