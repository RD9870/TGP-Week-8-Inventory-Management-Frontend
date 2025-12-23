import axios from 'axios';

// إنشاء نسخة (Instance) من Axios بإعدادات افتراضية
const api = axios.create({
    // الرابط الأساسي للسيرفر (Laravel)
    baseURL: 'http://localhost:8000/api', 
    
    // الإعدادات التي سيتم إرسالها مع كل طلب تلقائياً
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// (اختياري) إضافة "Interceptor" لإرسال التوكن تلقائياً إذا كان موجوداً
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // جلب التوكن من التخزين المحلي
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;