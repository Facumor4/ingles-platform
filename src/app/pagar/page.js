"use client"

export default function Pagar() {
  const handleCheckout = async () => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
    })

    const data = await res.json()

    window.location.href = data.url
  }

  return (
    <div className="p-10">
      <button
        onClick={handleCheckout}
        style={{
            background: "blue",
            color: "white",
            padding: "15px 25px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "18px",
        }}
        >
        Pagar acceso
        </button>

    </div>
  )
}
