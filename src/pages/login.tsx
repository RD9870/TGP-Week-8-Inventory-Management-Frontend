import { useState, type FormEvent, type ChangeEvent } from "react";
import axios from "axios";

// 1. تعريف شكل البيانات القادمة من Laravel (Back-end)
interface LoginResponse {
  access_token: string;
  type: string;
}

function Login() {
  // 2. تعريف الـ States مع تحديد الأنواع (TypeScript)
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 3. دالة إرسال البيانات للسيرفر
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // إرسال الطلب لـ Laravel
      // تأكد من تغيير الرابط لرابط السيرفر الخاص بك
      const response = await axios.post<LoginResponse>("/api/login", {
        username: username,
        password: password,
      });

      // في حال النجاح: تخزين الـ Token
      const token = response.data.access_token;
      localStorage.setItem("auth_token", token);

      alert("تم تسجيل الدخول بنجاح!");
      // هنا يمكنك التوجيه لصفحة الـ Dashboard مثلاً:
      // window.location.href = '/dashboard';
    } catch (err: any) {
      // معالجة الأخطاء القادمة من الـ AuthController الذي كتبته
      if (err.response && err.response.status === 401) {
        setError(err.response.data.message); // سيعرض "wrong username" أو "wrong password"
      } else {
        setError("حدث خطأ في الاتصال بالسيرفر، حاول لاحقاً");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          alt="Your Company"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {/* أضفنا handleSubmit هنا */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm/6 font-medium text-gray-100"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                type="text" // تم التغيير لـ text لأنك تستخدم username
                name="username"
                required
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                name="password"
                required
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                autoComplete="current-password"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* عرض رسالة الخطأ إذا وجدت */}
          {error && (
            <div className="text-red-400 text-sm font-medium mt-2">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
