# 🔗 ربط Ollama بـ Vercel - خطوة بخطوة

## 📋 **المتطلبات:**
- ✅ سيرفر Ollama يعمل
- ✅ IP address السيرفر
- ✅ صلاحيات Vercel

---

## 🚀 **الخطوات:**

### **الخطوة 1: التحقق من Ollama**
```bash
# على سيرفر Ollama
curl http://localhost:11434/api/tags

# يجب أن ترى:
{"models":[{"name":"cniongolo/biomistral:latest",...}]}
```

### **الخطوة 2: الحصول على IP السيرفر**
```bash
# على سيرفر Ollama
curl ifconfig.me
# مثال: 123.45.67.89
```

### **الخطوة 3: اختبار الوصول الخارجي**
```bash
# من جهازك المحلي (استبدل IP)
curl http://123.45.67.89:11434/api/tags

# إذا نجح → السيرفر متاح للإنترنت
# إذا فشل → تحقق من firewall
```

### **الخطوة 4: إضافة متغير البيئة**
```bash
# في مجلد المشروع المحلي
vercel env add OLLAMA_HOST production

# سيطلب:
# ? What's the value of OLLAMA_HOST?
# أدخل: http://YOUR_SERVER_IP:11434
# مثال: http://123.45.67.89:11434

# ? Mark as sensitive? yes
```

### **الخطوة 5: إعادة النشر**
```bash
vercel --prod
```

---

## 🧪 **الاختبار والتحقق:**

### **اختبار 1: التحقق من المتغيرات**
```bash
vercel env ls
# يجب ترى OLLAMA_HOST في القائمة
```

### **اختبار 2: اختبار الـ API**
```bash
# اختبار الـ API مباشرة
curl -X POST https://z-ai-pharmacy-platform.vercel.app/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is paracetamol?",
    "history": []
  }'
```

### **اختبار 3: اختبار من الواجهة**
```bash
# افتح الموقع
https://z-ai-pharmacy-platform.vercel.app

# جرب الدردشة:
"What are the side effects of paracetamol?"
# يجب أن يرد biomistral model
```

---

## 🔍 **استكشاف الأخطاء:**

### **مشكلة: Connection timeout**
```bash
# الحل:
1. تحقق من firewall على السيرفر
   sudo ufw status
   sudo ufw allow 11434

2. تحقق من أن Ollama يعمل
   docker ps | grep ollama

3. أعد تشغيل Ollama
   docker restart ollama
```

### **مشكلة: Model not found**
```bash
# الحل:
1. تحقق من النماذج المتاحة
   docker exec ollama ollama list

2. إذا لم يوجد biomistral:
   docker exec ollama ollama pull cniongolo/biomistral:latest
```

### **مشكلة: Vercel لا يتصل**
```bash
# الحل:
1. تحقق من متغيرات البيئة
   vercel env ls

2. أضف OLLAMA_HOST مرة أخرى
   vercel env add OLLAMA_HOST production

3. أعد النشر
   vercel --prod
```

---

## 📊 **المراقبة:**

### **على السيرفر:**
```bash
# حالة Ollama
ollama-status

# logs
docker logs ollama

# الموارد
docker stats ollama
```

### **على Vercel:**
```bash
# Function logs
vercel logs

# Analytics
https://vercel.com/your-project/analytics
```

---

## 🎯 **النجاح يعني:**

### **عند العمل:**
- 🧠 الردود تأتي من نموذج biomistral
- ⏡ وقت استجابة 1-3 دقائق
- 🔐 خصوصية تامة للبيانات
- 🏥 معلومات طبية دقيقة

### **علامات النجاح:**
- ✅ "using local biomistral model" في الردود
- ✅ لا يوجد أخطاء في logs
- ✅ استجابات ناجحة من الـ API
- ✅ المستخدمون يستفيدون

---

## 🚀 **الخطوة التالية: اختبار عميق**

### **بعد نجاح الربط:**
1. 🧪 **اختبر الميزات الطبية**
2. 📊 **راقب الأداء**
3. 👥 **اختبر مع مستخدمين حقيقيين**
4. 📈 **اجمع ردود الفعل**

---

## 📞 **الدعم:**

### **إذا واجهت مشاكل:**
1. تحقق من هذا الدليل
2. راجع logs في Vercel
3. اختبر الاتصال بالسيرفر
4. تواصل للدعم الفني

---

## ✨ **تهانينا!**

**أنت على وشك تشغيل منصة طبية ذكية بخصوصية تامة!**
