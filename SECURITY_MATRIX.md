# HoneyChain — Role-Based Security Access Matrix

> **Audit Date**: 2026-09-04  
> **Source of Truth**: `SecurityConfig.java`, method-level `@PreAuthorize` annotations, and integration tests.

---

## 1. Role Definitions

| Role Code | Description | Default Landing |
|-----------|-------------|-----------------|
| `PUBLIC` | Unauthenticated consumer / visitor | `/` or `/verify/:batchId` |
| `BEEKEEPER` | Honey producer managing apiaries and harvests | `/beekeeper/dashboard` |
| `CUSTOMER` | Consumer browsing marketplace and placing orders | `/marketplace` |
| `LAB` | Laboratory technician certifying honey purity | `/lab/dashboard` |
| `ADMIN` | System administrator with full governance access | `/admin/dashboard` |
| `KVIC_OFFICER` | Khadi and Village Industries Commission verifier | `/admin/dashboard` |

---

## 2. Comprehensive Endpoint Access Matrix

| Endpoint Route | HTTP Method | PUBLIC | BEEKEEPER | CUSTOMER | LAB | ADMIN | KVIC_OFFICER | Description |
|----------------|-------------|:------:|:---------:|:--------:|:---:|:-----:|:------------:|-------------|
| **System & Health** |
| `/api/health` | `GET` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Service liveness probe |
| `/swagger-ui/**`, `/v3/api-docs/**` | `GET` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | OpenAPI documentation |
| `/uploads/**` | `GET` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Static uploaded images / certificates |
| **Authentication** |
| `/api/auth/send-otp` | `POST` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Request OTP for mobile authentication |
| `/api/auth/verify-otp` | `POST` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Verify OTP and obtain JWT |
| `/api/auth/login` | `POST` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Password-based login |
| **Public Verification** |
| `/api/public/verify/{batchId}` | `GET` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Public provenance & authenticity lookup |
| `/api/public/verify/{batchId}/scan` | `POST` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Log QR scan event & check anti-counterfeit risk |
| `/api/public/verify/{batchId}/history`| `GET` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Public timeline and scan count |
| **Catalog & Reviews (Public)** |
| `/api/products` | `GET` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Search and filter honey products |
| `/api/products/{id}` | `GET` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Product details and harvest story |
| `/api/products/{productId}/reviews` | `GET` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Public customer ratings and reviews |
| **Beekeeper Portal** |
| `/api/beekeepers/profile` | `POST, GET, PUT` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | Manage beekeeper profile & KYC info |
| `/api/beekeepers/profile/photo` | `POST` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | Upload profile photo (multipart) |
| `/api/beekeepers/profile/status`| `GET` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | Profile completeness & approval status |
| `/api/beekeepers/hives/**` | `GET, POST, PUT, PATCH` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | Hive management & telemetry |
| `/api/beekeepers/batches/**` | `GET, POST, PUT` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | Batch creation, testing, QR generation |
| `/api/beekeepers/products/**` | `GET, POST, PUT, PATCH` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | Beekeeper product marketplace listings |
| `/api/beekeepers/orders/**` | `GET, PUT` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | Beekeeper order fulfillment & tracking |
| **Customer Portal** |
| `/api/customers/profile` | `GET` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | Customer account profile |
| `/api/cart/**` | `GET, POST, PUT, DELETE` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | Shopping cart management |
| `/api/orders/**` | `GET, POST, PUT` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | Checkout, order history, cancel |
| `/api/reviews/**` | `GET, POST, PUT, DELETE` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | Write/manage product reviews |
| **Laboratory Portal** |
| `/api/lab/profile` | `GET` | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Lab technician profile |
| `/api/lab/tests/pending` | `GET` | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Batches awaiting testing |
| `/api/lab/tests/{batchId}` | `GET, POST` | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Inspect batch & submit purity certificate |
| `/api/lab/stats` | `GET` | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Lab testing metrics & throughput |
| **Admin & KVIC Oversight** |
| `/api/admin/dashboard` | `GET` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | Executive KPI overview |
| `/api/admin/stats` | `GET` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | Raw database entity counts |
| `/api/admin/profile` | `GET` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | Admin profile info |
| `/api/admin/beekeepers/**` | `GET, PATCH` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | Beekeeper list & KYC approval |
| `/api/admin/hives` | `GET` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | Platform hive registry |
| `/api/admin/batches/**` | `GET` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | Batch oversight & trace logs |
| `/api/admin/lab-tests` | `GET` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | Lab test audit records |
| `/api/admin/disputes/**` | `GET, PATCH` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | Dispute resolution |
| `/api/admin/analytics/**` | `GET` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | Regional, purity, and risk analytics |
| **User Management** |
| `/api/users/me` | `GET` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | Logged-in user self-profile |
| `/api/users` | `GET` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | All user accounts (Secured) |
| `/api/users/{id}` | `GET` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | Specific user account (Secured) |
| **Notifications** |
| `/api/notifications/**` | `GET, PUT` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | In-app user notifications |

---

## 3. Cross-Tenant Data Isolation Rules

- **Beekeeper Isolation**: Enforced via `findBy*AndBeekeeperProfileId`. Beekeepers cannot view or mutate another beekeeper's hives, batches, or product listings.
- **Customer Isolation**: Enforced via `findByCustomerId` / `auth.getName()`. Customers cannot view or modify another customer's cart, checkout session, or order details.
- **Lab Isolation**: Labs can only submit test results for batches that have been explicitly transitioned to `SENT_FOR_TESTING`.
- **Public Masking**: Public verification endpoints strip all internal entity identifiers, phone numbers, raw passwords, user IDs, and exact GPS coordinates.
