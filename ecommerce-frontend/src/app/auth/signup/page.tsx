"use client"
import { useState } from "react"
import InputField from "@/src/components/ui/InputField"
import AuthLayout from "@/src/components/layout/AuthLayout"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [gender, setGender] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [agree, setAgree] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agree) {
      alert("You must agree to the Terms and Privacy Policy")
      return
    }
    if (password !== confirm) {
      alert("Passwords do not match")
      return
    }
    console.log({ name, email, phone, gender, password })
  }

  const left = (
    <>
      <h2 className="text-5xl font-extrabold leading-tight mb-6">
        Start your <br />
        <span className="text-indigo-400">shopping journey</span>
      </h2>
      <p className="text-gray-300 max-w-md">
        Join thousands of happy customers and get exclusive access to deals,
        new arrivals, and member benefits.
      </p>
      <ul className="mt-10 space-y-4">
        <li className="flex items-center gap-3 text-gray-200">
          <span className="bg-white/10 p-3 rounded-lg inline-flex items-center justify-center">✓</span>
          Free shipping on orders over $50
        </li>
        <li className="flex items-center gap-3 text-gray-200">
          <span className="bg-white/10 p-3 rounded-lg inline-flex items-center justify-center">✓</span>
          30-day easy returns
        </li>
        <li className="flex items-center gap-3 text-gray-200">
          <span className="bg-white/10 p-3 rounded-lg inline-flex items-center justify-center">✓</span>
          Exclusive member-only discounts
        </li>
      </ul>
    </>
  )

  return (
    <AuthLayout left={left}>
      <h1 className="text-4xl font-bold mb-2">Create Account</h1>
      <p className="text-gray-500 mb-6">Sign up to get started</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          icon={"👤"}
          required
        />

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
          label="Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (555) 123-4567"
          icon={"📞"}
        />

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Gender</span>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 py-3 px-4"
            required
          >
            <option value="">Select Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </label>

        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a strong password"
          icon={"🔒"}
          required
        />

        <InputField
          label="Confirm Password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm your password"
          icon={"🔒"}
          required
        />

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>
            I agree to the <a href="#" className="text-indigo-600">Terms of Service</a> and <a href="#" className="text-indigo-600">Privacy Policy</a>
          </span>
        </label>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-sky-500 text-white rounded-full font-semibold shadow-lg"
        >
          Create Account →
        </button>
      </form>

      {/* <div className="mt-6 text-center text-sm text-gray-500">Or sign up with</div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <button className="py-3 border rounded-xl">Google</button>
        <button className="py-3 border rounded-xl">Apple</button>
      </div> */}

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account? <a href="/auth/login" className="text-indigo-600">Sign in</a>
      </p>
    </AuthLayout>
  )
}