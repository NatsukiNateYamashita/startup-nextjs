// 🚀 サインアップページ - クライアントコンポーネント
// 作成日: 2025-07-11
// 説明: 既存UIデザインを活用したユーザー登録機能統合

"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import Link from "next/link"

interface SignUpClientProps {
  locale: string
}

export default function SignUpClient({ locale }: SignUpClientProps) {
  const t = useTranslations("SignupPage")
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    organization: "",
    agreeToTerms: false
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setPasswordError("")
    
    // パスワード確認
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("パスワードが一致しません")
      setIsLoading(false)
      return
    }
    
    // 利用規約確認
    if (!formData.agreeToTerms) {
      setError("利用規約に同意してください")
      setIsLoading(false)
      return
    }
    
    try {
      // ユーザー登録API呼び出し
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: formData.age ? parseInt(formData.age) : undefined,
          organization: formData.organization || undefined,
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        // 登録成功時、自動的にサインイン
        const signInResult = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })
        
        if (signInResult?.error) {
          setError("登録は成功しましたが、サインインに失敗しました。再度サインインしてください。")
        } else {
          // サインイン成功時のリダイレクト
          router.push(`/${locale}/dashboard`)
        }
      } else {
        if (result.details) {
          // バリデーションエラーの表示
          const errorMessages = result.details.map((d: any) => d.message).join(", ")
          setError(errorMessages)
        } else {
          setError(result.error || "ユーザー登録に失敗しました")
        }
      }
    } catch (error) {
      setError("サーバーエラーが発生しました。もう一度お試しください。")
    } finally {
      setIsLoading(false)
    }
  }

  // Google OAuth
  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      await signIn("google", {
        callbackUrl: `/${locale}/dashboard`
      })
    } catch (error) {
      setError("Googleサインアップに失敗しました")
      setIsLoading(false)
    }
  }

  // フォーム入力処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
    
    // パスワード確認のリアルタイムチェック
    if (name === "confirmPassword" || name === "password") {
      setPasswordError("")
    }
  }

  return (
    <div className="shadow-three dark:bg-dark mx-auto max-w-[500px] rounded-sm bg-white px-6 py-10 sm:p-[60px]">
      <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl dark:text-white">
        {t("title")}
      </h3>
      <p className="text-body-color dark:text-body-color-dark mb-11 text-center text-base font-medium">
        {t("description")}
      </p>

      {/* エラーメッセージ */}
      {error && (
        <div className="mb-6 rounded-sm bg-red-100 px-4 py-3 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Google サインアップ */}
      <button 
        onClick={handleGoogleSignUp}
        disabled={isLoading}
        className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color hover:border-primary hover:bg-primary/5 hover:text-primary dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary bg-form-bg dark:bg-form-bg-dark mb-6 flex w-full items-center justify-center rounded-xs border px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:hover:shadow-none disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="mr-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_95:967)">
              <path
                d="M20.0001 10.2216C20.0122 9.53416 19.9397 8.84776 19.7844 8.17725H10.2042V11.8883H15.8277C15.7211 12.539 15.4814 13.1618 15.1229 13.7194C14.7644 14.2769 14.2946 14.7577 13.7416 15.1327L13.722 15.257L16.7512 17.5567L16.961 17.5772C18.8883 15.8328 19.9997 13.266 19.9997 10.2216"
                fill="#4285F4"
              />
              <path
                d="M10.2042 20.0001C12.9592 20.0001 15.2721 19.1111 16.9616 17.5778L13.7416 15.1332C12.88 15.7223 11.7235 16.1334 10.2042 16.1334C8.91385 16.126 7.65863 15.7206 6.61663 14.9747C5.57464 14.2287 4.79879 13.1802 4.39915 11.9778L4.27957 11.9878L1.12973 14.3766L1.08856 14.4888C1.93689 16.1457 3.23879 17.5387 4.84869 18.512C6.45859 19.4852 8.31301 20.0005 10.2046 20.0001"
                fill="#34A853"
              />
              <path
                d="M4.39911 11.9777C4.17592 11.3411 4.06075 10.673 4.05819 9.99996C4.0623 9.32799 4.17322 8.66075 4.38696 8.02225L4.38127 7.88968L1.19282 5.4624L1.08852 5.51101C0.372885 6.90343 0.00012207 8.4408 0.00012207 9.99987C0.00012207 11.5589 0.372885 13.0963 1.08852 14.4887L4.39911 11.9777Z"
                fill="#FBBC05"
              />
              <path
                d="M10.2042 3.86663C11.6663 3.84438 13.0804 4.37803 14.1498 5.35558L17.0296 2.59996C15.1826 0.901848 12.7366 -0.0298855 10.2042 -3.6784e-05C8.3126 -0.000477834 6.45819 0.514732 4.8483 1.48798C3.2384 2.46124 1.93649 3.85416 1.08813 5.51101L4.38775 8.02225C4.79132 6.82005 5.56974 5.77231 6.61327 5.02675C7.6568 4.28118 8.91279 3.87541 10.2042 3.86663Z"
                fill="#EB4335"
              />
            </g>
            <defs>
              <clipPath id="clip0_95:967">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </span>
        {isLoading ? "処理中..." : t("signUpWithGoogle")}
      </button>

      {/* 区切り線 */}
      <div className="mb-8 flex items-center justify-center">
        <span className="bg-body-color/50 hidden h-[1px] w-full max-w-[60px] sm:block"></span>
        <p className="text-body-color dark:text-body-color-dark w-full px-5 text-center text-base font-medium">
          {t("orSignUpWithEmail")}
        </p>
        <span className="bg-body-color/50 hidden h-[1px] w-full max-w-[60px] sm:block"></span>
      </div>

      {/* 登録フォーム */}
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <label
            htmlFor="name"
            className="text-dark mb-3 block text-sm dark:text-white"
          >
            {t("yourName")}
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={t("enterYourNamePlaceholder")}
            required
            disabled={isLoading}
            className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-form-bg px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-form-bg-dark dark:focus:shadow-none disabled:opacity-60"
          />
        </div>
        
        <div className="mb-8">
          <label
            htmlFor="email"
            className="text-dark mb-3 block text-sm dark:text-white"
          >
            {t("yourEmail")}
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={t("enterYourEmailPlaceholder")}
            required
            disabled={isLoading}
            className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-form-bg px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-form-bg-dark dark:focus:shadow-none disabled:opacity-60"
          />
        </div>
        
        <div className="mb-8">
          <label
            htmlFor="password"
            className="text-dark mb-3 block text-sm dark:text-white"
          >
            {t("yourPassword")}
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={t("enterYourPasswordPlaceholder")}
            required
            disabled={isLoading}
            className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-form-bg px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-form-bg-dark dark:focus:shadow-none disabled:opacity-60"
          />
        </div>
        
        <div className="mb-8">
          <label
            htmlFor="confirmPassword"
            className="text-dark mb-3 block text-sm dark:text-white"
          >
            {t("confirmPassword")}
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder={t("confirmPasswordPlaceholder")}
            required
            disabled={isLoading}
            className={`border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-form-bg px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-form-bg-dark dark:focus:shadow-none disabled:opacity-60 ${passwordError ? 'border-red-500' : ''}`}
          />
          {passwordError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{passwordError}</p>
          )}
        </div>

        {/* オプション項目 */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="age"
              className="text-dark mb-3 block text-sm dark:text-white"
            >
              {t("yourAge")} <span className="text-gray-500">({t("optional")})</span>
            </label>
            <input
              type="number"
              name="age"
              id="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="25"
              min="13"
              max="120"
              disabled={isLoading}
              className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-form-bg px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-form-bg-dark dark:focus:shadow-none disabled:opacity-60"
            />
          </div>
          
          <div>
            <label
              htmlFor="organization"
              className="text-dark mb-3 block text-sm dark:text-white"
            >
              {t("yourOrganization")} <span className="text-gray-500">({t("optional")})</span>
            </label>
            <input
              type="text"
              name="organization"
              id="organization"
              value={formData.organization}
              onChange={handleInputChange}
              placeholder={t("organizationPlaceholder")}
              disabled={isLoading}
              className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-form-bg px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-form-bg-dark dark:focus:shadow-none disabled:opacity-60"
            />
          </div>
        </div>
        
        <div className="mb-8">
          <label
            htmlFor="agreeToTerms"
            className="text-body-color dark:text-body-color-dark flex cursor-pointer items-center text-sm font-medium select-none"
          >
            <div className="relative">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
                className="sr-only"
              />
              <div className={`box border-body-color/20 mr-4 flex h-5 w-5 items-center justify-center rounded-sm border dark:border-white/10 ${formData.agreeToTerms ? 'bg-primary border-primary' : ''}`}>
                <span className={`${formData.agreeToTerms ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                  <svg
                    width="11"
                    height="8"
                    viewBox="0 0 11 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                      fill="white"
                      stroke="white"
                      strokeWidth="0.4"
                    />
                  </svg>
                </span>
              </div>
            </div>
            {t("agreeToTerms")}{" "}
            <Link href={`/${locale}/terms`} className="text-primary hover:underline ml-1">
              {t("termsOfService")}
            </Link>
          </label>
        </div>
        
        <div className="mb-6">
          <button 
            type="submit"
            disabled={isLoading || !formData.agreeToTerms}
            className="bg-primary hover:bg-opacity-90 shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-xs px-9 py-4 text-base font-medium text-white duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "アカウント作成中..." : t("createAccount")}
          </button>
        </div>
      </form>
      
      <p className="text-body-color dark:text-body-color-dark text-center text-base font-medium">
        {t("alreadyHaveAccount")}{" "}
        <Link href={`/${locale}/signin`} className="text-primary hover:underline">
          {t("signIn")}
        </Link>
      </p>
    </div>
  )
}
