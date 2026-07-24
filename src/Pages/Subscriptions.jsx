import { useState } from "react";
import "../css/Subscriptions.css";

const PLANS = [
    {
        id: "free",
        name: "Free (AVOD)",
        price: "$0",
        period: "forever",
        color: "#9ca3af",
        features: ["Ad-supported streaming", "Standard Definition (480p)", "1 Concurrent Stream", "Community Forums Access"]
    },
    {
        id: "standard",
        name: "Standard (SVOD)",
        price: "$9.99",
        period: "per month",
        color: "#6366f1",
        features: ["Ad-free experience", "Full HD (1080p)", "2 Concurrent Streams", "Offline Downloads", "Watch Parties"]
    },
    {
        id: "premium",
        name: "Premium (SVOD)",
        price: "$15.99",
        period: "per month",
        color: "#f59e0b",
        popular: true,
        features: ["Ad-free experience", "Ultra HD (4K HDR) & Atmos", "4 Concurrent Streams", "Offline Downloads", "Watch Parties", "Early Access to Originals"]
    }
];

const COIN_PACKS = [
    { id: "pack1", coins: 100, price: "$0.99", bonus: "0%" },
    { id: "pack2", coins: 500, price: "$4.99", bonus: "10%" },
    { id: "pack3", coins: 1000, price: "$8.99", bonus: "20%" },
];

export default function Subscriptions() {
    const [billingCycle, setBillingCycle] = useState("monthly"); // monthly, annual
    const [processing, setProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubscribe = (planName) => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setSuccessMessage(`🎉 Successfully subscribed to the ${planName} plan via Secure Gateway!`);
            setTimeout(() => setSuccessMessage(""), 5000);
        }, 1500);
    };

    const handleBuyCoins = (coins) => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setSuccessMessage(`💰 Successfully purchased ${coins} Nerio Coins!`);
            setTimeout(() => setSuccessMessage(""), 5000);
        }, 1500);
    };

    return (
        <div className="subs-page">
            <div className="subs-header">
                <h1 className="subs-title">Choose Your Plan</h1>
                <p className="subs-subtitle">Unlock unlimited ad-free movies, TV shows, and exclusive live sports.</p>
                
                <div className="billing-toggle">
                    <button 
                        className={`toggle-btn ${billingCycle === "monthly" ? "active" : ""}`} 
                        onClick={() => setBillingCycle("monthly")}
                    >
                        Monthly
                    </button>
                    <button 
                        className={`toggle-btn ${billingCycle === "annual" ? "active" : ""}`} 
                        onClick={() => setBillingCycle("annual")}
                    >
                        Annually <span className="discount-badge">Save 20%</span>
                    </button>
                </div>
            </div>

            {successMessage && (
                <div className="payment-toast">
                    {successMessage}
                </div>
            )}

            <div className="plans-grid">
                {PLANS.map(plan => {
                    let displayPrice = plan.price;
                    if (billingCycle === "annual" && plan.id !== "free") {
                        const numericPrice = parseFloat(plan.price.replace("$", ""));
                        displayPrice = `$${(numericPrice * 12 * 0.8).toFixed(2)}`;
                    }

                    return (
                        <div key={plan.id} className={`plan-card ${plan.popular ? "popular" : ""}`}>
                            {plan.popular && <div className="popular-badge">Most Popular</div>}
                            <h2 className="plan-name" style={{ color: plan.color }}>{plan.name}</h2>
                            <div className="plan-price">
                                <span className="price-amount">{displayPrice}</span>
                                <span className="price-period">/ {billingCycle === "annual" && plan.id !== "free" ? "year" : plan.period}</span>
                            </div>
                            
                            <ul className="plan-features">
                                {plan.features.map((feat, i) => (
                                    <li key={i}>✓ {feat}</li>
                                ))}
                            </ul>

                            <button 
                                className="subscribe-btn" 
                                style={{ 
                                    background: plan.id === "free" ? "transparent" : plan.color,
                                    border: plan.id === "free" ? "1px solid #9ca3af" : "none"
                                }}
                                onClick={() => handleSubscribe(plan.name)}
                                disabled={processing}
                            >
                                {processing ? "Processing..." : (plan.id === "free" ? "Current Plan" : "Upgrade via Stripe")}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="in-app-purchases">
                <div className="iap-header">
                    <h2>🪙 Get Nerio Coins</h2>
                    <p>Support your favorite creators in the Broadcast Hub with virtual gifts!</p>
                </div>
                <div className="coin-grid">
                    {COIN_PACKS.map(pack => (
                        <div key={pack.id} className="coin-card">
                            <div className="coin-icon">💰</div>
                            <div className="coin-amount">{pack.coins} Coins</div>
                            <div className="coin-bonus">Bonus: {pack.bonus}</div>
                            <button className="buy-coin-btn" onClick={() => handleBuyCoins(pack.coins)}>
                                Buy for {pack.price}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="payment-methods">
                <p>Secured by Industry-Standard Encryption</p>
                <div className="payment-icons">
                    <span>💳 Stripe</span>
                    <span>🅿️ PayPal</span>
                    <span>🍎 Apple Pay</span>
                    <span>🌐 Google Pay</span>
                </div>
            </div>
        </div>
    );
}
