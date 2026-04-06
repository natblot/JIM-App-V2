# External API Integrations Research for JIM Healthcare Application
## Date: 2026-02-24

---

## 1. YOUSIGN API -- Electronic Signature for Healthcare Contracts

### Current Version & Environment

- **Current API version:** v3 (V2 is deprecated; new integrations must use V3)
- **Production base URL:** `https://api.yousign.app/v3`
- **Sandbox base URL:** `https://api-sandbox.yousign.app/v3`
- **Protocol:** REST JSON (with binary data exception for document uploads)
- **Authentication:** Bearer Token -- `Authorization: Bearer {apiKey}`
- **Typical integration time:** Less than one week (per Yousign documentation)

### Rate Limits

| Environment | Rate Limit |
|---|---|
| Sandbox | 30 queries/minute, 200 queries/hour |
| Production | Not publicly documented (contact Yousign) |

### eIDAS Signature Levels

Yousign supports all three eIDAS signature levels:

| Level | API Value | Authentication | Use Case for JIM |
|---|---|---|---|
| **Simple Electronic Signature (SES)** | `electronic_signature` | Optional OTP (email/SMS) or `no_otp` | Daily replacement agreements, simple confirmations |
| **Advanced Electronic Signature (AES)** | `advanced_electronic_signature` | Mandatory SMS OTP + identity document verification | Employment contracts, insurance agreements, replacement contracts with legal weight |
| **Qualified Electronic Signature (QES)** | `qualified_electronic_signature` | Mandatory video recording + ID authentication + human verification | Maximum legal certainty -- documents requiring handwritten signature equivalence |

**Note:** AES and QES are disabled by default. Contact Yousign support to activate them.

### Configuration Example (Signer with SES)

```json
{
  "info": {
    "first_name": "Jean",
    "last_name": "Dupont",
    "email": "[email protected]",
    "phone_number": "+33760047242",
    "locale": "fr"
  },
  "signature_level": "electronic_signature",
  "signature_authentication_mode": "otp_sms",
  "fields": [...]
}
```

### Key Features Relevant to JIM

- **Custom Experiences:** Personalize all aspects of a Signature Request (notifications, UI)
- **Webhooks:** Real-time notifications for signature completions, status changes, etc.
- **Electronic Seal:** Simple, Advanced, and Qualified seals with encryption
- **Identity Verification:** Image/video verification, watchlists, bank account checks
- **iFrame integration:** Embed signature flow directly in the JIM mobile/web app (SES and AES only)
- **Compliance:** GDPR and eIDAS compliant; legally binding in all EU countries

### Pricing

- **API pricing model:** Per-signature, pay-as-you-go (contact sales for exact rates)
- **Application pricing reference:** ~8-12 EUR/user for 30 monthly signatures (application tier, not API)
- **API pricing page:** https://yousign.com/pricing-api (custom quotes for volume)
- **Sandbox:** Free during trial or active subscription (watermarked, non-binding documents)

### Sandbox Limitations

- Signatures and Electronic Seals are NOT legally binding
- All documents are watermarked
- Documents and Identity Verifications are simulated (no real verification)
- Rate limited to 30 queries/minute, 200 queries/hour

### Recommendation for JIM

For healthcare replacement contracts between kinesitherapeutes, **AES (Advanced Electronic Signature)** is recommended as it provides:
- Identity verification of the signer (important for healthcare professionals)
- SMS OTP as second factor
- Sufficient legal weight for employment/replacement contracts
- Available via iFrame for seamless in-app experience

### Sources

- [Yousign API v3 Documentation](https://developers.yousign.com/)
- [Yousign API Introduction](https://developers.yousign.com/docs/introduction-new)
- [Yousign API Environments](https://developers.yousign.com/docs/environments-new)
- [Yousign API Signature Levels](https://developers.yousign.com/docs/set-the-signature-level)
- [Yousign API Pricing](https://yousign.com/pricing-api)
- [Yousign API Postman Collection](https://www.postman.com/yousign/yousign-api-v3/collection/p4jlu5q/yousign-api-v3)
- [Yousign Migration Guide V2 to V3](https://developers.yousign.com/docs/migration-from-our-api-v2)

---

## 2. RPPS API (Annuaire Sante) -- Healthcare Professional Verification

### Overview

The Annuaire Sante is operated by the **Agence du Numerique en Sante (ANS)** and aggregates two key directories:
- **RPPS** (Repertoire Partage des Professionnels intervenant dans le systeme de Sante) -- for healthcare professionals
- **FINESS** -- for healthcare establishments

The API is based on the **HL7 FHIR** standard and provides RESTful access to directory data in JSON format.

### API Endpoints

| Resource | Description | Use for JIM |
|---|---|---|
| **Practitioner** | Search healthcare professionals by RPPS number, name, specialty | Verify kinesitherapeute identity and active status |
| **PractitionerRole** | Professional roles, specialties, qualifications | Verify specialty and qualifications |
| **Organization** | Healthcare structures, establishments | Verify cabinet/establishment details |
| **HealthcareService** | Healthcare services offered | Map available services |
| **Device** | Medical devices | Not directly relevant for JIM |
| **CapabilityStatement** | API metadata and supported features | Integration development |

### Base URL

- **API Gateway:** `https://gateway.api.esante.gouv.fr/fhir/v2/`
- **Live demonstrator:** https://portail.openfhir.annuaire.sante.fr
- **Implementation guide:** https://interop.esante.gouv.fr/ig/fhir/annuaire/

### Freely Accessible Data (No Authentication Required)

- RPPS or FINESS identification numbers
- Professional names and exercise names
- Diplomas and qualifications
- Profession and specialty exercised
- Practice location coordinates (geolocation)

### Restricted Data (Requires CPS Authentication)

- Civil status and birth dates
- Professional history and records
- Additional contact information
- **Authentication required:** CPS-family authentication credentials (carte CPS)
- **Authorization:** ANS Form F420

### Rate Limits

Not explicitly documented in public resources. Contact ANS directly for specific rate limit details.

### Data Refresh

ANS recommends refreshing locally stored data **weekly** to ensure reliability and accuracy.

### Integration Pattern for JIM

```
1. User enters RPPS number during registration
2. JIM backend queries: GET https://gateway.api.esante.gouv.fr/fhir/v2/Practitioner?identifier={rpps_number}
3. API returns FHIR Practitioner resource with:
   - Name
   - Active status
   - Qualifications (diplomas, specialties)
   - Practice locations
4. JIM verifies the professional is:
   - Active (not suspended/retired)
   - A kinesitherapeute (correct specialty code)
   - Registered at the claimed location
5. Store verified status in JIM database
6. Schedule weekly re-verification via background job
```

### Alternative: Third-Party Verification API

A dedicated third-party service exists at https://verification-rpps.fr/ that provides real-time verification of whether a healthcare professional is active via their RPPS number, using Annuaire Sante data.

### Bulk Data Access

For offline/batch processing, bulk extractions are available:
- **Daily extractions:** https://annuaire.sante.fr/web/site-pro/extractions-publiques
- **data.gouv.fr datasets:** For bulk downloads

### Sources

- [Annuaire Sante Official](https://esante.gouv.fr/produits-services/annuaire-sante)
- [Annuaire Sante FHIR Documentation](https://ansforge.github.io/annuaire-sante-fhir-documentation/)
- [FHIR Implementation Guide - Annuaire Sante](https://interop.esante.gouv.fr/ig/fhir/annuaire/)
- [RPPS Verification Service](https://verification-rpps.fr/)
- [ANS API Portal](https://api.gouv.fr/producteurs/ans)
- [Annuaire Sante API Gateway Portal](https://portal.api.esante.gouv.fr/)
- [ANS GitHub - FHIR Documentation](https://github.com/ansforge/annuaire-sante-fhir-documentation)
- [ANS GitHub - FHIR Server](https://github.com/ansforge/annuaire-sante-fhir-serveur)
- [Annuaire Sante Status Dashboard](https://status.annuaire-sante.esante.gouv.fr/)
- [Doctrine Numerique Sante 2025](https://esante.gouv.fr/doctrine/rpps-finess-annuaire-sante)

---

## 3. FHIR FR Core -- French FHIR Implementation Guide

### Overview

FHIR FR Core is the foundational French FHIR implementation guide that standardizes health data exchange in France. It is jointly governed by **HL7 France** and **IHE France**, with contributions from the **ANS (Agence du Numerique en Sante)** and **Interop'Sante**.

- **Current version:** v2.2.0-ballot-2 (latest build: February 23, 2026)
- **FHIR version:** R4
- **Status:** Ballot (consultation phase)
- **Official URL:** http://hl7.fr/ig/fhir/core
- **Build URL:** https://build.fhir.org/ig/Interop-Sante/hl7.fhir.fr.core/

### Mandate

All FHIR implementations in France must be based on FR Core. This includes implementation guides from the ANS and Interop'Sante. Future versions will inherit from HL7 Base Europe profiles for EHDS (European Health Data Space) compatibility.

### Profiles Available

#### Patient Resources
| Profile | Description | JIM Relevance |
|---|---|---|
| FR Core Patient | Base patient profile | Patient data model foundation |
| FR Core Patient with INS | Patient with French National Health Identifier (INS) | Future insurance/identity integration |

#### Healthcare Provider Resources
| Profile | Description | JIM Relevance |
|---|---|---|
| FR Core Practitioner | Healthcare professional profile | **Core** -- kinesitherapeute data model |
| FR Core Practitioner Role | Professional roles and specialties | **Core** -- role/specialty modeling |
| FR Core Related Person | Related persons (family, contacts) | Contact information |

#### Organization Resources
| Profile | Description | JIM Relevance |
|---|---|---|
| FR Core Organization | Base organization profile | Cabinet/practice modeling |
| FR Core Organization - Healthcare Establishment | Healthcare establishment | Hospital/clinic integration |
| FR Core Organization - UAC | Unite d'Activite de Consultation | Consultation unit modeling |
| FR Core Organization - UF | Unite Fonctionnelle | Functional unit modeling |

#### Clinical/Scheduling Resources
| Profile | Description | JIM Relevance |
|---|---|---|
| FR Core Encounter | Patient encounter | Future: track replacement sessions |
| FR Core Appointment | Appointment scheduling | **Core** -- replacement scheduling |
| FR Core Schedule | Provider schedule | **Core** -- availability management |
| FR Core Slot | Time slots | **Core** -- slot-based availability |
| FR Core Healthcare Service | Services offered | Service description |
| FR Core Location | Physical locations | **Core** -- practice locations |

#### Clinical Observations (Vital Signs)
| Profile | Description |
|---|---|
| FR Core Observation - Body Weight | Weight measurements |
| FR Core Observation - Body Height | Height measurements |
| FR Core Observation - Body Temperature | Temperature measurements |
| FR Core Observation - Blood Pressure | Blood pressure measurements |
| FR Core Observation - Heart Rate | Heart rate measurements |
| FR Core Observation - Respiratory Rate | Respiratory rate measurements |
| FR Core Observation - Oxygen Saturation | SpO2 measurements |
| FR Core Observation - BMI | Body mass index |
| FR Core Observation - Head Circumference | Head circumference measurements |
| FR Core Medication Administration | Inhaled oxygen administration |

### Extensions (50+ defined)

Key extensions relevant to JIM:
- Patient nationality, death place, birth date updates
- Organization discipline and activity classifications
- Contact point email types
- Schedule availability times
- Practitioner qualifications extensions

### Value Sets

Extensive terminology bindings covering:
- Patient gender, marital status
- Encounter types
- Organizational classifications
- Identifier types (RPPS, ADELI, FINESS, etc.)
- Measurement methods

### Data Model Design Recommendations for JIM

To ensure future FHIR compatibility, JIM's internal data models should align with these key FHIR resources:

```
JIM Entity          -> FHIR FR Core Profile
-------------------------------------------------
Kinesitherapeute    -> FR Core Practitioner + FR Core PractitionerRole
Cabinet/Practice    -> FR Core Organization + FR Core Location
Replacement Offer   -> FR Core Schedule + FR Core Slot
Replacement Session -> FR Core Appointment + FR Core Encounter
Patient (future)    -> FR Core Patient (with INS)
```

**Key design principles:**
1. Use RPPS as the primary identifier for practitioners (aligned with FHIR Identifier system)
2. Model specialties using French code systems (TRE-R38-SpecialiteOrdinale)
3. Store locations with coordinates (aligned with FR Core Location)
4. Use ISO 8601 date/time formats throughout
5. Design scheduling around Schedule/Slot/Appointment pattern
6. Use FR Core value sets for coded fields (gender, status, etc.)

### European Context (2026)

FHIR is scaling with the arrival of the **European Health Data Space (EHDS)**. HL7 Europe has published new implementation guides to support EHDS. Future FR Core versions will inherit from HL7 Base Europe profiles, ensuring European interoperability.

### Sources

- [FHIR FR Core v2.2.0-ballot-2](https://build.fhir.org/ig/Interop-Sante/hl7.fhir.fr.core/)
- [FHIR Implementation Guides Registry (France)](https://interop.esante.gouv.fr/ig/fhir/)
- [GitHub - Interop-Sante/hl7.fhir.fr.core](https://github.com/Interop-Sante/hl7.fhir.fr.core)
- [HL7 FHIR Packages for France](https://packages.fhir.org/jurisdictions/FR)
- [FHIR FR Core v2.1.0](https://interop-sante.github.io/hl7.fhir.fr.structure/)
- [HL7 Europe FHIR IGs for EHDS (Jan 2026)](https://hl7news.hl7.org/2026/01/02/new-hl7-europe-fhir-implementation-guides-to-support-the-european-health-data-space/)
- [Health Data Hub - FHIR Overview (PDF)](https://www.health-data-hub.fr/sites/default/files/2025-01/fhir%20(2)%20(1).pdf)

---

## 4. Push Notifications -- Firebase Cloud Messaging / APNs

### Architecture for Healthcare Apps

#### The Fundamental Rule

**No sensitive health data (donnees de sante) in notification payloads.**

Push notifications travel through third-party infrastructure (Google FCM servers, Apple APNs servers) and can appear on lock screens. In a healthcare context (both RGPD/GDPR and potentially HDS-regulated), the notification content must NEVER contain:
- Patient names
- Medical record numbers
- Diagnoses or treatment details
- Appointment specifics tied to medical conditions
- Any personally identifiable health information

#### Compliant vs. Non-Compliant Message Examples

| Non-Compliant | Compliant |
|---|---|
| "Votre remplacement chez Dr. Dupont a Paris 15e est confirme pour demain 9h" | "Vous avez une nouvelle notification. Ouvrez l'application pour en savoir plus." |
| "Jean Martin a accepte votre offre de remplacement" | "Un professionnel a repondu a votre annonce." |
| "Nouveau remplacement disponible: Cabinet Dupont, kinesitherapie respiratoire" | "Nouvelle opportunite disponible. Consultez l'application." |

#### Recommended Architecture Pattern

```
+-------------------+     +------------------+     +------------------+
|  JIM Backend      |---->|  FCM / APNs      |---->|  Mobile Device   |
|  (NestJS)         |     |  (Generic alert   |     |  (Lock screen:   |
|                   |     |   payload only)   |     |   generic msg)   |
+-------------------+     +------------------+     +------------------+
        |                                                    |
        |                                                    v
        |                                          +------------------+
        +----------------------------------------->|  App opens       |
           (Secure API call after user opens app)  |  -> Auth check   |
                                                   |  -> Fetch details|
                                                   |  -> Display data |
                                                   +------------------+
```

### Firebase Cloud Messaging (FCM) -- Technical Details

#### GDPR/RGPD Compliance

- **Data processor role:** Google acts as data processor; JIM acts as data controller
- **Data Processing Agreement:** Firebase includes Data Processing and Security Terms
- **Certifications:** ISO 27001, SOC 1/2/3, ISO 27017, ISO 27018
- **EU-US Data Privacy Framework:** Google is certified
- **End-to-end encryption:** FCM supports E2E encryption for sensitive payloads
- **Data minimization:** Send only notification triggers, not actual content

#### Configuration for RGPD Compliance

1. **Sign Google's Data Processing Amendment (DPA)**
2. **Minimize data in FCM payloads:** Only send `data` messages with opaque identifiers
3. **No personal data in `notification` fields** (title, body)
4. **Use `data` messages** (silent notifications) to trigger in-app data fetch
5. **Implement consent management:** Request push notification permission with clear explanation
6. **Configure data retention:** Set minimum retention periods in Firebase console
7. **Document in privacy policy:** Explain FCM usage, data flow, Google's role

#### FCM Delivery Guarantees

- FCM is a **best-effort delivery system** -- not guaranteed delivery
- Messages can be delayed if device is offline (stored for up to 28 days by default)
- Use `time_to_live` parameter to expire time-sensitive notifications
- Use `priority: high` for urgent notifications (use sparingly to avoid throttling)
- Implement in-app polling as fallback for critical notifications

#### Recommended FCM Payload Structure for JIM

```json
{
  "message": {
    "token": "device_fcm_token",
    "data": {
      "type": "replacement_update",
      "id": "uuid-of-notification",
      "timestamp": "2026-02-24T10:30:00Z"
    },
    "notification": {
      "title": "JIM",
      "body": "Vous avez une nouvelle notification"
    },
    "android": {
      "priority": "high",
      "ttl": "86400s"
    },
    "apns": {
      "headers": {
        "apns-priority": "10"
      },
      "payload": {
        "aps": {
          "alert": {
            "title": "JIM",
            "body": "Vous avez une nouvelle notification"
          },
          "badge": 1,
          "sound": "default"
        }
      }
    }
  }
}
```

### APNs (Apple Push Notification Service) -- Specifics

- Required for iOS devices even when using FCM (FCM proxies through APNs)
- Requires Apple Developer Program membership
- Requires APNs key or certificate configuration in Firebase console
- Supports VoIP push notifications for urgent communications
- Background modes must be configured in Xcode

### Audit & Compliance Requirements

For a healthcare app, implement:
1. **Audit trail:** Log all notification sends (timestamp, sender, recipient ID, delivery status)
2. **RBAC:** Limit who can trigger notifications
3. **Consent management:** Track user opt-in/opt-out for notifications
4. **Data deletion:** Ability to purge notification logs per RGPD right to erasure

### Sources

- [HIPAA Compliant Push Notifications Guide 2026](https://indigitall.com/en/blog/hipaa-compliant-push-notifications-the-ultimate-guide-for-healthcare-in-2026/)
- [Firebase Cloud Messaging iOS Setup](https://firebase.google.com/docs/cloud-messaging/ios/receive-messages)
- [Firebase Privacy and Security](https://firebase.google.com/support/privacy)
- [Firebase GDPR Compliance (iubenda)](https://www.iubenda.com/en/help/23040-firebase-cloud-gdpr-how-to-be-compliant/)
- [Firebase GDPR and DPO (TermsFeed)](https://www.termsfeed.com/blog/gdpr-firebase-dpo/)
- [Is Firebase GDPR Compliant? (SimpleAnalytics)](https://www.simpleanalytics.com/is-gdpr-compliant/firebase)
- [FCM End-to-End Encryption](https://firebase.google.com/docs/cloud-messaging/encryption)
- [FCM on Android Best Practices (2025)](https://firebase.blog/posts/2025/04/fcm-on-android/)
- [Top 7 Push Notification Providers 2025](https://www.courier.com/blog/top-7-push-notification-providers-in-2025)

---

## 5. WebSocket -- Real-Time Messaging Architecture

### Socket.io vs Native WebSocket Comparison

| Criterion | Native WebSocket | Socket.io |
|---|---|---|
| **Protocol** | Browser-native, raw binary TCP | Library built on top of WebSocket + fallbacks |
| **Overhead** | Minimal (2-14 bytes per frame) | Higher (custom event serialization, ~50-100 bytes overhead) |
| **Latency** | Lower (raw protocol) | Slightly higher (serialization/deserialization) |
| **Auto-reconnection** | Manual implementation required | Built-in with configurable backoff |
| **Fallback transports** | None (WebSocket or nothing) | HTTP long-polling, Server-Sent Events |
| **Rooms/Namespaces** | Manual implementation required | Built-in support |
| **Binary support** | Native | Supported but serialized |
| **Scaling adapter** | Manual pub/sub implementation | Redis adapter built-in (`@socket.io/redis-adapter`) |
| **Kubernetes support** | Requires manual sticky session config | Requires sticky sessions + Redis adapter |
| **Client libraries** | Browser-native API | Dedicated client libraries (JS, Dart, Swift, Kotlin) |

### Recommendation for JIM

**Socket.io is recommended** for JIM because:
1. **Auto-reconnection** is critical for mobile healthcare apps (users move between WiFi/cellular)
2. **Rooms** naturally map to conversations (replacement negotiations, chat rooms)
3. **Redis adapter** simplifies Kubernetes horizontal scaling
4. **Flutter client** exists (`socket_io_client` package for Dart)
5. **Namespace separation** allows isolating different feature channels (chat, notifications, status updates)
6. The performance overhead is negligible for a messaging use case (not high-frequency trading)

### Scaling Architecture on Kubernetes

#### Components

```
                    +---------------------+
                    |   Kubernetes        |
                    |   Ingress/LB        |
                    |  (sticky sessions)  |
                    +----------+----------+
                               |
              +----------------+----------------+
              |                |                |
     +--------v------+ +------v--------+ +-----v---------+
     | Socket.io     | | Socket.io     | | Socket.io     |
     | Pod 1         | | Pod 2         | | Pod 3         |
     | (NestJS)      | | (NestJS)      | | (NestJS)      |
     +-------+-------+ +------+--------+ +------+--------+
              |                |                |
              +----------------+----------------+
                               |
                    +----------v----------+
                    |   Redis Cluster     |
                    |   (Pub/Sub +        |
                    |    Session Store)   |
                    +---------------------+
```

#### Sticky Sessions Configuration (Kubernetes Service)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: jim-websocket
spec:
  type: ClusterIP
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800  # 3 hours
  selector:
    app: jim-websocket
  ports:
    - port: 3000
      targetPort: 3000
```

#### Socket.io Redis Adapter (NestJS)

```typescript
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: { origin: '*' },
      transports: ['websocket', 'polling'],
    });
    server.adapter(this.adapterConstructor);
    return server;
  }
}
```

#### Kubernetes Ingress (NGINX) for WebSocket

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: jim-websocket-ingress
  annotations:
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
    nginx.ingress.kubernetes.io/affinity: "cookie"
    nginx.ingress.kubernetes.io/session-cookie-name: "jim-ws-sticky"
    nginx.ingress.kubernetes.io/session-cookie-expires: "172800"
    nginx.ingress.kubernetes.io/session-cookie-max-age: "172800"
    nginx.ingress.kubernetes.io/websocket-services: "jim-websocket"
spec:
  rules:
    - host: ws.jim-app.fr
      http:
        paths:
          - path: /socket.io
            pathType: Prefix
            backend:
              service:
                name: jim-websocket
                port:
                  number: 3000
```

#### Memory Considerations

- Each WebSocket connection: ~100-200 bytes object in Node.js process
- TCP socket buffers: ~16 KB per connection
- At 100,000 concurrent connections: memory usage exceeds 1.6 GB
- **For JIM:** Expected concurrent connections are much lower (thousands, not hundreds of thousands)

#### Healthcare-Specific Considerations

1. **Message encryption:** Encrypt message payloads at the application level (not just TLS for transport)
2. **Message persistence:** Store all messages in database (PostgreSQL) for audit trail
3. **Authentication:** Validate JWT on WebSocket handshake; reject unauthenticated connections
4. **Rate limiting:** Implement per-user message rate limits to prevent abuse
5. **Heartbeat:** Configure appropriate ping/pong intervals (25-30 seconds recommended)
6. **Graceful degradation:** If WebSocket fails, fall back to polling for critical notifications

### Sources

- [Socket.IO vs WebSocket Guide (Velt, Sep 2025)](https://velt.dev/blog/socketio-vs-websocket-guide-developers)
- [WebSocket vs Socket.IO Performance Guide (Ably)](https://ably.com/topic/socketio-vs-websocket)
- [WebSockets Complete Guide 2026 (DevToolbox)](https://devtoolbox.dedyn.io/blog/websocket-complete-guide)
- [Scaling WebSockets: Socket.io + Redis + Docker + Kubernetes](https://dev.to/sw360cab/scaling-websockets-in-the-cloud-part-1-from-socket-io-and-redis-to-a-distributed-architecture-with-docker-and-kubernetes-17n3)
- [Scale WebSockets in Kubernetes with Node.js (Platformatic)](https://blog.platformatic.dev/building-a-high-performance-streaming-service-in-kubernetes-websockets-at-scale)
- [How We Scaled WebSockets on Kubernetes](https://modernbackend.substack.com/p/how-we-scaled-websockets-on-kubernetes)
- [Horizontal Scaling WebSocket on Kubernetes (ShebangLabs)](https://www.shebanglabs.io/horizontal-scaling-websocket-on-kubernetes-and-nodejs/)
- [Socket.io with K8s Discussion (Kubernetes Forums)](https://discuss.kubernetes.io/t/websocket-with-socket-io-on-k8s-how-to-make-it-work/28821)
- [Kubernetes Ingress WebSocket Configuration](https://websocket.org/guides/infrastructure/kubernetes/)
- [Scaling Pub/Sub with WebSockets and Redis (Ably)](https://ably.com/blog/scaling-pub-sub-with-websockets-and-redis)
- [Scalable WebSocket Server GitHub](https://github.com/omkargade04/Scalable-Websocket-Server)

---

## 6. Mapbox vs Google Maps -- Geolocation for French Healthcare App

### Feature Comparison

| Feature | Mapbox | Google Maps Platform |
|---|---|---|
| **Data source** | OpenStreetMap (community-maintained) | Google proprietary data |
| **Customization** | Extensive (Mapbox Studio, custom styles) | Limited (colors, markers, controls) |
| **Offline maps** | Full offline map download support | Limited offline functionality |
| **Data visualization** | Strong tools for data overlay | Limited visualization tools |
| **Traffic data** | Real-time (quality varies by region) | Highly accurate and comprehensive |
| **Geocoding accuracy (France)** | Good, based on OpenStreetMap + BAN | Excellent, Google's proprietary data |
| **DOM-TOM coverage** | OpenStreetMap-based (varies by territory) | Generally good but less detail in remote areas |
| **Self-hosting option** | Yes (Mapbox Atlas) | No |

### Pricing Comparison

#### Mapbox Pricing

| Product | Free Tier | Paid Rate |
|---|---|---|
| Web map loads | 50,000/month | Pay-as-you-go after |
| Mobile MAU | 25,000/month (Navigation v3: 100 free) | $0.30/user after free tier |
| Navigation trips | 1,000/month | $0.08/trip (1K-50K), $0.064 (50K-100K), $0.048 (100K+) |
| Geocoding | Included in map loads | Volume-based |
| **Atlas (on-premise)** | N/A | Contact sales (enterprise pricing) |

#### Google Maps Platform Pricing (Post-March 2025 Changes)

| Product | Free Tier | Paid Rate |
|---|---|---|
| Dynamic Maps | 10,000 loads/month (per API) | ~$7/1,000 loads |
| Geocoding | 10,000 requests/month | $0.005/request (up to volume tiers) |
| Directions (Legacy) | 10,000 requests/month | $0.005-$0.01/request |
| Routes API (new) | 10,000 requests/month | Volume-based |

**Note:** Google Maps Platform changed pricing in March 2025 -- the old $200/month credit was replaced with **free usage caps of 10,000 API calls per month per API** (Essentials category).

### RGPD/GDPR Compliance

#### Mapbox
- **Standard Contractual Clauses (SCCs):** Included in Data Processing Agreement
- **EU-US Data Privacy Framework:** Certified
- **Data Processing Agreement (DPA):** Available at https://www.mapbox.com/legal/dpa
- **On-premise option (Atlas):** Eliminates data transfer concerns entirely
- **Atlas compliance:** HIPAA, SOC 2, FISMA, ISO, GDPR compliant

#### Google Maps Platform
- **Data Processing Agreement:** Available via Google Cloud DPA
- **EU-US Data Privacy Framework:** Google LLC is certified
- **Data residency:** No EU-only option; data processed on Google's global infrastructure
- **No on-premise option:** All data flows through Google servers
- **Schrems II implications:** Higher risk profile for sensitive healthcare data

### DOM-TOM (Outre-Mer) Considerations

| Territory | Mapbox Coverage | Google Maps Coverage |
|---|---|---|
| Guadeloupe | OpenStreetMap data (community-contributed) | Good |
| Martinique | OpenStreetMap data (community-contributed) | Good |
| Guyane | Variable (less populated areas sparse) | Variable |
| La Reunion | OpenStreetMap data (active community) | Good |
| Mayotte | Limited | Limited |

**Recommendation:** For DOM-TOM, test both providers on specific territories. Mapbox's offline capability is a significant advantage for areas with unreliable internet connectivity.

### Recommendation for JIM

**Mapbox is recommended** for JIM because:

1. **RGPD compliance:** Mapbox Atlas offers on-premise deployment, completely eliminating cross-border data transfer concerns for healthcare data
2. **Offline maps:** Critical for DOM-TOM territories with unreliable connectivity; full offline map download is supported
3. **Customization:** Custom map styles to highlight healthcare establishments, replacement locations
4. **Pricing:** More generous free tier for mobile apps (25,000 MAU vs Google's per-load pricing)
5. **OpenStreetMap foundation:** French community actively maintains OpenStreetMap data; BAN (Base Adresse Nationale) data is well-integrated
6. **Data sovereignty:** With Atlas, map data stays in your infrastructure (important for HDS compliance context)

**Trade-off:** Google Maps has superior traffic data and more accurate geocoding in some areas, but these are less critical for a healthcare replacement platform.

### Alternative: French Government BAN API

For geocoding only, consider the free French government **Base Adresse Nationale (BAN)** API:
- **Endpoint:** `https://api-adresse.data.gouv.fr/search/`
- **Free, no authentication required**
- **Covers all of France including DOM-TOM**
- **RGPD compliant by design (French government data)**
- Can be used alongside Mapbox for display

### Sources

- [Mapbox vs Google Maps API 2026 Comparison (Radar)](https://radar.com/blog/mapbox-vs-google-maps-api)
- [Mapbox Legal FAQ / Data Privacy](https://www.mapbox.com/legal/legal-faq)
- [Mapbox Data Processing Agreement](https://www.mapbox.com/legal/dpa)
- [Mapbox Privacy Policy](https://www.mapbox.com/legal/privacy)
- [Mapbox Data Privacy Framework Certification](https://www.mapbox.com/legal/notice-of-certification)
- [Mapbox Atlas (On-Premise)](https://www.mapbox.com/atlas)
- [Mapbox Pricing](https://www.mapbox.com/pricing)
- [Google Maps Platform Pricing](https://developers.google.com/maps/billing-and-pricing/pricing)
- [Google Maps Platform March 2025 Changes](https://developers.google.com/maps/billing-and-pricing/march-2025)
- [Google Maps Platform Pricing Overview](https://developers.google.com/maps/billing-and-pricing/overview)
- [Google Cloud GDPR](https://cloud.google.com/privacy/gdpr)

---

## Summary Recommendations for JIM

| Integration | Recommended Solution | Priority | Complexity |
|---|---|---|---|
| Electronic Signature | **Yousign API v3** (AES level) | High (MVP) | Medium |
| RPPS Verification | **Annuaire Sante FHIR API** | High (MVP) | Low-Medium |
| Data Model Alignment | **FHIR FR Core** design patterns | Medium (architecture) | Low (design-time) |
| Push Notifications | **FCM + APNs** (generic payloads only) | High (MVP) | Medium |
| Real-Time Messaging | **Socket.io + Redis + Kubernetes** | High (MVP) | High |
| Geolocation/Maps | **Mapbox** (+ BAN API for geocoding) | Medium | Medium |

### Key Integration Risks

1. **Yousign AES activation:** AES is disabled by default; requires contacting Yousign support and may require verification of your use case
2. **RPPS API rate limits:** Not publicly documented; may need ANS approval for high-volume usage
3. **FHIR FR Core ballot status:** v2.2.0 is still in consultation; design for flexibility as profiles may evolve
4. **FCM RGPD:** Requires careful payload design and proper DPA with Google; consider separate notification service for maximum compliance
5. **WebSocket scaling:** Sticky sessions + Redis adapter adds infrastructure complexity; plan for this in Kubernetes architecture from day one
6. **Mapbox DOM-TOM:** Coverage quality varies; conduct territory-specific testing before launch
