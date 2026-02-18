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
st.sidebar.metric("Estimated Time Saved", "5–6 Hours")

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

# ---------------- Disclaimer ----------------
st.markdown("""
<div style="
    background-color:#ffe08a;
    padding:12px;
    border-left:5px solid #e0a800;
    margin-bottom:20px;
    font-size:14px;
color:#000000;">
⚠️ <b>Demo Disclaimer:</b> This prototype uses synthetic data and simplified rules.
It does not process real customer information and is intended solely for demonstration.
</div>
""", unsafe_allow_html=True)

st.divider()

# ---------------- Layout ----------------
left, right = st.columns([1.2, 0.8])

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

        # ---- Risk Scoring ----
        risk_score = len(risk_indicators)

        risk_level = (
            "High" if risk_score >= 3 else
            "Medium" if risk_score == 2 else
            "Low"
        )

        # ---- Narrative Generation ----
        narrative = f"""
This Suspicious Activity Report (SAR) is being filed pursuant to regulatory obligations
after the detection of activity that may be indicative of potential financial crime.

The account identified as {account_id} conducted a transaction amounting to INR {txn_amount}
via {txn_type} originating in {txn_location}. The activity exhibited characteristics
inconsistent with the customer’s known profile and expected transactional behavior.

The following risk indicators were identified during the review:
{", ".join(risk_indicators) if risk_indicators else "No explicit indicators detected, however the activity warrants further review."}

The transaction was assessed as {risk_level} risk based on internal monitoring rules
and observed behavioral deviations.

Based on the cumulative risk factors and internal alerts, the activity has been escalated
for further investigation and regulatory reporting in accordance with AML obligations.
This report is submitted to ensure timely regulatory awareness and enable appropriate
follow-up actions by relevant authorities.
"""

        st.success(f"Regulator-ready SAR Narrative Generated (Risk Level: {risk_level})")

        st.text_area("SAR Narrative Text", narrative.strip(), height=260)

        st.download_button(
            label="⬇️ Download SAR Narrative",
            data=narrative,
            file_name=f"{case_id}_SAR.txt",
            mime="text/plain"
        )

        st.markdown("### 🧾 Audit Trail & Decisioning")

        st.json({
            "case_id": case_id,
            "assigned_analyst": analyst,
            "account_id": account_id,
            "transaction_amount_inr": txn_amount,
            "transaction_type": txn_type,
            "transaction_location": txn_location,
            "transaction_pattern": frequency,
            "risk_indicators_triggered": risk_indicators,
            "calculated_risk_level": risk_level,
            "monitoring_decision": "Escalated for SAR Filing",
            "generation_timestamp_utc": datetime.utcnow().isoformat(),
            "narrative_version": "v1.0",
            "estimated_manual_effort_reduced": "5–6 hours"
        })

    else:
        st.info("Enter transaction details and generate a compliant SAR narrative")

# ---------------- Footer ----------------
st.divider()
st.caption(
    "⚠️ Demonstration prototype. In production, this solution integrates with "
    "transaction monitoring systems, data warehouses, and case management platforms "
    "while maintaining full auditability."
)
