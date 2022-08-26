import './App.css';
import {Routes, Route , Link }from 'react-router-dom';
import dataFromFile from "./list.json"
import { useState, useRef, useEffect } from 'react';
import {Activity, Contragent, Summary, Transaction} from './Form'

const copiedData = structuredClone(dataFromFile)
const data1 = copiedData.data.map(item=>renameProperty(item, 'name','fullname'))

function renameProperty(obj, oldKey,newKey){
    obj[newKey] = `${obj[oldKey].last} ${obj[oldKey].first}`
    delete obj[oldKey]
    return obj
}

function toLocale(array) {
    for(let i of array){
      i.date = new Date(i.date).toLocaleDateString()
       i.date = i.date.split(/\./).reverse().join('-')
      console.log(i.date)}
      const sortedArray = array.sort((a,b)=>(a.date>b.date)?1:(a.date<b.date)?-1:0)
   return sortedArray
  }

  const App=() =>{
   
    const [data, setData] = useState(data1)
    const [sumIncome, setSumIncome] = useState()
    const [sumOutcome, setSumOutcome] = useState()
    const [sumLoan, setSumLoan] = useState()
    const [sumInvest, setSumInvest] = useState()
  
    const [dateData, setDateData] = useState(structuredClone(data1))
    const [rangeAmount, setRangeAmount] = useState(false)
    const [rangeDate, setRangeDate] = useState(false)
    const [serverActivated, setServerActivated] = useState(false)
  
    const calRef = useRef()
    const selectRef1 = useRef()

    useEffect(()=> {
      const sumIncome1 = data.filter(item=>item.type === 'income')
      const sumOutcome1  = data.filter(item=>item.type === 'outcome')
      const sumLoan1  = data.filter(item=>item.type === 'loan')
      const sumInvest1 = data.filter(item=>item.type === 'investment')
      setSumIncome(sumIncome1)
      setSumOutcome(sumOutcome1)
      setSumLoan(sumLoan1)
      setSumInvest(sumInvest1)
    },[data])

    useEffect(()=> {
      const sumIncome1 = dateData.filter(item=>item.type === 'income')
      const sumOutcome1  = dateData.filter(item=>item.type === 'outcome')
      const sumLoan1  = dateData.filter(item=>item.type === 'loan')
      const sumInvest1 = dateData.filter(item=>item.type === 'investment')
      setSumIncome(sumIncome1)
      setSumOutcome(sumOutcome1)
      setSumLoan(sumLoan1)
      setSumInvest(sumInvest1)
    },[dateData])

    const Date=()=>{
      if(selectRef1.current&&calRef.current.value!==''){
          return(
          <h3>Data {selectRef1.current.value} {calRef.current.value} shown</h3>
      )
      } else {return null}
    }

    function getContragents() {
      fetch('/m')
        .then(response => {
          return response.text();
        })
        .then(data => {
          const id1= JSON.parse(data)
          const id = toLocale(id1)
          setData(id);
          console.log(data)
        });
    }

    function getTimes() {
      const date = calRef.current.value
      const sign = selectRef1.current.value
      console.log(calRef.current.value)
      if(calRef.current.value){     
        fetch('/times',  {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({
            sign:sign,
            date:date}),
          })
            .then(response => {
              return response.text();
            })
            .then(data => {
              const id1= JSON.parse(data)
              const id = toLocale(id1)
              setDateData(id)
              console.log(id)
            });
            } else {
              getContragents()
            }
        }

    function startServer(){
      setServerActivated(!serverActivated)
      if(!calRef.current.value){
        getContragents()
      } else {
        getTimes()
      }
    }

    function getServerData(){
      if(serverActivated){
        getContragents()
      }
    }

    function rangeByAmount(){
      setRangeAmount(!rangeAmount)
      setRangeDate(false)
    }
    
    function rangeByDate(){
      setRangeDate(!rangeDate)
      setRangeAmount(false)
    }

    const calendarFunc =()=>{
      let calendar;
        if(!serverActivated){
          calendar = (data.sort((a,b)=>(a.date<b.date)?1:(a.date>b.date)?-1:0).filter(item=>{
          return (selectRef1.current.value==="Before")?item.date<calRef.current.value:
                (selectRef1.current.value==="Until")?item.date<=calRef.current.value:
                (selectRef1.current.value==="For")?item.date===calRef.current.value:
                (selectRef1.current.value==="From")?item.date>=calRef.current.value:
                (selectRef1.current.value ==="After")?item.date>calRef.current.value:null
          }));
          setDateData(calendar)
        } else {
          getTimes()
        }
    } 

    return(
        <div className ="wrapper1"> 
          <div className = "tablo" onClick = {getServerData}>
              <nav className = "navpanel">
                  <ul> 
                    <Link to = "/tab=5"><li>New transaction</li></Link>
                    <Link to = "/tab=0"><li>Income</li></Link>
                    <Link to = "/tab=1"><li>Outcome</li></Link>
                    <Link to = "/tab=2"><li>Loans</li></Link>
                    <Link to = "/tab=3"><li>Investments</li></Link>
                    <Link to = "/tab=4"><li>Contragents</li></Link>
                    <Link to = "/"><li>Summary</li></Link>
                </ul>
              </nav>
          </div>
          <div className="wrapper">
              <input type = "date" ref = {calRef} onInput = {calendarFunc}/>
              <select ref = {selectRef1} onChange = {calendarFunc}>
                <option>Before</option>
                <option>Until</option>
                <option>For</option>
                <option>From</option>
                <option >After</option>
              </select> 
              Range by: amount<input type = "checkbox" onChange={rangeByAmount}></input>
              date<input type = "checkbox" onChange={rangeByDate}></input>
              Activate server<input type = 'checkbox' onChange = {startServer}></input>
          </div>
          <Date cref = {calRef} sref = {selectRef1}/>
          <Routes>
              <Route path = "/tab=0" element ={<Activity someactivity = {sumIncome} type = "Income" rangeAmount = {rangeAmount} rangeDate = {rangeDate} color ="red"/>}/>
              <Route path = "/tab=1" element ={<Activity someactivity = {sumOutcome} type = "Outcome" rangeAmount = {rangeAmount} rangeDate = {rangeDate} color ="steelBlue"/>}/>
              <Route path = "/tab=2" element ={<Activity someactivity = {sumLoan} type = "Loan" rangeAmount = {rangeAmount} rangeDate = {rangeDate} color = "yellow"/>} />
              <Route path = "/tab=3" element ={<Activity someactivity = {sumInvest} type  = "Investment"rangeAmount = {rangeAmount} rangeDate = {rangeDate} color = "lightgreen"/>}/>
              <Route path = "/tab=4" element ={<Contragent data = {data} server = {serverActivated} 
                                                                        sumincome = {sumIncome}
                                                                        sumoutcome = {sumOutcome}
                                                                        sumloans = {sumLoan}
                                                                        suminvest = {sumInvest}/>}/>
              <Route path = "/" element ={<Summary data = {data} sumincome = {sumIncome}
                                                                sumoutcome = {sumOutcome}
                                                                sumloans = {sumLoan}
                                                                suminvest = {sumInvest}/>}/>
              <Route path = "/tab=5" element ={<Transaction data={data}/>}/>
          </Routes> 
        </div>
      )
    }

  export default App;
