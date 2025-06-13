🛍️ AI Shopping Assistant
=========================

A full‑stack, modular prototype AI shopping assistant that:

1.  Accepts buyer purchase history via a Spring Boot + MongoDB API
    
2.  Uses a Python LangChain agent (powered by Google Gemini) to recommend a product category
    
3.  Searches a local JSON catalog for the top 3 items in that category
    
4.  Simulates a purchase and logs it
    
5.  Updates both interaction logs and per‑user memory for future recommendations
    
6.  Provides a React+TypeScript UI to drive the flow end‑to‑end
    

🔍 Table of Contents
--------------------

1.  Features
    
2.  Architecture
    
3.  Getting Started
    
    *   Prerequisites
        
    *   Environment
        
    *   Running the API
        
    *   Running the Agent
        
    *   Running the UI
        
4.  API Reference
    
    *   Spring Boot Endpoints
        
    *   FastAPI Agent Endpoints
        
5.  File Structure
    
6.  Configuration & Secrets
    
7.  Development Notes
    
8.  Next Steps & Future Ideas
    
9.  Contact
    

✨ Features
----------

*   **Buyer History API** (Spring Boot + MongoDB)
    
    *   POST /api/buyers/history — upserts user purchase history
        
    *   GET /api/buyers/{userId}/history — fetch existing history
        
    *   PATCH & DELETE operations for incremental updates
        
*   **LLM‑Powered Recommendation** (Python + LangChain + Gemini)
    
    *   Logs every prompt & response for observability
        
    *   Feeds recent interactions back into the prompt for a feedback loop
        
    *   Falls back gracefully on JSON parse failures
        
*   **Product Search**
    
    *   Uses a local JSON catalog of 11 items
        
    *   Returns top‑3 matches based on price affinity
        
*   **Purchase Simulation**
    
    *   Appends to a JSONL logs/purchase\_log.json
        
    *   Updates per‑user memory JSON in memory/{userId}\_history.json
        
*   **React UI** (Vite + TypeScript + shadcn/ui)
    
    *   Wizard‑style flow: input → recommendation → search → purchase → complete
        
    *   Real API integration (no more mocks)
        
    *   CORS, loading states, error handling
        

🏗️ Architecture
----------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ┌──────────────────────┐      ┌───────────────────────┐  │  React Front‑End     │ ◄──► │  Spring Boot API      │  │  (Vite + TS)         │      │  (Buyer History)      │  └──────────────────────┘      └───────────────────────┘           ▲   │                             │           │   │     ┌───────────────────┐   │           │   └───► │  Python Agent     │ ◄─┘           │         │ (LangChain + LLM) │           └─────────┴───────────────────┘   `

1.  **UI** calls **Spring Boot** to read/write history.
    
2.  UI then calls **Python Agent** to get { category, reason, products }.
    
3.  UI displays recommendations & products, then lets user “purchase.”
    
4.  On purchase, UI calls Agent again to POST /log-purchase & POST /update-memory.
    

🚀 Getting Started
------------------

### Prerequisites

*   Java 17, Maven/Gradle
    
*   MongoDB
    
*   Python 3.12
    
*   Node.js 18+ (for React UI)
    

### 1\. Environment Variables

Create a top‑level .env:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Spring Boot will pick up application.properties for DB  e.g. SPRING_DATA_MONGODB_URI=mongodb://:/  # Python Agent credentials  e.g. GOOGLE_API_KEY=        GOOGLE_MODEL=        GOOGLE_PROVIDER=        API_URL=http://:/api/buyers  # React UI (in .env.local inside ShoppingAssistant/)  VITE_REACT_APP_SPRING_URL=http://:/api/buyers  VITE_REACT_APP_AGENT_URL=http://:/run-shopping-flow  ```dotenv  # Spring Boot will pick up application.properties for DB  SPRING_DATA_MONGODB_URI=mongodb://localhost:/  # Python Agent  GOOGLE_API_KEY=your_google_api_key  GOOGLE_MODEL=gemini-2.0-flash  GOOGLE_PROVIDER=google_genai  API_URL=http://localhost:/api/buyers  # React UI (in .env.local inside ShoppingAssistant/)  VITE_REACT_APP_SPRING_URL=http://localhost:/api/buyers  VITE_REACT_APP_AGENT_URL=http://localhost:/run-shopping-flow   `

### 2\. Run the Spring Boot API

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd shopping-history-api/  ./gradlew bootRun  # API available at http://localhost:/api/buyers   `

### 3\. Run the Python Agent

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd Shopping-Agent/  pip install -r requirements.txt  uvicorn agent_service:app --reload --port   # Agent at http://localhost:   `

### 4\. Run the React UI

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd ShoppingAssistant/  npm install  npm run dev  # UI at http://localhost:   `

📡 API Reference
----------------

### Spring Boot: Buyer History

MethodEndpointBody / ParamsDescriptionPOST/api/buyers/history{ user\_id, history\[\] }Create or append historyGET/api/buyers/{userId}/history—Fetch history by userPATCH/api/buyers/{userId}/historyListAppend multiple itemsDELETE/api/buyers/{userId}/history—Clear entire user history

### FastAPI: Agent

MethodEndpointBodyReturnsPOST/run-shopping-flow{"user\_id":"A123","history":\[...\]}{ category, reason, products\[\] }POST/log-purchase{"user\_id","product":{...}}{ status, message }POST/update-memory{"user\_id","product":{...}}— (204 No Content)

📂 File Structure
-----------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   .  ├── shopping-history-api/          # Spring Boot project  ├── Shopping-Agent/                # Python LangChain agent  │   ├── chains/                    # Recommend, search, purchase, tools  │   ├── memory/                    # JSON memory manager  │   ├── logs/                      # JSONL interaction & purchase logs  │   ├── main.py & agent_service.py # Entrypoints  │   └── requirements.txt  └── ShoppingAssistant/             # React front‑end (Vite + TS)      ├── src/      │   ├── api/                   # buyerHistoryService.ts, agent.ts      │   ├── Components/            # UI widgets      │   └── Pages/page.tsx         # Flow orchestration      └── package.json   `

🔐 Configuration & Secrets
--------------------------

*   **Spring Boot**: keeps DB URI in application.properties.
    
*   **Python Agent**: uses python-dotenv to load .env.
    
*   **React UI**: Vite exposes only VITE\_\* envs to the browser.
    

> **Security note**: This prototype uses anonymous access throughout. For production, lock down your APIs with OAuth/JWT and never expose sensitive keys in the client.

📖 Development Notes
--------------------

*   All LLM prompts & raw responses are logged for observability.
    
*   load\_recent\_interactions() now safely handles missing/corrupt JSONL.
    
*   Vector store integration is sketched but deferred—file logs remain in JSON/JSONL.
    
*   React form auto‑loads existing history via useEffect when you change the user ID.
    

🚀 Next Steps & Future Ideas
----------------------------

*   🔗 **Vector DB Memory**: swap JSON logs for Chroma/Pinecone for semantic retrieval.
    
*   🛠️ **True LangChain Agent**: migrate from initialize\_agent → LangGraph + Tools.
    
*   **Auth & Config**: secure Spring Boot with JWT, secrets in Vault.
    
*   **UI Polishing**: real catalog images, ratings, search filters.
    
*   **Deployment**: Dockerize each component + Docker Compose.