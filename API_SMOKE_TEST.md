# HoneyChain — API Smoke Test Results

> **Test Execution Date**: 2026-09-04  
> **Environment**: Automated Integration Test Suite (`mvn clean test`) & MockMvc

---

## 1. Test Summary

- **Total Integration Tests Run**: 188
- **Passed**: 188
- **Failed**: 0
- **Errors**: 0
- **Success Rate**: 100%

---

## 2. Detailed Endpoint Smoke Test Checklist

| Endpoint | Method | Auth Required | Expected Status | Test Result |
|----------|:------:|:-------------:|:---------------:|:-----------:|
| `/api/health` | `GET` | No | `200 OK` | ✅ PASS |
| `/api/auth/send-otp` | `POST` | No | `200 OK` | ✅ PASS |
| `/api/auth/verify-otp` | `POST` | No | `200 OK` | ✅ PASS |
| `/api/auth/login` | `POST` | No | `200 OK` | ✅ PASS |
| `/api/beekeepers/profile` | `POST` | BEEKEEPER | `201 CREATED` | ✅ PASS |
| `/api/beekeepers/profile` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/profile` | `PUT` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/profile/status` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/profile/photo` | `POST` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/hives` | `POST` | BEEKEEPER | `201 CREATED` | ✅ PASS |
| `/api/beekeepers/hives` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/hives/{id}` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/hives/{id}` | `PUT` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/hives/{id}/status` | `PATCH` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/hives/count` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/hives/health` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/hives/{hiveId}/health` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/hives/{hiveId}/sensors/latest` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/hives/{hiveId}/sensors/history` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/hives/{hiveId}/yield-prediction` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/hives/yield-predictions` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/hives/{hiveId}/yield-prediction/refresh` | `POST` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/batches` | `POST` | BEEKEEPER | `201 CREATED` | ✅ PASS |
| `/api/beekeepers/batches` (Idempotent Retry) | `POST` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/batches` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/batches/{batchId}` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/batches/{batchId}` | `PUT` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/batches/{batchId}/send-testing` | `POST` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/batches/stats` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/batches/{batchId}/blockchain` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/batches/{batchId}/blockchain/verify` | `POST` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/batches/{batchId}/lab-result` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/batches/{batchId}/generate-qr` | `POST` | BEEKEEPER | `201 CREATED` | ✅ PASS |
| `/api/beekeepers/batches/{batchId}/qr` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/batches/{batchId}/verification-history` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/lab/profile` | `GET` | LAB | `200 OK` | ✅ PASS |
| `/api/lab/tests/pending` | `GET` | LAB | `200 OK` | ✅ PASS |
| `/api/lab/tests/{batchId}` | `GET` | LAB | `200 OK` | ✅ PASS |
| `/api/lab/tests/{batchId}` | `POST` | LAB | `201 CREATED` | ✅ PASS |
| `/api/lab/stats` | `GET` | LAB | `200 OK` | ✅ PASS |
| `/api/public/verify/{batchId}` | `GET` | No | `200 OK` | ✅ PASS |
| `/api/public/verify/{batchId}/scan` | `POST` | No | `200 OK` | ✅ PASS |
| `/api/public/verify/{batchId}/history` | `GET` | No | `200 OK` | ✅ PASS |
| `/api/products` | `GET` | No | `200 OK` | ✅ PASS |
| `/api/products/{id}` | `GET` | No | `200 OK` | ✅ PASS |
| `/api/products/{productId}/reviews` | `GET` | No | `200 OK` | ✅ PASS |
| `/api/beekeepers/products` | `POST` | BEEKEEPER | `201 CREATED` | ✅ PASS |
| `/api/beekeepers/products` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/products/{id}` | `PUT` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/products/{id}/status` | `PATCH` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/customers/profile` | `GET` | CUSTOMER | `200 OK` | ✅ PASS |
| `/api/cart` | `GET` | CUSTOMER | `200 OK` | ✅ PASS |
| `/api/cart/items` | `POST` | CUSTOMER | `200 OK` | ✅ PASS |
| `/api/cart/items/{id}` | `PUT` | CUSTOMER | `200 OK` | ✅ PASS |
| `/api/cart/items/{id}` | `DELETE` | CUSTOMER | `200 OK` | ✅ PASS |
| `/api/cart` | `DELETE` | CUSTOMER | `200 OK` | ✅ PASS |
| `/api/orders/checkout` | `POST` | CUSTOMER | `201 CREATED` | ✅ PASS |
| `/api/orders` | `GET` | CUSTOMER | `200 OK` | ✅ PASS |
| `/api/orders/{orderNumber}` | `GET` | CUSTOMER | `200 OK` | ✅ PASS |
| `/api/orders/{orderNumber}/cancel` | `PUT` | CUSTOMER | `200 OK` | ✅ PASS |
| `/api/beekeepers/orders` | `GET` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/beekeepers/orders/{orderNumber}/status` | `PUT` | BEEKEEPER | `200 OK` | ✅ PASS |
| `/api/reviews` | `POST` | CUSTOMER | `200 OK` | ✅ PASS |
| `/api/reviews/my` | `GET` | CUSTOMER | `200 OK` | ✅ PASS |
| `/api/reviews/order-item/{orderItemId}` | `GET` | CUSTOMER | `200 OK` | ✅ PASS |
| `/api/reviews/{id}` | `PUT` | CUSTOMER | `200 OK` | ✅ PASS |
| `/api/reviews/{id}` | `DELETE` | CUSTOMER | `200 OK` | ✅ PASS |
| `/api/notifications` | `GET` | Authenticated | `200 OK` | ✅ PASS |
| `/api/notifications/unread-count` | `GET` | Authenticated | `200 OK` | ✅ PASS |
| `/api/notifications/{id}/read` | `PUT` | Authenticated | `200 OK` | ✅ PASS |
| `/api/notifications/read-all` | `PUT` | Authenticated | `200 OK` | ✅ PASS |
| `/api/admin/dashboard` | `GET` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/admin/stats` | `GET` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/admin/profile` | `GET` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/admin/beekeepers` | `GET` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/admin/beekeepers/{id}` | `GET` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/admin/beekeepers/{id}/status` | `PATCH` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/admin/hives` | `GET` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/admin/batches` | `GET` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/admin/batches/{batchId}` | `GET` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/admin/lab-tests` | `GET` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/admin/disputes` | `GET` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/admin/disputes/{id}/status` | `PATCH` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/admin/analytics/purity` | `GET` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/admin/analytics/regions` | `GET` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/admin/analytics/production` | `GET` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/admin/analytics/sales` | `GET` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/admin/analytics/verification-risk` | `GET` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/users/me` | `GET` | Authenticated | `200 OK` | ✅ PASS |
| `/api/users` | `GET` | ADMIN / KVIC | `200 OK` | ✅ PASS |
| `/api/users/{id}` | `GET` | ADMIN / KVIC | `200 OK` | ✅ PASS |