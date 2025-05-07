# Project Architecture

Below is a visual representation of the architecture of the Banking API Demo project using mermaid diagrams.

## High-Level Architecture

```mermaid
graph TD
    Client(Client Browser) --- Frontend
    
    subgraph "Cloudflare Workers"
        Frontend[Next.js Frontend]
        Worker[Worker.ts]
        
        subgraph "Next.js API Routes"
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
    end
    
    Frontend -->|Renders| Pages
    Frontend -->|Fetches| NextAPI
    
    Worker -->|Scheduled Tasks| APITesting
    
    subgraph "Pages"
        HomePage["/"]
        LoginPage["/login"]
        ContactPage["/contact"]
        APIDemo["/api-demo"]
        APIDocsPage["/api-docs"]
    end
    
    subgraph "API Testing"
        APITesting[Test API with Entropy]
        TestProfile[Test User Profile]
    end
    
    LoginPage -->|Authentication| Login
    ContactPage -->|Form Submission| Contact
    
    subgraph "External Services"
        Turnstile[Cloudflare Turnstile]
    end
    
    Login -->|Validates| Turnstile
    Contact -->|Validates| Turnstile
    
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
graph TD
    subgraph "Frontend Components"
        App[App Layout]
        LoginComponent[Login Component]
        ContactComponent[Contact Component]
        APIDemo[API Demo Component]
        HomePage[Home Page Component]
        APIDocsPage[API Docs Component]
    end
    
    subgraph "Configuration"
        WranglerConfig[Wrangler Config]
        EnvironmentVars[Environment Variables]
        CloudflareEnv[CloudflareEnv Interface]
    end
    
    subgraph "API Handlers"
        LoginHandler[Login Handler]
        AccountsHandler[Accounts Handler]
        TransactionsHandler[Transactions Handler]
        UserProfileHandler[User Profile Handler]
        PaymentMethodsHandler[Payment Methods Handler]
        ContactHandler[Contact Handler]
        SwaggerHandler[Swagger Handler]
        OpenAPIHandler[OpenAPI Handler]
        APIDocsHandler[API Docs Handler]
    end
    
    WranglerConfig -->|Defines| EnvironmentVars
    EnvironmentVars -->|Types Defined in| CloudflareEnv
    
    ContactComponent -->|Uses| Turnstile
    LoginComponent -->|Uses| Turnstile
    
    ContactComponent -->|Submits to| ContactHandler
    LoginComponent -->|Authenticates via| LoginHandler
    
    Turnstile[Cloudflare Turnstile]
    
    APIDemo -->|Interacts with| API
    
    subgraph "Worker"
        WorkerHandler[Worker Handler]
        ScheduledTasks[Scheduled Tasks]
        APITest[API Testing]
    end
    
    WranglerConfig -->|Configures| WorkerHandler
    WorkerHandler -->|Executes| ScheduledTasks
    ScheduledTasks -->|Runs| APITest
    
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
    participant Client as Client Browser
    participant Frontend as Next.js Frontend
    participant APIRoutes as Next.js API Routes
    participant Worker as Cloudflare Worker
    participant Turnstile as Cloudflare Turnstile
    
    Client->>Frontend: Visit Pages
    
    alt Login Flow
        Client->>Frontend: Submit Login Form
        Frontend->>Turnstile: Verify Challenge (when turnstile=true)
        Turnstile-->>Frontend: Verification Token
        Frontend->>APIRoutes: POST /api/login with credentials + token
        APIRoutes->>Turnstile: Verify Token Server-side
        Turnstile-->>APIRoutes: Verification Result
        APIRoutes-->>Frontend: Authentication Response
        Frontend-->>Client: Redirect to Home
    end
    
    alt Contact Form Flow
        Client->>Frontend: Submit Contact Form
        Frontend->>Turnstile: Verify Challenge (when turnstile=true)
        Turnstile-->>Frontend: Verification Token
        Frontend->>APIRoutes: POST /api/contact with form data + token
        APIRoutes->>Turnstile: Verify Token Server-side
        Turnstile-->>APIRoutes: Verification Result
        APIRoutes-->>Frontend: Submission Result
        Frontend-->>Client: Display Success Message
    end
    
    alt API Demo Flow
        Client->>Frontend: Interact with API Demo
        Frontend->>APIRoutes: API Requests
        APIRoutes-->>Frontend: API Responses
        Frontend-->>Client: Display Results
    end
    
    alt Scheduled Worker Tasks
        Worker->>Worker: Cron Trigger
        Worker->>APIRoutes: Test API Endpoints
        APIRoutes-->>Worker: API Responses
        Worker->>Worker: Log Test Results
    end
```

## Environment Configuration

```mermaid
graph TD
    WranglerConfig[Wrangler.jsonc] -->|Defines| EnvVars[Environment Variables]
    
    EnvVars -->|Referenced by| WorkerTS[worker.ts]
    EnvVars -->|Referenced by| ContactPage[contact/page.tsx]
    EnvVars -->|Referenced by| LoginPage[login/page.tsx]
    EnvVars -->|Referenced by| ContactAPI[api/contact/route.ts]
    EnvVars -->|Referenced by| LoginAPI[api/login/route.ts]
    
    subgraph "Environment Variables"
        APIURL[API_BASE_URL]
        CompanyName[COMPANY_NAME]
        PrimaryColor[COLOR_PRIMARY]
        TurnstileSiteKey[TURNSTILE_SITE_KEY]
        TurnstileSecretKey[TURNSTILE_SECRET_KEY]
    end
    
    TurnstileSiteKey -->|Used in| ContactPage
    TurnstileSiteKey -->|Used in| LoginPage
    TurnstileSecretKey -->|Used in| ContactAPI
    TurnstileSecretKey -->|Used in| LoginAPI
    APIURL -->|Used in| WorkerTS
    
    CloudflareEnvTS[cloudflare-env.d.ts] -->|Defines types for| EnvVars
    
    classDef config fill:#fea,stroke:#333,stroke-width:1px;
    classDef var fill:#bbf,stroke:#333,stroke-width:1px;
    classDef component fill:#f9f,stroke:#333,stroke-width:1px;
    classDef api fill:#bfb,stroke:#333,stroke-width:1px;
    
    class WranglerConfig,CloudflareEnvTS config;
    class APIURL,CompanyName,PrimaryColor,TurnstileSiteKey,TurnstileSecretKey var;
    class ContactPage,LoginPage component;
    class ContactAPI,LoginAPI,WorkerTS api;
