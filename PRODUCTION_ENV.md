# Production Environment Variables

# Add these to your .env.local for production setup

# === Analytics & Monitoring ===
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"                    # Google Analytics ID
NEXT_PUBLIC_SENTRY_DSN="https://your-sentry-dsn"    # Sentry error tracking
NEXT_PUBLIC_HOTJAR_ID="1234567"                    # Hotjar user behavior analytics
NEXT_PUBLIC_FULLSTORY_ORG="your-org"               # FullStory session replay

# === CDN Configuration ===
NEXT_PUBLIC_CDN_URL="https://cdn.z-ai-pharmacy.com"  # CDN base URL
ASSET_PREFIX="https://cdn.z-ai-pharmacy.com"           # Asset prefix for Next.js

# === Error Reporting ===
ERROR_WEBHOOK_URL="https://your-webhook-url/errors"   # Error webhook endpoint
ERROR_SLACK_WEBHOOK="https://hooks.slack.com/..."     # Slack error notifications

# === Performance Monitoring ===
PERFORMANCE_WEBHOOK_URL="https://your-webhook-url/perf" # Performance metrics webhook

# === Security Headers ===
ALLOWED_ORIGINS="https://z-ai-pharmacy.com,https://www.z-ai-pharmacy.com"
CSP_NONCE="your-csp-nonce"

# === API Configuration ===
API_BASE_URL="https://api.z-ai-pharmacy.com"
WEBSOCKET_URL="wss://api.z-ai-pharmacy.com/ws"

# === Database (Production) ===
DATABASE_URL="postgresql://user:pass@host:5432/zai_pharmacy_prod"
DIRECT_URL="postgresql://user:pass@host:5432/zai_pharmacy_prod"

# === Authentication (Production) ===
NEXTAUTH_URL="https://z-ai-pharmacy.com"
NEXTAUTH_SECRET="your-production-secret-32-chars-minimum"
NEXT_PUBLIC_APP_URL="https://z-ai-pharmacy.com"
IP_HASH_SALT="your-production-salt-16-chars"

# === Email Service (Production) ===
EMAIL_FROM="noreply@z-ai-pharmacy.com"
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"

# === File Storage (Production) ===
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="me-central-1"
AWS_S3_BUCKET="z-ai-pharmacy-assets"

# === Redis Cache (Production) ===
REDIS_URL="redis://user:pass@host:6379"

# === Ollama AI (Production) ===
OLLAMA_HOST="https://ai.z-ai-pharmacy.com"
OLLAMA_MODEL="cniongolo/biomistral:latest"
OLLAMA_TIMEOUT="120000"

# === Payment Processing ===
STRIPE_PUBLIC_KEY="pk_live_your-stripe-public-key"
STRIPE_SECRET_KEY="sk_live_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# === External APIs ===
MOH_API_KEY="your-uae-moh-api-key"
DRUG_BANK_API_KEY="your-drugbank-api-key"
FDA_API_KEY="your-fda-api-key"

# === Rate Limiting ===
RATE_LIMIT_REQUESTS="100"
RATE_LIMIT_WINDOW="900000"  # 15 minutes in ms

# === Feature Flags ===
ENABLE_ANALYTICS="true"
ENABLE_ERROR_REPORTING="true"
ENABLE_PERFORMANCE_MONITORING="true"
ENABLE_SESSION_RECORDING="false"
ENABLE_A/B_TESTING="false"
