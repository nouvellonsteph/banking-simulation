# Project Architecture

Below is a visual representation of the architecture of the Banking API Demo project using mermaid diagrams designed for portrait mode.

## High-Level Architecture

```mermaid
graph TB
    Client(Client Browser)
    Frontend[Next.js Frontend]
    
    Client --- Frontend
    
    Frontend --> Pages
    Frontend --> NextAPI
    
    subgraph "Pages"
        direction TB
        HomePage["/"]
        LoginPage["/login"]
        ContactPage["/contact"]
        APIDemo["/api-demo"]
        APIDocsPage["/api-docs"]
    end
    
    subgraph "Next.js API Routes"
        direction TB
        Login["/api/login"]
        Accounts["/api/accounts"]
        Transactions["/api/transactions"]
        UserProfile["/api/user-profile"]
        PaymentMethods["/api/payment-methods"]
        Contact["/api/contact"]
        Swagger["/api/swagger"]
        OpenAPI["/api/openapi"]
        APIDoc["/api/api-docs"]
    end
    
    Worker[Worker.ts]
    Worker --> APITesting
    
    subgraph "API Testing"
        direction TB
        APITesting[Test API with Entropy]
        TestProfile[Test User Profile]
    end
    
    LoginPage --> Login
    ContactPage --> Contact
    
    Turnstile[Cloudflare Turnstile]
    
    Login --> Turnstile
    Contact --> Turnstile
    
    classDef page fill:#f9f,stroke:#333,stroke-width:1px;
    classDef api fill:#bbf,stroke:#333,stroke-width:1px;
    classDef service fill:#bfb,stroke:#333,stroke-width:1px;
    classDef worker fill:#fbb,stroke:#333,stroke-width:1px;
    
    class HomePage,LoginPage,ContactPage,APIDemo,APIDocsPage page;
    class Login,Accounts,Transactions,UserProfile,PaymentMethods,Contact,Swagger,OpenAPI,APIDoc api;
    class Turnstile service;
    class Worker,APITesting,TestProfile worker;
```

## Component Structure

```mermaid
graph TB
    App[App Layout]
    
    subgraph "Frontend Components"
        direction TB
        LoginComponent[Login Component]
        ContactComponent[Contact Component]
        APIDemo[API Demo Component]
        HomePage[Home Page Component]
        APIDocsPage[API Docs Component]
    end
    
    App --> LoginComponent
    App --> ContactComponent
    App --> APIDemo
    App --> HomePage
    App --> APIDocsPage
    
    subgraph "Configuration"
        direction TB
        WranglerConfig[Wrangler Config]
        EnvironmentVars[Environment Variables]
        CloudflareEnv[CloudflareEnv Interface]
    end
    
    WranglerConfig --> EnvironmentVars
    EnvironmentVars --> CloudflareEnv
    
    subgraph "API Handlers"
        direction TB
        LoginHandler[Login Handler]
        ContactHandler[Contact Handler]
        AccountsHandler[Accounts Handler]
        TransactionsHandler[Transactions Handler]
        UserProfileHandler[User Profile Handler]
        PaymentMethodsHandler[Payment Methods Handler]
        SwaggerHandler[Swagger Handler]
        OpenAPIHandler[OpenAPI Handler]
        APIDocsHandler[API Docs Handler]
    end
    
    ContactComponent --> Turnstile
    LoginComponent --> Turnstile
    
    ContactComponent --> ContactHandler
    LoginComponent --> LoginHandler
    
    Turnstile[Cloudflare Turnstile]
    
    APIDemo --> API[API Endpoints]
    API --> LoginHandler
    API --> ContactHandler
    API --> AccountsHandler
    API --> TransactionsHandler
    API --> UserProfileHandler
    API --> PaymentMethodsHandler
    
    subgraph "Worker"
        direction TB
        WorkerHandler[Worker Handler]
        ScheduledTasks[Scheduled Tasks]
    end
    
    WranglerConfig --> WorkerHandler
    WorkerHandler --> ScheduledTasks
    ScheduledTasks --> APITest[API Testing]
    
    classDef component fill:#f9f,stroke:#333,stroke-width:1px;
    classDef config fill:#fea,stroke:#333,stroke-width:1px;
    classDef handler fill:#bbf,stroke:#333,stroke-width:1px;
    classDef worker fill:#fbb,stroke:#333,stroke-width:1px;
    classDef service fill:#bfb,stroke:#333,stroke-width:1px;
    
    class App,LoginComponent,ContactComponent,APIDemo,HomePage,APIDocsPage component;
    class WranglerConfig,EnvironmentVars,CloudflareEnv config;
    class LoginHandler,AccountsHandler,TransactionsHandler,UserProfileHandler,PaymentMethodsHandler,ContactHandler,SwaggerHandler,OpenAPIHandler,APIDocsHandler handler;
    class WorkerHandler,ScheduledTasks,APITest worker;
    class Turnstile service;
```

## Data Flow

```mermaid
sequenceDiagram
    participant Client as Client
    participant Frontend as Frontend
    participant API as API Routes
    participant Turnstile as Turnstile
    
    Note over Client,Turnstile: Login Flow
    Client->>Frontend: Submit Login
    Frontend->>Turnstile: Verify Challenge
    Turnstile-->>Frontend: Token
    Frontend->>API: POST /api/login
    API->>Turnstile: Verify Token
    Turnstile-->>API: Result
    API-->>Frontend: Auth Response
    Frontend-->>Client: Redirect Home
    
    Note over Client,Turnstile: Contact Form Flow
    Client->>Frontend: Submit Form
    Frontend->>Turnstile: Verify Challenge
    Turnstile-->>Frontend: Token
    Frontend->>API: POST /api/contact
    API->>Turnstile: Verify Token
    Turnstile-->>API: Result
    API-->>Frontend: Result
    Frontend-->>Client: Show Success
    
    Note over Client,API: API Demo Flow
    Client->>Frontend: Use API Demo
    Frontend->>API: API Requests
    API-->>Frontend: API Responses
    Frontend-->>Client: Show Results
    
    Note over API: Worker Tasks
    Worker->>Worker: Cron Trigger
    Worker->>API: Test Endpoints
    API-->>Worker: Responses
    Worker->>Worker: Log Results
```

## Environment Configuration

```mermaid
graph TB
    WranglerConfig[Wrangler.jsonc]
    EnvVars[Environment Variables]
    
    WranglerConfig --> EnvVars
    CloudflareEnvTS[cloudflare-env.d.ts] --> EnvVars
    
    subgraph "Environment Variables"
        direction TB
        APIURL[API_BASE_URL]
        CompanyName[COMPANY_NAME]
        PrimaryColor[COLOR_PRIMARY]
        TurnstileSiteKey[TURNSTILE_SITE_KEY]
        TurnstileSecretKey[TURNSTILE_SECRET_KEY]
    end
    
    EnvVars --> APIURL
    EnvVars --> CompanyName
    EnvVars --> PrimaryColor
    EnvVars --> TurnstileSiteKey
    EnvVars --> TurnstileSecretKey
    
    subgraph "Components Using Variables"
        direction TB
        WorkerTS[worker.ts]
        ContactPage[contact/page.tsx]
        LoginPage[login/page.tsx]
        ContactAPI[api/contact/route.ts]
        LoginAPI[api/login/route.ts]
    end
    
    TurnstileSiteKey --> ContactPage
    TurnstileSiteKey --> LoginPage
    TurnstileSecretKey --> ContactAPI
    TurnstileSecretKey --> LoginAPI
    APIURL --> WorkerTS
    
    classDef config fill:#fea,stroke:#333,stroke-width:1px;
    classDef var fill:#bbf,stroke:#333,stroke-width:1px;
    classDef component fill:#f9f,stroke:#333,stroke-width:1px;
    classDef api fill:#bfb,stroke:#333,stroke-width:1px;
    
    class WranglerConfig,CloudflareEnvTS config;
    class APIURL,CompanyName,PrimaryColor,TurnstileSiteKey,TurnstileSecretKey var;
    class ContactPage,LoginPage component;
    class ContactAPI,LoginAPI,WorkerTS api;
```
