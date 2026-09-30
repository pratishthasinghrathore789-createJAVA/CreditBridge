# CreditBridge
<img width="1080" height="1285" alt="1000023153" src="https://github.com/user-attachments/assets/e6c2e59a-5708-40c8-8e64-acb441471cb4" />
**Digital Credit Access for Micro-Manufacturers**

CreditBridge is an explainable, alternative-data credit scoring platform for India's MSMEs. It turns utility payments, GST/invoice records, order history and mobile usage into a lender-ready score (0–100, grade A–D), so small manufacturers without collateral or bureau history can qualify for working-capital loans.

🔗 **Live demo:** https://creditbridgee.netlify.app

## The Problem
- No formal credit history: most micro-manufacturers operate in cash or informal ledgers
- Collateral requirements exclude home-based and small-shed units
- Manual underwriting takes weeks

## The Solution
1. **Collect:** utility, GST and order data, with borrower consent
2. **Score:** explainable ML model with SHAP-style reason codes
3. **Decide:** real-time score delivered to lenders via API

## Data Streams
- Utility payments
- GST / invoice records
- Order history
- Mobile usage

## Pages
- [Home](https://creditbridgee.netlify.app): landing page with interactive demo
- [Apply](https://creditbridgee.netlify.app/apply): borrower application flow
- [Lenders](https://creditbridgee.netlify.app/lenders): lender view
- [Lender Portal](https://creditbridgee.netlify.app/lender-queue): lender portal

## Tech Stack
HTML5 · CSS3 · JavaScript (vanilla) · Hosted on Netlify

## Run Locally
```bash
git clone https://github.com/pratishthasinghrathore789-createJAVA/CreditBridge.git
cd CreditBridge
# open index.html in your browser, or:
npx serve .
```

## Team Nexora
Ojas · Pratishtha Singh Rathore · Parth Gupta · Saurabh

Built for the **MAITRON Hackathon**, MSME Digital Credit Access Track (SDG 9).

> Note: this is a prototype. Scores and figures are illustrative and use self-reported inputs.

## License
MIT
