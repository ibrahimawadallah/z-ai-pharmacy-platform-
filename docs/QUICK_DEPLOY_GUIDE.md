# 🚀 دليل النشر السريع على Vercel + Ollama

## 📋 الخطوات بالترتيب:

### 1. **إعداد سيرفر Ollama (5 دقائق)**
```bash
# على سيرفر Ubuntu (DigitalOcean, AWS, أو أي VPS)
ssh root@your-server-ip

# تشغيل سكربت الإعداد التلقائي
bash <(curl -s https://raw.githubusercontent.com/your-repo/main/scripts/setup-ollama-server.sh)
```

**أو يدوياً:**
```bash
# تثبيت Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# تشغيل Ollama
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# تحميل النموذج الطبي
docker exec -it ollama ollama pull cniongolo/biomistral:latest

# فحص العمل
curl http://localhost:11434/api/tags
```

---

### 2. **إعداد Vercel (3 دقائق)**
```bash
# على جهازك المحلي
cd "g:\New folder (2)\z-ai pharmacy platform"

# تثبيت Vercel CLI
npm i -g vercel

# ربط المشروع
vercel link

# إعدادات البيئة
vercel env add OLLAMA_HOST production
# أدخل: http://your-server-ip

vercel env add OLLAMA_MODEL production
# أدخل: cniongolo/biomistral:latest

vercel env add OLLAMA_TIMEOUT production
# أدخل: 120000
```

---

### 3. **النشر (دقيقة واحدة)**
```bash
# بناء الإصدار الإنتاجي
npm run build

# النشر
vercel --prod

# أو ارفع على GitHub وانتشر تلقائياً
git add .
git commit -m "Deploy to Vercel with Ollama"
git push origin main
```

---

## 🎯 **النتيجة:**

### **للمستخدمين:**
- 🌐 `https://your-app.vercel.app`
- ⚡ وصول فوري من أي مكان
- 🏥 ذكاء اصطناعي طبي متخصص
- 📱 يعمل على جميع الأجهزة

### **التكلفة:**
- 💰 Vercel: $20-50/شهر (حسب الاستخدام)
- 💰 سيرفر Ollama: $5-20/شهر (VPS بسيط)
- 🆓 **الإجمالي**: $25-70/شهر فقط!

---

## 🔧 **إعدادات إضافية:**

### **في Vercel Dashboard:**
```bash
# Settings > Environment Variables
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=your-database-url
OLLAMA_HOST=http://your-server-ip
OLLAMA_MODEL=cniongolo/biomistral:latest
OLLAMA_TIMEOUT=120000
OPENAI_API_KEY=sk-... (للنسخ الاحتياطي)
```

### **تحسين الأداء:**
```json
// vercel.json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 300
    }
  }
}
```

---

## 🧪 **الاختبار:**

### **1. اختبار السيرفر:**
```bash
# من جهازك
curl http://your-server-ip:11434/api/tags

# يجب أن ترى:
{"models": [{"name": "cniongolo/biomistral:latest", ...}]}
```

### **2. اختبار Vercel:**
```bash
# اختبار API
curl https://your-app.vercel.app/api/ai/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"message": "What is paracetamol?"}'
```

### **3. اختبار الواجهة:**
- افتح `https://your-app.vercel.app`
- اضغط على زر الدردشة العائم
- جرب سؤال طبي

---

## 🚨 **استكشاف الأخطاء السريع:**

### **مشكلة: الاتصال بـ Ollama فشل**
```bash
# تحقق من السيرفر
curl http://your-server-ip:11434/api/tags

# تحقق من جدار الحماية
ssh root@your-server-ip
ufw allow 11434
ufw status
```

### **مشكلة: بطء الاستجابة**
```bash
# تحقق من موارد السيرفر
ssh root@your-server-ip
docker stats ollama
free -h

# زيادة الموارد إذا لزم الأمر
docker update --memory=4g ollama
```

### **مشكلة: Vercel لا يتصل**
```bash
# تحقق من متغيرات البيئة
vercel env ls

# تحقق من logs
vercel logs
```

---

## 📊 **المراقبة:**

### **سيرفر Ollama:**
```bash
# حالة السيرفر
ssh root@your-server-ip
ollama-status

# logs
docker logs ollama

# إعادة تشغيل
docker restart ollama
```

### **Vercel:**
- Dashboard > Analytics
- Dashboard > Logs
- Performance metrics

---

## 🎉 **متى تكون جاهزاً؟**

### **5 دقائق** - إذا لديك:
- سيرفر Ubuntu جاهز
- حساب Vercel
- اتصال إنترنت

### **15 دقيقة** - إذا تحتاج:
- إنشاء سيرفر جديد
- إعداد حسابات
- تحميل النماذج

### **النتيجة النهائية:**
- 🏥 منصة طبية ذكية تعمل للعالم
- 💰 تكلفة شهرية منخفضة
- 📱 وصول من أي جهاز
- 🔐 خصوصية البيانات الطبية

---

## 📞 **الدعم:**

### **أين تبحث؟**
1. **Vercel Dashboard** - Logs و Analytics
2. **سيرفر Ollama** - `docker logs ollama`
3. **GitHub Issues** - للمشاكل التقنية
4. **الوثائق** - `docs/` folder

### **نصائح سريعة:**
- ✅ دائماً اختبار الاتصال قبل النشر
- ✅ استخدم متغيرات البيئة للإعدادات
- ✅ راجع logs بانتظام
- ✅ احتفظ بنسخ احتياطية

**🚀 أنت جاهز لنشر منصتك الطبية الذكية!**
