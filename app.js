/* Shared application state, scoring and lender logic */
(function(){
"use strict";
const KEY="creditbridge_application_v1", QUEUE="creditbridge_queue_v1";
const WEIGHTS={gst:25,electricity:20,upi:20,stability:15,loan:10,maturity:10};
const LENDERS=[
{name:"Micro-Finance NBFC",min:50,cap:200000,minTenure:3,maxTenure:6,speed:"Same day"},
{name:"Small-Business Digital Lender",min:60,cap:300000,minTenure:3,maxTenure:9,speed:"Within hours"},
{name:"Supply-Chain Finance NBFC",min:65,cap:500000,minTenure:3,maxTenure:9,speed:"Within 24 hrs"},
{name:"Working-Capital NBFC",min:70,cap:1000000,minTenure:6,maxTenure:12,speed:"Within 24 hrs"},
{name:"Priority-Sector Bank Programme",min:75,cap:1500000,minTenure:6,maxTenure:12,speed:"1-3 days"},
{name:"DFI-Backed MSME Programme",min:80,cap:2500000,minTenure:6,maxTenure:18,speed:"2-5 days"}
];
const SECTORS=["Textile","Metal Works","Electronics Assembly","Printing & Packaging","Food Processing","Plastics","Leather","Furniture & Wood","Other"];
const STATES=["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"];
function get(key, fallback){try{const x=localStorage.getItem(key);return x?JSON.parse(x):fallback}catch(e){return fallback}}
function set(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch(e){return false}}
function remove(key){try{localStorage.removeItem(key)}catch(e){}}
function clamp(n,a,b){return Math.min(b,Math.max(a,n))}
function scoreApplication(a){
 const gst=WEIGHTS.gst*clamp(Number(a.sources.gst.consistency||0)/100,0,1);
 const elec=WEIGHTS.electricity*(1-clamp(Number(a.sources.electricity.delay||0)/15,0,1));
 const upi=WEIGHTS.upi*((clamp(Number(a.sources.upi.value||0)/Math.max(1,Number(a.monthlyRevenue||1)),0,1)+clamp(Number(a.sources.upi.transactions||0)/150,0,1))/2);
 const stability=WEIGHTS.stability*(1-clamp(Number(a.volatility||0)/60,0,1));
 const loan=a.existingLoan?(a.repayment==="always"?WEIGHTS.loan:a.repayment==="occasional"?WEIGHTS.loan*.4:0):WEIGHTS.loan*.5;
 const maturity=WEIGHTS.maturity*clamp(Number(a.years||0)/10,0,1);
 const parts=[
  {key:"gst",name:"GST Filing Consistency",value:`${a.sources.gst.consistency}%`,points:gst,max:WEIGHTS.gst,explanation:"Higher on-time filing consistency contributes more points."},
  {key:"electricity",name:"Electricity Payment Timeliness",value:`${a.sources.electricity.delay} days average delay`,points:elec,max:WEIGHTS.electricity,explanation:"0 days receives full points; 15+ days receives zero."},
  {key:"upi",name:"UPI Transaction Activity",value:`${a.sources.upi.transactions}/month · ₹${Number(a.sources.upi.value).toLocaleString("en-IN")}`,points:upi,max:WEIGHTS.upi,explanation:"Transaction volume and UPI value are compared with the business revenue."},
  {key:"stability",name:"Revenue Stability",value:`${a.volatility}% volatility`,points:stability,max:WEIGHTS.stability,explanation:"Lower reported revenue volatility contributes more points."},
  {key:"loan",name:"Loan Repayment History",value:a.existingLoan?(a.repayment==="always"?"Always on time":a.repayment==="occasional"?"Occasional delays":"Has defaulted"):"No prior loan",points:loan,max:WEIGHTS.loan,explanation:"No prior loan receives a neutral half-weight score."},
  {key:"maturity",name:"Business Maturity",value:`${a.years} years`,points:maturity,max:WEIGHTS.maturity,explanation:"10 or more years receives the full maturity weight."}
 ];
 const score=Math.round(clamp(parts.reduce((s,p)=>s+p.points,0),0,100));
 const grade=score>=85?"A":score>=75?"B+":score>=65?"B":score>=50?"C":"D";
 const mult={A:4,"B+":3,B:2.5,C:1.5,D:0}[grade];
 const limit=mult?Math.min(Number(a.loanAmount||0),Number(a.monthlyRevenue||0)*mult):0;
 const tenure={A:12,"B+":9,B:6,C:3,D:null}[grade];
 return {...a,score,grade,parts,limit,tenure};
}
function saveApplication(a){const scored=scoreApplication(a);set(KEY,scored);return scored}
function getApplication(){return get(KEY,null)}
function getQueue(){return get(QUEUE,[])}
function saveQueue(q){set(QUEUE,q)}
function formatINR(n){return n?"₹"+Number(n).toLocaleString("en-IN"):"₹0"}
function eligibleLenders(app){return LENDERS.map(l=>({...l,eligible:app.score>=l.min,limit:app.score>=l.min?Math.min(app.limit,l.cap):0,tenure:app.tenure?clamp(app.tenure,l.minTenure,l.maxTenure):null,need:Math.max(0,l.min-app.score)})).sort((a,b)=>(b.eligible-a.eligible)||((b.limit||0)-(a.limit||0))||a.need-b.need)}
function addToQueue(lender){
 const a=getApplication(); if(!a)return null;
 const q=getQueue(); const existing=q.find(x=>x.applicationId===a.id&&x.lender===lender.name);
 if(existing)return existing;
 const item={...a,applicationId:a.id||("APP-"+Date.now()),id:"Q-"+Date.now()+Math.random().toString(16).slice(2),lender:lender.name,status:"New",submittedAt:Date.now(),sample:false};
 q.push(item);saveQueue(q);return item;
}
function createId(){return "APP-"+Date.now()}
window.CB={KEY,QUEUE,WEIGHTS,LENDERS,SECTORS,STATES,get,set,remove,scoreApplication,saveApplication,getApplication,getQueue,saveQueue,formatINR,eligibleLenders,addToQueue,createId};
})();