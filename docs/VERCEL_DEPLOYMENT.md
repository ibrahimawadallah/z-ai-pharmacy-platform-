# 🚀 نشر منصة الصيدلة الذكية على Vercel

## 📋 المتطلبات الأساسية

### 1. حساب Vercel
- سجل في https://vercel.com
- قم بتوصيل حساب GitHub

### 2. سيرفر Ollama (مطلوب للمعالجة المحلية)
- خادم سحابي (DigitalOcean, AWS, أو أي VPS)
- 4GB RAM على الأقل
- Ubuntu 20.04+ أو CentOS 7+

---

## 🛠️ إعداد سيرفر Ollama

### الخطوة 1: إعداد السيرفر
```bash
# على سيرفر Ubuntu
ssh root@your-server-ip

# تحديث النظام
apt update && apt upgrade -y

# تثبيت Docker (موصى به)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# تثبيت Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### الخطوة 2: إعداد Ollama
```bash
# سحب صورة Ollama
docker pull ollama/ollama

# تشغيل Ollama كخدمة
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# تحميل النموذج الطبي
docker exec -it ollama ollama pull cniongolo/biomistral:latest

# التحقق من النموذج
docker exec -it ollama ollama list
```

### الخطوة 3: إعداد الوصول الآمن
```bash
# تثبيت Nginx للوصول الآمن
apt install nginx -y

# إعداد ملف Nginx
cat > /etc/nginx/sites-available/ollama << EOF
server {
    listen 80;
    server_name your-ollama-domain.com;

    location / {
        proxy_pass http://localhost:11434;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# تفعيل الموقع
ln -s /etc/nginx/sites-available/ollama /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 🌐 نشر على Vercel

### الخطوة 1: إعداد المشروع
```bash
# تثبيت Vercel CLI
npm i -g vercel

# الدخول إلى حسابك
vercel login

# ربط المشروع
vercel link

# إعدادات الإنتاج
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add DATABASE_URL
vercel env add OLLAMA_HOST
vercel env add OLLAMA_MODEL
vercel env add OLLAMA_TIMEOUT
vercel env add OPENAI_API_KEY
```

### الخطوة 2: متغيرات البيئة
```bash
# في Vercel Dashboard > Settings > Environment Variables
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here
DATABASE_URL=your-database-connection-string
OLLAMA_HOST=http://your-ollama-server.com
OLLAMA_MODEL=cniongolo/biomistral:latest
OLLAMA_TIMEOUT=120000
OPENAI_API_KEY=your-openai-key-for-fallback
```

### الخطوة 3: النشر
```bash
# بناء الإصدار الإنتاجي
npm run build

# النشر
vercel --prod

# أو نشر تلقائي مع GitHub push
git push origin main
```

---

## 🔧 إعدادات الإنتاج

### 1. تحسين الأداء
```json
// next.config.js
{
  "experimental": {
    "serverComponentsExternalPackages": ["@prisma/client"]
  },
  "images": {
    "domains": ["your-ollama-server.com"]
  }
}
```

### 2. إعدادات الأمان
```typescript
// src/lib/security.ts
export const ollamaConfig = {
  host: process.env.OLLAMA_HOST,
  timeout: parseInt(process.env.OLLAMA_TIMEOUT || '120000'),
  retries: 3,
  retryDelay: 1000
}
```

---

## 📊 المراقبة والصيانة

### 1. مراقبة Ollama
```bash
# على سيرفر Ollama
docker logs ollama

# مراقبة الموارد
docker stats ollama

# إعادة تشغيل إذا لزم الأمر
docker restart ollama
```

### 2. مراقبة Vercel
- Dashboard > Analytics
- Logs في Vercel
- Performance metrics

---

## 🚨 استكشاف الأخطاء

### مشكلة: الاتصال بـ Ollama فشل
```bash
# تحقق من أن Ollama يعمل
curl http://your-ollama-server.com:11434/api/tags

# تحقق من جدار الحماية
ufw allow 11434
ufw allow 80
ufw allow 443
```

### مشكلة: بطء الاستجابة
```bash
# تحقق من موارد السيرفر
free -h
df -h
docker stats

# زيادة الموارد إذا لزم الأمر
docker update --memory=8g ollama
```

---

## 💡 نصائح للإنتاج

### 1. النسخ الاحتياطي
```bash
# نسخ احتياطي للنماذج
docker volume ls
docker volume inspect ollama

# إنشاء نسخة احتياطية
docker run --rm -v ollama:/data -v $(pwd):/backup alpine tar czf /backup/ollama-backup.tar.gz -C /data .
```

### 2. التحديثات
```bash
# تحديث Ollama
docker pull ollama/ollama:latest
docker stop ollama
docker rm ollama
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

### 3. التوسع
```bash
# إضافة سيرفرات إضافية
# Load balancer
# CDN
```

---

## 🎯 النتيجة النهائية

### للمستخدمين:
- 🌐 https://your-app.vercel.app
- ⚡ وصول فوري من أي مكان
- 🏥 ذكاء اصطناعي طبي متخصص
- 📱 يعمل على جميع الأجهزة

### لك:
- 📊 تحليلات الاستخدام
- 🔧 تحديثات سهلة
- 💰 تكلفة شهرية منخفضة ($20-50)
- 🚀 نشر تلقائي

---

## 📞 الدعم

### إذا واجهت مشاكل:
1. تحقق من logs في Vercel
2. تحقق من سيرفر Ollama
3. راجع متغيرات البيئة
4. اختبر الاتصال يدوياً

### للتواصل:
- Vercel Dashboard
- سجلات Ollama
- GitHub Issues
