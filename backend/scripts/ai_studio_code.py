import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import time
import numpy as np

# --- PAGE CONFIGURATION ---
st.set_page_config(
    page_title="First Contact E.I.S. | Prototype",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- STYLING ---
st.markdown("""
    <style>
    .main {
        background-color: #f8f9fa;
    }
    .stButton>button {
        width: 100%;
        border-radius: 5px;
        height: 3em;
        background-color: #002D62; /* Navy Blue */
        color: white;
    }
    .metric-card {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
        text-align: center;
    }
    .highlight {
        color: #d9534f; /* Red for alerts */
        font-weight: bold;
    }
    </style>
    """, unsafe_allow_html=True)

# --- SESSION STATE INITIALIZATION ---
if 'view_mode' not in st.session_state:
    st.session_state['view_mode'] = 'Login'
if 'case_plan_generated' not in st.session_state:
    st.session_state['case_plan_generated'] = False
if 'client_intake' not in st.session_state:
    st.session_state['client_intake'] = None

# --- MOCK DATA GENERATION ---
def get_vendor_data():
    return pd.DataFrame({
        'Vendor': ['Hope Haven', 'Metro Outreach', 'Safe Harbor', 'Valley Shelter'],
        'Budget_Allocation': [2400000, 1800000, 3200000, 1200000],
        'Self_Reported_Placements': [120, 95, 200, 40],
        'Verified_Housing_Exits': [45, 88, 50, 35], # Layer 8 Truth
        'Retention_6_Month': [0.45, 0.92, 0.30, 0.85],
        'Avg_Days_To_House': [210, 45, 180, 60]
    })

# --- FUNCTIONS ---

def calculate_benefits(ssi, gr, calfresh, housing_subsidy):
    # Logic from White Paper Appendix C
    # GR Housing Subsidy reduces General Relief by $100
    
    base_gr = 221
    if housing_subsidy:
        effective_gr = 121 # $221 - $100 reduction
        subsidy_val = 575
    else:
        effective_gr = base_gr
        subsidy_val = 0
        
    total = ssi + effective_gr + calfresh + subsidy_val
    return total, effective_gr, subsidy_val

def render_login():
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.title("FIRST CONTACT E.I.S.")
        st.markdown("### Emergency Information System")
        st.write("A Multi-Tenant AI Orchestration Platform for Homeless Services.")
        
        st.divider()
        
        st.info("Select a User Role to Enter the Simulation:")
        
        role = st.selectbox("Select Role", ["Select...", "Caseworker (Vendor)", "City Administrator (Government)"])
        
        if role == "Caseworker (Vendor)":
            if st.button("Enter Portal"):
                st.session_state['view_mode'] = 'Caseworker'
                st.rerun()
        elif role == "City Administrator (Government)":
            if st.button("Access Dashboard"):
                st.session_state['view_mode'] = 'Admin'
                st.rerun()

def render_caseworker_view():
    st.sidebar.title("Vendor Portal")
    st.sidebar.caption("Organization: Metro Outreach")
    st.sidebar.caption("Role: Case Manager")
    
    nav = st.sidebar.radio("Navigation", ["QR Intake", "AI Case Plan", "Benefit Stack"])
    
    if st.sidebar.button("Logout"):
        st.session_state['view_mode'] = 'Login'
        st.rerun()

    st.title("Layers 1-7: Caseworker Efficiency Suite")
    st.markdown("*Goal: Save 3+ hours daily. Automate bureaucracy.*")
    st.divider()

    if nav == "QR Intake":
        col1, col2 = st.columns(2)
        with col1:
            st.subheader("Field Intake")
            st.write("Scan client QR code for instant profile retrieval and territory assignment.")
            st.image("https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg", width=150)
            if st.button("Simulate Scan"):
                with st.spinner("Retrieving biometric hash... Assigning to Metro Outreach territory..."):
                    time.sleep(1.5)
                st.success("Client Identified: John Doe (ID: #99281)")
                st.session_state['client_intake'] = "John Doe"
        
        with col2:
            if st.session_state['client_intake']:
                st.info("Territory Assignment: **Metro Outreach** (Auto-assigned via GPS)")
                st.json({
                    "Name": "John Doe",
                    "Last Known Location": "Lincoln Park",
                    "VI-SPDAT Score": 12,
                    "Status": "Unsheltered",
                    "Needs": ["ID Replacement", "CalFresh", "Shelter"]
                })

    elif nav == "AI Case Plan":
        st.subheader("AI-Generated Case Plan")
        st.write("Review the AI-generated pathway based on client history and eligibility.")
        
        col1, col2 = st.columns([1, 2])
        
        with col1:
            st.write("**Client:** John Doe")
            st.write("**VI-SPDAT:** 12")
            st.write("**Chronic Status:** Yes")
            
            if st.button("Generate Plan (Claude 4.5)"):
                with st.spinner("Analyzing benefit eligibility... Checking shelter bed availability..."):
                    time.sleep(2)
                st.session_state['case_plan_generated'] = True
        
        with col2:
            if st.session_state['case_plan_generated']:
                st.success("Plan Generated (Confidence: 94%)")
                with st.expander("Step 1: Immediate Stabilization", expanded=True):
                    st.checkbox("Assign Bed at Westside Shelter (Available)", value=True)
                    st.checkbox("Issue Temporary ID Voucher", value=True)
                
                with st.expander("Step 2: Income Maximization", expanded=True):
                    st.checkbox("Apply for CalFresh (Pre-filled)", value=True)
                    st.checkbox("Apply for GR Housing Subsidy", value=True)
                
                with st.expander("Step 3: Housing Pathway"):
                    st.write("Recommended: Permanent Supportive Housing (PSH) via Coordinated Entry.")
                
                st.button("Approve & Execute Plan", type="primary")

    elif nav == "Benefit Stack":
        st.subheader("Intelligent Benefit Stacking")
        st.write("Optimize client income. Logic accounts for GR/Housing Subsidy interactions.")
        
        c1, c2, c3 = st.columns(3)
        with c1:
            ssi = st.number_input("SSI Income ($)", value=0)
            calfresh = st.number_input("CalFresh ($)", value=234)
        with c2:
            apply_gr = st.checkbox("General Relief (GR)", value=True)
            apply_subsidy = st.checkbox("GR Housing Subsidy", value=False)
            
        total, eff_gr, subsidy = calculate_benefits(ssi, 221 if apply_gr else 0, calfresh, apply_subsidy)
        
        with c3:
            st.metric("Total Monthly Resources", f"${total}")
            st.caption(f"Breakdown: GR: ${eff_gr} | Subsidy: ${subsidy} | CalFresh: ${calfresh}")
            
            if apply_gr and apply_subsidy:
                st.warning("Note: Subsidy reduces GR cash portion by $100.")

def render_admin_view():
    st.sidebar.title("City Admin")
    st.sidebar.caption("Entity: City of Long Beach")
    st.sidebar.caption("Access: Level 8 (Full Visibility)")
    
    if st.sidebar.button("Logout"):
        st.session_state['view_mode'] = 'Login'
        st.rerun()

    st.title("Layer 8: Accountability Dashboard")
    st.markdown("*The Hidden Truth: Real-time vendor performance vs. reported metrics.*")
    
    # KPI Row
    k1, k2, k3, k4 = st.columns(4)
    df = get_vendor_data()
    
    total_spend = df['Budget_Allocation'].sum()
    real_housed = df['Verified_Housing_Exits'].sum()
    reported_housed = df['Self_Reported_Placements'].sum()
    avg_cost = total_spend / real_housed if real_housed > 0 else 0
    
    k1.metric("Total Annual Spend", "$7.4M")
    k2.metric("Verified Placements", real_housed, delta=f"-{(reported_housed - real_housed)} vs Reported", delta_color="inverse")
    k3.metric("True Cost Per Placement", f"${avg_cost:,.0f}", delta="Target: $25,000", delta_color="inverse")
    k4.metric("Efficiency Gap", "38x", delta_color="inverse")
    
    st.divider()
    
    # The Reveal Chart
    st.subheader("The 'Reveal': Reported vs. Verified Outcomes")
    
    fig = go.Figure(data=[
        go.Bar(name='Self-Reported Placements', x=df['Vendor'], y=df['Self_Reported_Placements'], marker_color='#A9A9A9'),
        go.Bar(name='Verified (Layer 8 Data)', x=df['Vendor'], y=df['Verified_Housing_Exits'], marker_color='#002D62')
    ])
    fig.update_layout(barmode='group', height=400)
    st.plotly_chart(fig, use_container_width=True)
    
    # Cost Efficiency Analysis
    c1, c2 = st.columns([2, 1])
    
    with c1:
        st.subheader("Cost Per Verified Outcome")
        df['Real_CPO'] = df['Budget_Allocation'] / df['Verified_Housing_Exits']
        fig2 = px.bar(df, x='Vendor', y='Real_CPO', color='Real_CPO', 
                      color_continuous_scale='RdYlGn_r', title="Cost Per Permanent Housing Exit")
        st.plotly_chart(fig2, use_container_width=True)
        
    with c2:
        st.subheader("AI Strategic Advice")
        st.markdown("""
        **🤖 "Calling an Audible"**
        
        *Analysis of Q3 Performance:*
        
        **1. Critical Inefficiency:** 
        **Hope Haven** is costing **$53,333** per placement with only 45% retention.
        
        **2. High Performer:**
        **Metro Outreach** is achieving placements at **$20,454** with 92% retention.
        
        **Recommendation:**
        Reallocate **30% ($720k)** of Hope Haven's remaining contract to Metro Outreach.
        
        *Projected Impact:* **+35 additional people housed** this fiscal year with zero budget increase.
        """)
        st.button("Draft Contract Amendment")

# --- MAIN EXECUTION ---
def main():
    if st.session_state['view_mode'] == 'Login':
        render_login()
    elif st.session_state['view_mode'] == 'Caseworker':
        render_caseworker_view()
    elif st.session_state['view_mode'] == 'Admin':
        render_admin_view()

if __name__ == "__main__":
    main()