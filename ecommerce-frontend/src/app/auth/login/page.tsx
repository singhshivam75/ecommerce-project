"use client"
import { useState } from "react"
import InputField from "@/src/components/ui/InputField"
import AuthLayout from "@/src/components/layout/AuthLayout"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ email, password, remember })
  }

  const left = (
    <>
      <h2 className="text-5xl font-extrabold leading-tight">
        Welcome back to <span className="text-indigo-400">ShopHub</span>
      </h2>
      <p className="mt-6 text-gray-300">
        Sign in to access your account, track orders, and enjoy personalized shopping experiences.
      </p>
    </>
  )

  return (
    <AuthLayout left={left}>
      <h1 className="text-3xl font-bold mb-2">Sign In</h1>
      <p className="text-gray-500 mb-6">Enter your credentials to continue</p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          icon={"✉️"}
          required
        />

        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          icon={"🔒"}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>
          <a href="#" className="text-sm text-indigo-600">Forgot password?</a>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-sky-500 text-white rounded-xl font-medium shadow-lg"
        >
          Sign In
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">Or continue with</div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <button className="py-3 border rounded-xl">Google</button>
        <button className="py-3 border rounded-xl">Apple</button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account? <a href="/auth/signup" className="text-indigo-600">Sign up</a>
      </p>
    </AuthLayout>
  )
}