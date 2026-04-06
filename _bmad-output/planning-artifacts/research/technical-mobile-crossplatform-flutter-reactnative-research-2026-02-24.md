# Research: Mobile Cross-Platform Frameworks for Healthcare Applications in France
## Context: JIM (Job in Med) - Healthcare Professional Networking App for Physiotherapists
### Date: 2026-02-24

---

## Table of Contents

1. [Flutter vs React Native in 2026 - Performance Benchmarks](#1-flutter-vs-react-native-in-2026---performance-benchmarks)
2. [Flutter in Healthcare Apps - French Context](#2-flutter-in-healthcare-apps---french-context)
3. [React Native New Architecture (Fabric, TurboModules, JSI)](#3-react-native-new-architecture-fabric-turbomodules-jsi)
4. [Expo vs Bare React Native for Production Healthcare Apps](#4-expo-vs-bare-react-native-for-production-healthcare-apps)
5. [Doctolib's Tech Stack](#5-doctolibs-tech-stack)
6. [Pro Sante Connect (PSC/e-CPS) Integration](#6-pro-sante-connect-psce-cps-integration)
7. [Electronic Signature Libraries](#7-electronic-signature-libraries)
8. [French Health Data Compliance (HDS)](#8-french-health-data-compliance-hds)
9. [Synthesis and Recommendation for JIM](#9-synthesis-and-recommendation-for-jim)

---

## 1. Flutter vs React Native in 2026 - Performance Benchmarks

### 1.1 Market Share

- **Flutter**: ~46% market share among mobile developers in 2026
- **React Native**: ~35% market share among mobile developers in 2026
- Both frameworks are considered production-grade and mature

**Source**: [TechAhead - Flutter vs React Native 2026](https://www.techaheadcorp.com/blog/flutter-vs-react-native-in-2026-the-ultimate-showdown-for-app-development-dominance/)

### 1.2 Concrete Benchmark Numbers (2025-2026)

#### Frame Rate (FPS)

| Metric | Flutter | React Native | Notes |
|--------|---------|-------------|-------|
| iOS FPS | 59.31 FPS | 57.49 FPS | Flutter: 98.85% of 60 FPS ceiling |
| iOS Dropped Frames | 0% | 15.51% | Significant difference |
| iOS Jank | 0% | 1.8% | Flutter: zero jank |
| Complex Animations | Consistent 60/120 FPS | 45-50 FPS drops | Under JS thread contention |
| Standard Animations | 60 FPS | 55-65 FPS | Normal use cases |

**Source**: [SynergyBoat - Flutter vs React Native vs Native 2025 Benchmark](https://www.synergyboat.com/blog/flutter-vs-react-native-vs-native-performance-benchmark-2025)

#### Startup Time

| Metric | Flutter | React Native | Notes |
|--------|---------|-------------|-------|
| iOS First Frame | 16.67ms | 32.96ms | Flutter 2x faster |
| Android First Frame (120Hz) | 10.33ms | 15.31ms | Flutter significantly faster |
| Mid-range Device Cold Start | 1.0-1.5s | 1.2-2.0s | Typical range |

**Source**: [SynergyBoat Benchmark](https://www.synergyboat.com/blog/flutter-vs-react-native-vs-native-performance-benchmark-2025), [ADevs - React Native vs Flutter 2026](https://adevs.com/blog/react-native-vs-flutter/)

#### Frame Render Time

| Metric | Flutter | React Native | Notes |
|--------|---------|-------------|-------|
| iOS Average | 1.72ms/frame | 16.65ms/frame | RN right at 16.7ms budget |
| Android (120Hz) | 4.01ms | 8.34ms | Flutter has more headroom |

**Source**: [SynergyBoat Benchmark](https://www.synergyboat.com/blog/flutter-vs-react-native-vs-native-performance-benchmark-2025)

#### Memory Usage

| Metric | Flutter | React Native | Notes |
|--------|---------|-------------|-------|
| iOS Animation Test (iPhone 15) | ~94 MB stable | ~1.38 GB spike | Dramatic difference |
| Base App Size Android | 4-5 MB | Larger | Flutter slightly smaller |

**Source**: [SynergyBoat Benchmark](https://www.synergyboat.com/blog/flutter-vs-react-native-vs-native-performance-benchmark-2025), [Medium - Real App Benchmark](https://medium.com/@baheer224/react-native-vs-flutter-performance-real-app-benchmark-9191e7122e11)

### 1.3 Development Cost and Timeline

| Factor | Flutter | React Native |
|--------|---------|-------------|
| MVP Timeline | 12-16 weeks | 14-20 weeks |
| Cost Savings vs Native | 40-60% | 30-50% |
| Developer Availability | Smaller Dart pool | JS devs 3-5x more available |

**Source**: [Agile Soft Labs - Flutter vs React Native 2026 Cost & DX](https://www.agilesoftlabs.com/blog/2026/02/flutter-vs-react-native-2026-cost-dx_17)

### 1.4 Healthcare-Specific Comparison

- **Flutter**: Better for fitness/wellness apps requiring real-time tracking; built-in AES encryption, secure storage APIs, biometric authentication
- **React Native**: Larger ecosystem of security libraries and proven compliance implementations; more reliable for EHR, insurance, telehealth, and hospital system integrations
- **Compliance ecosystem**: React Native has more established compliance patterns for clinical healthcare apps

**Source**: [DEV Community - Flutter vs React Native Healthcare & Fitness Apps](https://dev.to/ciphernutz/flutter-vs-react-native-which-is-better-for-healthcare-fitness-apps-178)

---

## 2. Flutter in Healthcare Apps - French Context

### 2.1 General Flutter Healthcare Ecosystem

Flutter has a growing healthcare ecosystem with templates and packages:
- Open-source healthcare app templates on GitHub (e.g., TheAlphamerc/flutter_healthcare_app)
- 57+ healthcare Flutter templates on CodeCanyon
- FlutterFlow enabling no-code medical app development
- Blood pressure classification apps, personal medical assistants

**Sources**:
- [GitHub - flutter_healthcare_app](https://github.com/TheAlphamerc/flutter_healthcare_app)
- [FlutterFlow Healthcare](https://www.flutterflowdevs.com/blog/healthcare-app-in-flutterflow)
- [CodeCanyon Flutter Healthcare](https://codecanyon.net/category/mobile/flutter?term=healthcare)

### 2.2 Flutter in French Healthcare - Findings

**No specific French health apps using Flutter were found in the research.** The search for "Flutter healthcare app France sante" did not return any results showing major French healthcare platforms built with Flutter.

Key observations:
- The dominant French healthcare app (Doctolib) uses React Native, not Flutter
- Hublo (French healthcare staffing, 1M+ users) chose React Native/Expo for their rewrite
- No evidence of Flutter being used for Pro Sante Connect integration
- No Flutter-specific SDK or library for French health regulatory compliance (HDS, PSC)

### 2.3 Flutter Healthcare Limitations for French Market

- **No established Pro Sante Connect integration patterns** in Flutter/Dart ecosystem
- **Smaller Dart developer pool in France** compared to JavaScript/TypeScript
- **No French healthcare reference implementations** in Flutter found
- **OAuth2/OpenID Connect libraries** exist in Dart but are less battle-tested for French healthcare-specific flows

**Source**: [Kody TechnoLab - Flutter for Medical App Development](https://kodytechnolab.com/blog/flutter-for-medical-app-development/)

---

## 3. React Native New Architecture (Fabric, TurboModules, JSI)

### 3.1 Current State (2026)

The New Architecture is **fully stable as of React Native 0.76** (released December 2024) and is **enabled by default** in all new React Native projects. The legacy bridge is no longer an option as of early 2026.

**Source**: [React Native Official - About the New Architecture](https://reactnative.dev/architecture/landing-page), [React Native Blog - The New Architecture is Here](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here)

### 3.2 Core Components

#### JSI (JavaScript Interface)
- Replaces the old asynchronous bridge with synchronous C++ bindings
- Enables direct communication between JavaScript and native code
- Eliminates serialization/deserialization overhead of the old JSON bridge

#### Fabric (New Renderer)
- Synchronous rendering pipeline eliminating layout calculation bottlenecks
- Full support for modern React features: Suspense, Transitions, automatic batching, useLayoutEffect
- Smoother scrolling, more responsive focus changes, fluid animations
- Enables concurrent rendering capabilities

#### TurboModules
- Lazy loading: modules load only when needed (not all at startup)
- Reduces initial load times and memory usage
- Type-safe native module interface via Codegen

#### Hermes (JavaScript Engine)
- Default engine in React Native
- Faster startup times via bytecode precompilation
- Smaller bundle sizes
- Improved memory efficiency vs JavaScriptCore

**Sources**:
- [Medium - Deep Dive into React Native's New Architecture](https://medium.com/@DhruvHarsora/deep-dive-into-react-natives-new-architecture-jsi-turbomodules-fabric-yoga-234bbdf853b4)
- [DEV Community - Understanding Hermes, Fabric, and the New Architecture](https://dev.to/naderalfakesh/understanding-hermes-fabric-and-the-new-architecture-in-react-native-49gb)
- [Guilherme Albert - React Native New Architecture](https://guilhermealbert.com/blog/react-native-new-architecture/)

### 3.3 Performance Improvements with New Architecture

| Metric | Improvement | Details |
|--------|-------------|---------|
| Cold Start Times | 50-70% faster | Via lazy module loading and optimized initialization |
| Frame Rates | Solid 60 FPS | Consistent across standard interactions |
| Memory Usage | 20-30% reduction | Compared to old architecture |
| Startup Times | Up to 40% faster | General improvement |
| App Rendering (Kraken case) | 2.5x faster home screen | Real-world production example |

**Sources**:
- [DEV Community - How React Native's New Architecture Affects Performance](https://dev.to/amazonappdev/how-does-react-natives-new-architecture-affect-performance-1dkf)
- [EurosHub - React Native in 2026](https://www.euroshub.com/blogs/react-native-2026-whats-new-and-what-to-expect)
- [NuCamp - React Native in 2026](https://www.nucamp.co/blog/react-native-in-2026-build-ios-and-android-apps-with-javascript)

### 3.4 Migration Status

- New Architecture is **mandatory** in React Native 0.76+
- Most major libraries have migrated to support it
- Callstack published migration guides and experimentation tooling
- The ecosystem has moved past the transition phase into a "mandatory performance standards" era

**Source**: [Callstack - Experiment with New Architecture](https://www.callstack.com/blog/experiment-with-new-architecture-of-react-native), [DEV Community - Migration Process for 2026](https://dev.to/sherry_walker_bba406fb339/the-react-native-new-architecture-migration-process-for-2026-27l3)

---

## 4. Expo vs Bare React Native for Production Healthcare Apps

### 4.1 Expo in 2026 - Production Readiness

Expo has evolved from a beginner-friendly tool into a **production-grade React Native framework**. Key statistics:
- **2,262 trending apps** on iOS App Store identified using Expo (tracked since 2024)
- **1.5+ million apps worldwide** use Expo
- **30+ million builds annually** processed by EAS
- **783k+ public GitHub repos** using Expo OSS

**Sources**:
- [Evan Bacon - Who's using Expo in 2026](https://evanbacon.dev/blog/expo-apps)
- [Meta Design Solutions - Expo 2026](https://metadesignsolutions.com/expo-2026-the-best-way-to-build-cross-platform-apps/)

### 4.2 Healthcare Apps Using Expo in Production

| App | Description | Expo Usage |
|-----|-------------|------------|
| **MyBSWHealth** | Health system (Baylor Scott & White) | Expo SDK + React Navigation |
| **Solv** | Same-day healthcare/urgent care booking | Expo-based |
| **Carbon Health (Carby Health)** | Medical care provider | Updated Feb 2025 |
| **Cerebral** | Mental health services (therapy, psychiatry) | Expo-based |
| **Hinge Health** | Physical therapy and pain management | Expo-based |
| **Rise (Sleep Tracker)** | Sleep monitoring | Expo-based |
| **Hublo** | French healthcare staffing (1M+ professionals) | Rewritten with Expo |

**Sources**:
- [Evan Bacon - Who's using Expo in 2026](https://evanbacon.dev/blog/expo-apps)
- [Medium - Hublo Rewrite with Expo](https://medium.com/@joseph.bedminster/how-i-rewrote-a-6-years-old-app-used-by-1m-healthcare-professionals-with-expo-f6bdcb6c8ab3)

### 4.3 Hublo Case Study (French Healthcare + Expo)

**Hublo** is a **French** healthcare staffing platform used by **1M+ healthcare professionals**:
- **Previous stack**: Java (Android) + Objective-C (iOS), 6 years old
- **Rewrite choice**: React Native with Expo
- **Why Expo/RN**: Structure and patterns close to React (used internally for web), significant development ecosystem, React Native APIs provide easy access to native components
- **Architecture**: WebView bridge for complex web app integration, hundreds of views with complex business logic
- This is a **directly relevant French healthcare precedent** for JIM

**Source**: [Medium - How I Rewrote a 6-Years Old App Used by 1M+ Healthcare Professionals with Expo](https://medium.com/@joseph.bedminster/how-i-rewrote-a-6-years-old-app-used-by-1m-healthcare-professionals-with-expo-f6bdcb6c8ab3)

### 4.4 Expo Technical Capabilities for JIM's Requirements

#### Custom Native Code Support
- **Config Plugins**: Automatically configure native projects beyond default app config
- **Expo Modules API**: Write Swift and Kotlin code for custom native modules and views
- **Development Builds**: Custom version of Expo Go with full native library access
- **CNG (Continuous Native Generation)**: Native directories generated at build time via `npx expo prebuild`
- **EAS Build**: Cloud-based builds with full native code support

**Sources**:
- [Expo Docs - Config Plugins](https://docs.expo.dev/config-plugins/plugins/)
- [Expo Docs - Add Custom Native Code](https://docs.expo.dev/workflow/customizing/)
- [Expo Docs - Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)

#### Native Module Integration Path for JIM
- **Push Notifications**: expo-notifications (built-in)
- **Geolocation**: expo-location (built-in)
- **Pro Sante Connect (OpenID Connect)**: Requires custom config plugin or expo-auth-session
- **Electronic Signature**: react-native-signature-canvas (Expo compatible)
- **Biometric Auth**: expo-local-authentication (built-in)
- **Secure Storage**: expo-secure-store (built-in)

### 4.5 Performance

- Expo apps in 2026 deliver **up to 30% better performance** compared to older versions
- Hermes engine support, prebuilt native modules, and intelligent bundling provide competitive performance
- For most business applications, Expo represents a mature approach

**Source**: [MarkAICode - React Native vs Expo 2026](https://markaicode.com/react-native-vs-expo-2026-cursor/)

### 4.6 2026 Recommendation

> "Start with Expo unless you have a confirmed blocker - you'll ship faster and can always add native code later."

Expo is recommended for most production apps. Only apps with very specific native SDK dependencies or extreme performance requirements benefit from bare React Native.

**Source**: [Hashrocket - Expo for React Native in 2025](https://hashrocket.com/blog/posts/expo-for-react-native-in-2025-a-perspective)

---

## 5. Doctolib's Tech Stack

### 5.1 Confirmed Stack (2025-2026)

| Layer | Technology |
|-------|-----------|
| **Mobile Apps** | React Native |
| **Web Frontend** | React |
| **Backend** | Ruby on Rails |
| **Backend Languages** | TypeScript, Java, Python, Kotlin |
| **Architecture** | Distributed architecture with reusable components |

**Sources**:
- [StackShare - Doctolib Tech Stack](https://stackshare.io/doctolib/doctolib)
- [TechLens - Doctolib Technologies 2025](https://www.techlens.app/companies/doctolib-27289)

### 5.2 Why Doctolib Chose React Native (Historical Context)

Published October 2018 by Mickael Morier (Doctolib Engineering):

1. **Previous stack**: Cordova-based WebView app, which worked "like a black box" with complicated Android Studio/Xcode project management
2. **Team composition**: Only 2 developers with native mobile experience; front-end team extensively used React
3. **Code sharing**: Same principles and language (React/JS) between web and mobile; patient mobile web app was almost entirely React
4. **Practical example**: Screens like offline patient appointment displays could share UI and behavior code between web and native with minor UI changes
5. **Developer experience**: Hot reloading on native components described as "incredible and very effective"
6. **Push notifications**: Cordova did not provide the access to modify native classes needed for push notification features

**Source**: [Medium/Doctolib - Why We Chose React Native](https://medium.com/doctolib/why-we-chose-react-native-for-our-mobile-apps-f255687151fc)

### 5.3 Current Hiring Signals (2025-2026)

Doctolib is **actively recruiting Staff Mobile Engineers (React Native)** in Paris, confirming continued investment:
- Requires 5+ years building high-usage mobile apps, ideally B2C
- Requires "deep expertise in React Native and mobile development best practices"
- Focus on "establishing technical standards and improving code quality at scale"
- Position indicates a **mature, scaling mobile team**, not a pivot away from React Native

**Sources**:
- [WelcomeToTheJungle - Doctolib Staff Mobile Engineer](https://www.welcometothejungle.com/en/companies/doctolib/jobs/staff-mobile-engineer-x-f-m_paris)
- [Glassdoor - Doctolib Staff Mobile Engineer](https://www.glassdoor.fr/job-listing/staff-mobile-engineer-react-native-xfm-doctolib-JV_IC2881970_KO0,38_KE39,47.htm?jl=1009928646397)

### 5.4 Doctolib and New Architecture

No specific public information was found about Doctolib's adoption of React Native's New Architecture (Fabric/TurboModules). However, given that:
- New Architecture is **default since RN 0.76** (Dec 2024)
- Doctolib is hiring for "technical standards" improvement
- The legacy bridge is no longer supported

It is reasonable to conclude they are migrating or have migrated to the New Architecture.

---

## 6. Pro Sante Connect (PSC/e-CPS) Integration

### 6.1 Protocol and Technical Details

Pro Sante Connect uses **OpenID Connect 1.0 (OIDC)** over OAuth 2.0.

#### Sandbox (BAS) Endpoints
| Endpoint | URL |
|----------|-----|
| Discovery | `https://auth.bas.psc.esante.gouv.fr/auth/realms/esante-wallet/.well-known/wallet-openid-configuration` |
| Authorization | `https://wallet.bas.psc.esante.gouv.fr/auth` |
| Token | `https://auth.bas.psc.esante.gouv.fr/auth/realms/esante-wallet/protocol/openid-connect/token` |
| UserInfo | `https://auth.bas.psc.esante.gouv.fr/auth/realms/esante-wallet/protocol/openid-connect/userinfo` |
| Logout | `https://auth.bas.psc.esante.gouv.fr/auth/realms/esante-wallet/protocol/openid-connect/logout` |

#### Production Endpoints
| Endpoint | URL |
|----------|-----|
| Token | `https://auth.esw.esante.gouv.fr/auth/realms/esante-wallet/protocol/openid-connect/token` |
| UserInfo | `https://auth.esw.esante.gouv.fr/auth/realms/esante-wallet/protocol/openid-connect/userinfo` |

### 6.2 Authentication Flow

- **Authorization Code Flow**: `response_type=code`, `client_id`, `redirect_uri`, `scope`, `acr_values=eidas1`
- **Client Authentication**: Client Secret Post or mTLS (X.509 certificate, available since Feb 2025 in production)
- **Token Expiration**: Access token = 2 minutes, Refresh token = 30 minutes, Session max = 4 hours
- **Subject Identifier**: UUID format (post-March 2026), PSI functional identifier introduced early 2026

### 6.3 Available Scopes

| Scope | Data |
|-------|------|
| `openid` | Basic identification |
| `profile` | Name, civil status, RPPS number |
| `interop` | Organization data, medical regulation |
| `referentiel` | Professional registry data |
| `othersIds` | Multiple identity mapping (ADELI-RPPS linkage) |
| `scope_all` | Complete UserInfo dataset |

### 6.4 Authentication Methods Supported
- **MOBILE**: e-CPS smartphone app
- **CARD**: Physical CPS card
- **IDENTITY_BROKER**: Third-party delegation
- **WEBAUTHN/FIDO2**: Security keys

### 6.5 Security Constraints
- CORS not permitted between browsers and PSC
- iframe integration prohibited
- RSA 2048 with SHA-256 asymmetric encryption
- TLS 1.2 minimum required

### 6.6 Integration with React Native/Expo

PSC being a standard OIDC provider, integration in React Native is possible via:
- **expo-auth-session**: Built-in Expo module for OAuth2/OIDC flows
- **react-native-app-auth**: Wraps AppAuth-iOS and AppAuth-Android (standard OIDC clients)
- **Custom implementation**: Direct HTTP calls with PKCE flow

A **PHP OAuth2 client for Pro Sante Connect** exists ([GitHub - pmsipilot/oauth2-prosanteconnect](https://github.com/pmsipilot/oauth2-prosanteconnect)), indicating backend integration is well-documented.

**Test Resources**:
- Postman collection available for BAS and production endpoints
- PSC Tools portal: `https://psc-tools.esante.gouv.fr/`
- EDIT environment for test identities

**Sources**:
- [ANS - Pro Sante Connect Documentation Technique](https://esante.gouv.fr/produits-et-services/pro-sante-connect/documentation-technique)
- [ANS - Pro Sante Connect](https://esante.gouv.fr/produits-services/pro-sante-connect)
- [ANS Portail Industriels](https://industriels.esante.gouv.fr/produits-et-services/pro-sante-connect)
- [GitHub - oauth2-prosanteconnect](https://github.com/pmsipilot/oauth2-prosanteconnect)
- [GitHub - Microsoft prosanteconnect tutorials](https://github.com/microsoft/prosanteconnect)

---

## 7. Electronic Signature Libraries

### 7.1 React Native Options

| Library | Type | Expo Compatible | Notes |
|---------|------|----------------|-------|
| **react-native-signature-canvas** | WebView-based signature pad | Yes (iOS, Android, Expo) | Draw/export as image |
| **react-native-signature-capture** | Native signature capture | Needs config plugin | Returns base64 PNG |
| **PSPDFKit React Native SDK** | Enterprise PDF signing | Requires native modules | Draw, type, or attach image; full PDF workflow |
| **HelloSign/Dropbox Sign API** | API-based e-signature | Yes (via WebView/API) | Enterprise-grade, legally binding |

**Sources**:
- [eSignGlobal - React Native E-Signature Library](https://www.esignglobal.com/blog/react-native-library-electronic-signature)
- [npm - react-native-signature-canvas](https://www.npmjs.com/package/react-native-signature-canvas)
- [PSPDFKit - React Native Electronic Signatures](https://pspdfkit.com/pdf-sdk/react-native/electronic-signatures/)

### 7.2 Recommendation for JIM

For a healthcare app requiring legally binding electronic signatures in France:
- **Signature capture UI**: `react-native-signature-canvas` (Expo-compatible, lightweight)
- **Document signing workflow**: PSPDFKit or similar enterprise SDK if PDF signing is needed
- **Legal validity**: May need to integrate with a qualified electronic signature provider (eIDAS-compliant) depending on the legal requirements of the signed documents

---

## 8. French Health Data Compliance (HDS)

### 8.1 HDS Certification Requirement

**Hebergement de Donnees de Sante (HDS)** certification is **mandatory** for hosting personal health data in France. Unlike HIPAA (US), France requires a **specific accreditation for hosting providers**.

### 8.2 HDS-Certified Cloud Providers

| Provider | HDS Status | Notes |
|----------|-----------|-------|
| **OVHcloud** | HDS-certified (since 2019) | French sovereign cloud |
| **Microsoft Azure** | HDS-certified | Azure, Dynamics 365, Microsoft 365 |
| **Google Cloud** | HDS-certified | GCP listed as certified host |
| **AWS** | HDS-certified | Healthcare compliance program |
| **Exoscale** | HDS-certified | European cloud |

### 8.3 Impact on Mobile Framework Choice

HDS certification applies to the **backend infrastructure**, not the mobile framework itself. Both React Native and Flutter apps can be HDS-compliant as long as:
- Backend is hosted on HDS-certified infrastructure
- Data encryption in transit (TLS 1.2+) and at rest
- Proper authentication (Pro Sante Connect integration)
- Audit logging and access controls
- GDPR compliance for data handling

**Sources**:
- [Microsoft Learn - HDS France](https://learn.microsoft.com/en-us/compliance/regulatory/offering-hds-france)
- [ANS - Liste hebergeurs certifies HDS](https://esante.gouv.fr/offres-services/hds/liste-des-herbergeurs-certifies)
- [OVHcloud - HDS Certification](https://www.ovhcloud.com/en/compliance/hds/)
- [Google Cloud - HDS Compliance](https://cloud.google.com/security/compliance/hds)

---

## 9. Synthesis and Recommendation for JIM

### 9.1 Decision Matrix for JIM

| Requirement | React Native + Expo | Flutter | Winner |
|-------------|-------------------|---------|--------|
| **Pro Sante Connect (OIDC)** | expo-auth-session / react-native-app-auth; proven patterns | Dart OIDC libs exist but untested with PSC | **React Native** |
| **Push Notifications** | expo-notifications (built-in) | firebase_messaging + flutter_local_notifications | Tie |
| **Geolocation** | expo-location (built-in) | geolocator package | Tie |
| **Electronic Signature** | react-native-signature-canvas (Expo-compatible) | signature_pad packages exist | Tie |
| **French Healthcare Precedent** | Doctolib, Hublo (1M+ users), multiple US health apps | No French healthcare app found | **React Native** |
| **Developer Availability (France)** | JS/TS devs 3-5x more available | Smaller Dart developer pool | **React Native** |
| **Raw Performance** | Good with New Architecture (60 FPS) | Superior benchmarks (fewer dropped frames, less memory) | **Flutter** |
| **Startup Time** | 1.2-2.0s (mid-range) | 1.0-1.5s (mid-range) | **Flutter** |
| **MVP Speed (with Expo)** | 12-16 weeks with Expo tooling | 12-16 weeks | Tie |
| **Code Sharing (Web + Mobile)** | React web + React Native share logic/patterns | Separate from web stack | **React Native** |
| **Compliance Ecosystem** | More established for clinical healthcare | Growing but less proven | **React Native** |
| **Ecosystem Maturity** | Larger library count, more enterprise examples | Growing rapidly but younger | **React Native** |

### 9.2 Key Findings Summary

1. **React Native is the safer choice for JIM** given the French healthcare ecosystem context:
   - Doctolib (the reference French health app) uses React Native
   - Hublo (French healthcare staffing, 1M+ users) rewrote with Expo/React Native
   - Pro Sante Connect integration is standard OIDC, well-supported in JS ecosystem
   - JS/TS developer availability in France is significantly higher

2. **Expo is production-ready for healthcare apps** in 2026:
   - Multiple healthcare apps (MyBSWHealth, Solv, Carbon Health, Cerebral, Hinge Health) use Expo in production
   - Hublo's French healthcare app (1M+ users) successfully rewrote with Expo
   - Custom native modules fully supported via config plugins and Expo Modules API
   - EAS Build handles cloud-based CI/CD

3. **React Native New Architecture eliminates the historical performance gap**:
   - 50-70% faster cold starts with TurboModules
   - Solid 60 FPS with Fabric renderer
   - 20-30% memory reduction
   - Default in all new projects since RN 0.76

4. **Flutter has raw performance advantages** but they are **not decisive for JIM's use case**:
   - JIM is a networking/scheduling app, not a real-time graphics or animation-heavy app
   - The performance difference (55-60 FPS vs 60 FPS) is imperceptible for business apps
   - Flutter's advantages shine in complex animations and real-time tracking, which are not JIM's core features

5. **Pro Sante Connect integration is straightforward** with standard OIDC libraries:
   - Well-documented OpenID Connect endpoints (sandbox + production)
   - Postman collections available for testing
   - Token structure includes RPPS number, professional identity, organization data
   - 2-minute access token / 30-minute refresh token lifecycle

### 9.3 Recommended Stack for JIM

```
Mobile Framework:  React Native with Expo (managed workflow + config plugins)
Build System:      EAS Build (cloud-based)
JS Engine:         Hermes (default)
Architecture:      React Native New Architecture (Fabric + TurboModules, default)
Navigation:        React Navigation or Expo Router
State Management:  Zustand or TanStack Query (for server state)
Auth (PSC):        expo-auth-session or react-native-app-auth
Push:              expo-notifications
Geolocation:       expo-location
E-Signature:       react-native-signature-canvas
Secure Storage:    expo-secure-store
Biometrics:        expo-local-authentication
```

---

## Sources Index

### Flutter vs React Native
- [TechAhead - Flutter vs React Native 2026](https://www.techaheadcorp.com/blog/flutter-vs-react-native-in-2026-the-ultimate-showdown-for-app-development-dominance/)
- [DEV Community - Flutter vs React Native Healthcare](https://dev.to/ciphernutz/flutter-vs-react-native-which-is-better-for-healthcare-fitness-apps-178)
- [Foresight Mobile - Why Flutter Outperforms in 2026](https://foresightmobile.com/blog/why-flutter-outperforms-the-competition)
- [Luciq - Flutter vs React Native Guide 2026](https://www.luciq.ai/blog/flutter-vs-react-native-guide)
- [Agile Soft Labs - Cost & DX 2026](https://www.agilesoftlabs.com/blog/2026/02/flutter-vs-react-native-2026-cost-dx_17)
- [Simplilearn - Flutter vs React Native 2026](https://www.simplilearn.com/tutorials/reactjs-tutorial/flutter-vs-react-native)
- [SynergyBoat - Performance Benchmark 2025](https://www.synergyboat.com/blog/flutter-vs-react-native-vs-native-performance-benchmark-2025)
- [Medium - Real App Benchmark 2026](https://medium.com/@baheer224/react-native-vs-flutter-performance-real-app-benchmark-9191e7122e11)
- [ADevs - React Native vs Flutter 2026](https://adevs.com/blog/react-native-vs-flutter/)

### React Native New Architecture
- [React Native Official - New Architecture](https://reactnative.dev/architecture/landing-page)
- [React Native Blog - New Architecture is Here](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here)
- [EurosHub - React Native in 2026](https://www.euroshub.com/blogs/react-native-2026-whats-new-and-what-to-expect)
- [NuCamp - React Native in 2026](https://www.nucamp.co/blog/react-native-in-2026-build-ios-and-android-apps-with-javascript)
- [Medium - Deep Dive New Architecture](https://medium.com/@DhruvHarsora/deep-dive-into-react-natives-new-architecture-jsi-turbomodules-fabric-yoga-234bbdf853b4)
- [DEV Community - Performance Impact](https://dev.to/amazonappdev/how-does-react-natives-new-architecture-affect-performance-1dkf)
- [Callstack - Experiment with New Architecture](https://www.callstack.com/blog/experiment-with-new-architecture-of-react-native)
- [DEV Community - Migration Process 2026](https://dev.to/sherry_walker_bba406fb339/the-react-native-new-architecture-migration-process-for-2026-27l3)
- [Guilherme Albert - New Architecture Blog](https://guilhermealbert.com/blog/react-native-new-architecture/)

### Expo
- [Evan Bacon - Who's Using Expo 2026](https://evanbacon.dev/blog/expo-apps)
- [Meta Design Solutions - Expo 2026](https://metadesignsolutions.com/expo-2026-the-best-way-to-build-cross-platform-apps/)
- [MarkAICode - React Native vs Expo 2026](https://markaicode.com/react-native-vs-expo-2026-cursor/)
- [Hashrocket - Expo for React Native 2025](https://hashrocket.com/blog/posts/expo-for-react-native-in-2025-a-perspective)
- [Expo Docs - Config Plugins](https://docs.expo.dev/config-plugins/plugins/)
- [Expo Docs - Custom Native Code](https://docs.expo.dev/workflow/customizing/)
- [Expo Docs - Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Expo Docs - CNG](https://docs.expo.dev/workflow/continuous-native-generation/)
- [Medium - Hublo Healthcare Rewrite with Expo](https://medium.com/@joseph.bedminster/how-i-rewrote-a-6-years-old-app-used-by-1m-healthcare-professionals-with-expo-f6bdcb6c8ab3)

### Doctolib
- [StackShare - Doctolib Tech Stack](https://stackshare.io/doctolib/doctolib)
- [TechLens - Doctolib Technologies 2025](https://www.techlens.app/companies/doctolib-27289)
- [Medium/Doctolib - Why React Native](https://medium.com/doctolib/why-we-chose-react-native-for-our-mobile-apps-f255687151fc)
- [WelcomeToTheJungle - Staff Mobile Engineer](https://www.welcometothejungle.com/en/companies/doctolib/jobs/staff-mobile-engineer-x-f-m_paris)

### Pro Sante Connect
- [ANS - Pro Sante Connect](https://esante.gouv.fr/produits-services/pro-sante-connect)
- [ANS - Documentation Technique](https://esante.gouv.fr/produits-et-services/pro-sante-connect/documentation-technique)
- [ANS Portail Industriels - PSC](https://industriels.esante.gouv.fr/produits-et-services/pro-sante-connect)
- [GitHub - oauth2-prosanteconnect](https://github.com/pmsipilot/oauth2-prosanteconnect)
- [GitHub - Microsoft PSC Tutorials](https://github.com/microsoft/prosanteconnect)
- [icanopee - Integration PSC/e-CPS](https://www.icanopee.fr/integration-pro-sante-connect-e-cps/)
- [G_NIUS - Pro Sante Connect](https://gnius.esante.gouv.fr/en/regulations/regulation-profiles/pro-sante-connect)

### Electronic Signature
- [eSignGlobal - React Native E-Signature](https://www.esignglobal.com/blog/react-native-library-electronic-signature)
- [npm - react-native-signature-canvas](https://www.npmjs.com/package/react-native-signature-canvas)
- [PSPDFKit - React Native Electronic Signatures](https://pspdfkit.com/pdf-sdk/react-native/electronic-signatures/)

### HDS Compliance
- [Microsoft Learn - HDS France](https://learn.microsoft.com/en-us/compliance/regulatory/offering-hds-france)
- [ANS - Liste Hebergeurs HDS](https://esante.gouv.fr/offres-services/hds/liste-des-herbergeurs-certifies)
- [OVHcloud - HDS](https://www.ovhcloud.com/en/compliance/hds/)
- [Google Cloud - HDS](https://cloud.google.com/security/compliance/hds)

### General Benchmarks
- [Uno Platform - Best Cross Platform Frameworks 2026](https://platform.uno/articles/best-cross-platform-frameworks-2026/)
- [Bolder Apps - Top Frameworks 2026](https://www.bolderapps.com/blog-posts/top-cross-platform-app-development-frameworks-in-2026)
