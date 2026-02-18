import streamlit as st
from datetime import datetime

# ---------------- Page Config ----------------
st.set_page_config(
    page_title="SAR Narrative Generator",
    page_icon="🏦",
    layout="wide"
)

# ---------------- Sidebar ----------------
st.sidebar.title("🏦 Bank Compliance Portal")
st.sidebar.markdown("**Suspicious Activity Reporting**")
st.sidebar.divider()

case_id = st.sidebar.text_input("Case ID", "SAR-2026-01452")
analyst = st.sidebar.text_input("Assigned Analyst", "Compliance Officer")
time_saved = st.sidebar.metric("Estimated Time Saved", "5–6 Hours")

st.sidebar.divider()
st.sidebar.caption("Prototype – Not a Production System")

# ---------------- Header ----------------
st.markdown(
    """
    <h1 style='text-align: center;'>SAR Narrative Generator with Audit Trail</h1>
    <p style='text-align: center; color: gray;'>
    Automating regulator-ready Suspicious Activity Report narratives at scale
    </p>
    """,
    unsafe_allow_html=True
)

st.divider()

# ---------------- Layout ----------------
left, right = st.columns([1, 1])

# ---------------- Input Section ----------------
with left:
    st.subheader("🔍 Transaction & Account Details")

    account_id = st.text_input("Customer / Account ID", "ACC-998271")
    txn_amount = st.number_input("Transaction Amount (INR)", min_value=0, value=250000)
    txn_type = st.selectbox("Transaction Type", ["Cash Deposit", "Wire Transfer", "Online Transfer"])
    txn_location = st.selectbox("Transaction Location", ["India", "USA", "UAE"])
    frequency = st.selectbox("Transaction Pattern", ["One-time", "Repeated", "Structuring Suspected"])

    generate = st.button("⚠️ Generate SAR Narrative", use_container_width=True)

# ---------------- Output Section ----------------
with right:
    st.subheader("📄 Generated SAR Narrative")

    if generate:
        # ---- Risk Detection Logic ----
        risk_indicators = []

        if txn_amount > 100000:
            risk_indicators.append("Unusually high transaction value")

        if txn_location != "India":
            risk_indicators.append("Cross-border transaction")

        if txn_type == "Cash Deposit":
            risk_indicators.append("Cash-intensive activity")

        if frequency != "One-time":
            risk_indicators.append("Unusual transaction pattern")

        # ---- Narrative Generation ----
        narrative = f"""
This Suspicious Activity Report is being filed to document potentially suspicious financial activity
identified through automated monitoring systems.

The account identified as {account_id} conducted a transaction amounting to INR {txn_amount}
via {txn_type} originating in {txn_location}. The activity displayed characteristics inconsistent
with the customer’s known profile and expected transactional behavior.

The following risk indicators were identified during the review:
{", ".join(risk_indicators) if risk_indicators else "No explicit indicators detected, however activity warrants review."}

Based on the cumulative risk factors and internal monitoring alerts, the activity has been escalated
for further investigation and regulatory reporting in accordance with AML obligations.
"""

        st.success("Regulator-ready SAR Narrative Generated")

        st.text_area("SAR Narrative Text", narrative, height=260)

        st.markdown("### 🧾 Audit Trail & Decisioning")

        st.json({
            "case_id": case_id,
            "analyst": analyst,
            "generation_timestamp": datetime.utcnow().isoformat(),
            "risk_indicators_triggered": risk_indicators,
            "monitoring_decision": "Flagged for SAR Filing",
            "estimated_manual_effort_reduced": "5–6 hours"
        })

    else:
        st.info("Enter details and generate a compliant SAR narrative")

# ---------------- Footer ----------------
st.divider()
st.caption(
    "⚠️ Demonstration prototype. In production, this solution integrates with "
    "transaction monitoring systems, data warehouses, and case management platforms "
    "while maintaining full auditability."
)
