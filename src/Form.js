import {useRef, useState} from 'react'

function removeDoubleLast (array){
    for (let i=0;i<array.length-1;i++) {
        if(array[i].fullname.split(/\s/)[0]===array[i+1].fullname.split(/\s/)[0]){
        array.splice(i,1,null)
        }
    } 
} 

function removeDoubleFirst(array){
    for (let i=0;i<array.length-1;i++) {
        if(array[i].fullname.split(/\s/)[1]===array[i+1].fullname.split(/\s/)[1]){
         array.splice(i,1,null)
        }
    } 
}

function removeDoubleName(array) {
    for (let i=0;i<array.length-1;i++){
        if(array[i].fullname===array[i+1].fullname){
           array.splice(i,1,null)
        }
    }
}

function removeDoubleNameSum(array) {
    for (let i=0;i<array.length-1;i++){
        if(array[i].fullname===array[i+1].fullname){
            array[i+1].amount = array[i+1].amount + array[i].amount
            array.splice(i,1,null)
        }
    }
}

function removeDoubleDateSum(array) {
    for (let i=0;i<array.length-1;i++){
        if(array[i].date===array[i+1].date){
            array[i+1].amount = array[i].amount + array[i+1].amount
            array.splice(i,1,null)
        }
    }
}

function getMaxValue(array){
    const maxVal = array.map(item=>item.amount).reduce((max, prop)=>{
    if(prop>max){return prop}
    else {return max}
    },0)
    return maxVal
}

function getSum(total, number){
    return total+number
}

function updateContragent(e,_id){
     fetch('/merchants/update', {
      method: "PUT",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
      question: e.target.value,
      _id:_id})
    })
    .then(response=> {
      return response.text()
   }).then(data=>{
    alert (data);
   });
}

export const Activity = ({someactivity, type, rangeAmount, rangeDate,color})=>{
    if(someactivity){
        const _someData = structuredClone(someactivity)
        .sort((a,b)=> (a.fullname>b.fullname)?1:((a.fullname<b.ffullname)?-1:0))
        if(!rangeDate){
            removeDoubleNameSum(_someData)}else{removeDoubleDateSum(_someData)
        }
        const someData = _someData.filter(item=>item!==null)
        const maxVal = getMaxValue(someData)
        const perPixel = maxVal/400
        if(!rangeAmount&&!rangeDate){
            return(
                <div className = "wrapper">
                    <div style = {{marginTop:"25px" ,borderBottom:`2px solid ${color}`, marginBottom:"10px"}}><h3>{type}</h3></div>
                   {someData.map((item,i)=>
                    <li className = "activity" key = {i} >
                        <div>{item.fullname}</div>
                        <div>{item.amount}</div>
                        <div style = {{backgroundColor:`${color}`, width:`${item.amount/perPixel}px`, height:"20px"}}></div>
                    </li>)}
                </div>
            )
        }
        else 
        if(rangeAmount&&!rangeDate){
            return(
                <div className="wrapper">
                    <div style = {{borderBottom:`2px solid ${color}`, marginBottom:"10px"}}><h3>{type}</h3></div> 
                    {someData
                    .sort((a,b)=>(parseInt(a.amount)<parseInt(b.amount)?1:(parseInt(a.amount)>parseInt(b.amount)?-1:0)))  
                    .map((item,i)=>
                    <li className = "activity" key = {i} >
                        <div>{item.fullname}</div>
                        <div>{item.amount}</div>
                        <div style = {{backgroundColor:`${color}`, width:`${item.amount/perPixel}px`, height:"20px"}}></div>
                    </li>)}
               </div>)
        }
        else 
        if(!rangeAmount&&rangeDate){
            return(
                <div className = "wrapper">
                    <div style = {{borderBottom:`2px solid ${color}`, marginBottom:"10px"}}><h3>{type}</h3></div>
                    {someData
                    .sort((a,b)=>(a.date>b.date)?1:(a.date<b.date)?-1:0)
                    .map((item,i)=>
                    <li className="activity"  key = {i} >
                        <div>{item.date} </div>
                        <div>{item.amount}</div>
                        <div style = {{backgroundColor:`${color}`, width:`${item.amount/perPixel}px`, height:"20px"}}></div>
                    </li>)}
                </div>)
        }
    } 
}

const PersonalActivity = ({type, activity, somearray,someref})=>{   
    const noteRef = useRef() 
    if(somearray&&activity) {
        console.log(somearray,activity)
        return(
            <div>
        <div style = {{textTransform:"capitalize"}}>{type}:{activity}</div>
        {(somearray&&somearray.length!==0)?
        somearray.filter(item=>`${item.fullname}`===someref.current.value)
                 .filter(item=>item.type===`${type}`)
                 .sort((a,b)=>(a.date>b.date)?1:(a.date<b.date)?-1:0)
                 .map((item, i)=>
                    <li key = {i}>
                        {item.date}:{item.amount}
                        <textarea style ={{position:"relative", top:"10px", left:"10px"}} defaultValue = {item.question} onMouseOver= {()=>noteRef.current.className = "comments1" } onClick = {()=>noteRef.current.className = "comments"} onMouseLeave={()=>noteRef.current.className = "comments" }onBlur = {(e)=>updateContragent(e,item._id)}></textarea>
                        <span ref = {noteRef} className = "comments">Change note?</span>
                    </li>):null}
            </div>
        )
    } 
}

export const Contragent =({data, sumincome, sumoutcome, sumloans, suminvest})=>{
    const [sumIncome0, setSumIncome0] = useState()
    const [sumOutcome0, setSumOutcome0] = useState()
    const [sumLoans0, setSumLoans0] = useState()
    const [sumInvest0, setSumInvest0] = useState()
    const [reg, setReg] = useState()

    const selectRef = useRef('')

    function changeInput(e) {
        const reg1= e.target.value
        setReg(reg1)
        console.log(reg)
    }
    const n = new RegExp(reg)

    function getPersonal(someData,selectref){
        console.log(someData)
        return (someData&&someData.length!==0)?someData.filter(item=>`${item.fullname}`===selectref.current.value)
                                                       .map(item=>JSON.parse(item.amount))
                                                       .reduce(getSum,null):null
    }

    function showContragent(){
        const incomes = getPersonal(sumincome, selectRef)
        const outcomes = getPersonal(sumoutcome,selectRef)
        const loans =  getPersonal(sumloans,selectRef)
        const investments = getPersonal(suminvest, selectRef)
        console.log(incomes,outcomes,loans, investments)
        setSumIncome0(incomes)
        setSumOutcome0(outcomes)
        setSumLoans0(loans)
        setSumInvest0(investments)
    }

    if(data){
    console.log(data)
    let _someData
    _someData = structuredClone(data).sort((a,b)=>(a.fullname>b.fullname)?1:((a.fullname<b.fullname)?-1:0))
    removeDoubleName(_someData)
    const list  = _someData.filter(item=>item!==null)

    const sho = (_id) =>{
        console.log(list)
        const name1 = list.filter(item=>item._id===_id)
        selectRef.current.value=name1[0].fullname
        console.log(name1)
    }

    if(selectRef.current.value===''){
        return (<div className = "wrapper">
                    <input ref = {selectRef} onChange = {changeInput}></input>
                        {list.map((item,i)=>
                        <li className = "showcontragent" key ={item._id} onClick = {()=>sho(item._id)}>{item.fullname}</li>)}
                    <button onClick ={showContragent}>Show</button>
                </div>)
            } else {
        return (
                <div className = "wrapper"                >
                    <input  ref = {selectRef} onChange ={changeInput}></input>
                    {(list&&list.length!==0)?
                    list.filter(item=>n.test(item.fullname))
                    .map(item =>
                    <li className = "showcontragent" key ={item._id} onClick = {()=>sho(item._id)}>{item.fullname}</li>)
                    :null} 
                    <div> 
                        <button onClick ={showContragent}>Show</button>
                        <h3>{selectRef.current.value}</h3>
                        <PersonalActivity type = "income" activity = {sumIncome0} somearray = {sumincome} someref = {selectRef}/>
                        <PersonalActivity type = "outcome" activity = {sumOutcome0} somearray = {sumoutcome} someref = {selectRef}/>
                        <PersonalActivity type = "loan" activity = {sumLoans0} somearray = {sumloans} someref = {selectRef}/>
                        <PersonalActivity type = "investment" activity = {sumInvest0} somearray = {suminvest} someref = {selectRef}/> 
                    </div>
                </div>
                )
            }
        }
    } 

export const Summary = ({sumincome, sumoutcome, sumloans, suminvest})=> {
     function getEveryAmount(array) {
        if(array){
      const summ = array.map(item=>JSON.parse(item.amount)).reduce(getSum,0)
      return summ
    }
}
   const uu = [sumincome,sumoutcome, sumloans,suminvest].map(item=>getEveryAmount(item))
      
      console.log(uu)
    
    function gmv1 (array){
const maxVal = array.reduce((max, prop)=>{
    if(prop>max){return prop}
    else {return max}
    },0)
    console.log(maxVal)
    return maxVal
}
   
  const yu = gmv1(uu)
  console.log(yu)
     
     const getSummary =(someData, trans) => {
        if(someData&&someData.length!==0){
            const totalCount = someData.length
            const totalAmount =someData.map((item)=>JSON.parse(item.amount)).reduce(getSum,0)
            console.log(totalAmount)
        
            return (someData&&someData.length!==0)?
                <div className = "summaryclass">
                    <div className = "trans">{trans}</div>
                    <div>{totalCount}</div>
                    <div id ="color" style =  {{backgroundColor:(trans==="income")?"red":(trans ==="outcome")?"steelBlue":(trans ==="loan")?"yellow":"lightgreen", width:`${totalAmount/yu*400}px`, height:"20px"}}></div>
                    <div style ={{textAlign:"left"}}>{totalAmount}</div>
                </div>
                    :null}
        else {
            return (
                <div className = "summaryclass">
                    <div className = "trans">{trans}</div>
                    <div>-</div>
                    <div>No {trans} at this period</div>
                    <div>No</div>
                </div>
            )}
        }
    return(
      <div>
             <ul className = "summary">
                <li className="summaryheader"><h3> </h3><h3>Count</h3><h2>Summary</h2><h3>Amount</h3></li>
                <li>{getSummary(sumincome, "income")}</li>
                <li>{getSummary(sumoutcome, "outcome")}</li>
                <li>{getSummary(sumloans, "loan")}</li>
                <li>{getSummary(suminvest, "investment")}</li>
            </ul>
      </div>
    )
  }

   export const Transaction=({data})=>{
    const lnRef = useRef()
    const fnRef =  useRef()
    const amRef = useRef()
    const trRef = useRef() 
    const mailRef = useRef()
    const numRef = useRef()
    const adRef = useRef()
    const dateRef = useRef()
    const qRef = useRef()
  
   const [l, setL]= useState()
   const [f, setF] = useState()
   const [viewLast,setViewLast]= useState(false)
   const [viewFirst,setViewFirst]= useState(false)
   const [viewInfo, setViewInfo] = useState(true)
   const [checkbox, setCheckbox] = useState(false)
  
  const submit=(e)=>{
    e.preventDefault()
    createContragent()
    .then(res =>{
    console.log(res)
    })
    .catch(err =>console.log(err))
    lnRef.current.value=''
    fnRef.current.value=''
    amRef.current.value=''
    trRef.current.value=''  
    mailRef.current.value='' 
    numRef.current.value=''
    adRef.current.value=''
    dateRef.current.value=''
    qRef.current.value = ''
    } 
    
  async function createContragent(){
    const response = await fetch('/contragents', {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
        },
      body:JSON.stringify({
        _id: Math.floor(Math.random()*1000),
        fullname:`${lnRef.current.value} ${fnRef.current.value}`,
        date:dateRef.current.value,
        type:trRef.current.value.toLowerCase(),
        amount:amRef.current.value,
        email: mailRef.current.value,
        phone:numRef.current.value,
        address:adRef.current.value,
        question:qRef.current.value
        })
    })
    const body = await response.json()
    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };
  
  let  lastName,firstName;
    const lastname = (e) =>{
      const l1 = e.target.value
      setL(l1)
      console.log(l1)
      setViewLast(true)
      if(lastName&&lastName.length!==0){
        for (let i of firstName){
          if(e.target.value===i.fullname.split(/\s/)[0]||!ln.test(i.fullname.split(/\s/)[0])){setViewLast(false)}
            }
      }
    }
     
   const ln= new RegExp(l)
  
   const firstname = (e)=>{
    const f1 = e.target.value
    setF(f1)
    const fn = new RegExp(f1)
    if(firstName&&firstName.length!==0){
      for (let i of firstName){
        if(e.target.value===i.fullname.split(/\s/)[1]||!fn.test(i.fullname.split(/\s/)[1])){setViewFirst(false)}
      }
    } 
   }
  
    if(data&&l){
        const lastName1 = data.filter(item=>ln.test(item.fullname.split(/\s/)[0])).sort((a,b)=>(a.fullname.split(/\s/)[0] > b.fullname.split(/\s/)[0]) ? 1 :((b.fullname.split(/\s/)[0] > a.fullname.split(/\s/)[0]) ? -1: 0))
        removeDoubleLast(lastName1)
        console.log(lastName1)
        lastName = lastName1.filter(item=>item!==null)
        const firstName1 = data.filter(item=>item.fullname.split(/\s/)[0]===lnRef.current.value).sort((a,b)=>(a.fullname.split(/]s/)[1] > b.fullname.split(/\s/)[1]) ? 1 :((b.fullname.split(/\s/)[1] > a.fullname.split(/\s/)[1]) ? -1: 0))
    removeDoubleFirst(firstName1)
    firstName = firstName1.filter(item=>item!==null)
        
        for (let i of data) {
        if (i.fullname.split(/\s/)[0]===lnRef.current.value&&i.fullname.split(/\s/)[1]===fnRef.current.value){
        mailRef.current.value = i.email;
        numRef.current.value = i.usernumber;
        adRef.current.value = i.address;
        } 
      }
    }
  
    const onClickLast = (_id) =>{
       const name1 = lastName.filter(item=>item._id===_id)
       lnRef.current.value=name1[0].fullname.split(/\s/)[0]
       setViewFirst(true)
       setViewLast(false)
       firstName = lastName.filter(item=>lnRef.current.value===item.fullname.split((/\s/)[0]))
                           .sort((a,b)=>(a.fullname.split(/\s/)[0] > b.fullname.split(/\s/)[0]) ? 1 :((b.fullname.split(/\s/)[0] > a.name.last) ? -1: 0))
    } 
    
  
    const onClickFirst = (_id) =>{
        const name1 = firstName.filter(item=>item._id===_id)
        fnRef.current.value=name1[0].fullname.split(/\s/)[1]
        setViewFirst(false)
        if(lnRef.current.value!==null&&fnRef.current.value!==null){
          const newData = data.filter(item=>(item.fullname.split(/\s/)[0]===lnRef.current.value&&item.fullname.split(/\s/)[1]===fnRef.current.value))
                          .sort((a,b)=>(a.date>b.date)?1:((b.date>a.date)?-1:0))
                          const newData1 = newData.slice(2,1)
                          setCheckbox(true)
        }
    }
        
      return(
        <div>
            <form className = "form" onSubmit ={submit} autoComplete = "off">  
              <div className="form-zvonok"> 
                <label>Transaction <span>*</span></label>
                <select type='text' name='transactiontype' ref ={trRef}>
                    <option>Income</option>
                    <option>Outcome</option>
                    <option>Loan</option>
                    <option>Investment</option>
                </select>
                <label>Date <span>*</span></label>
                <input type='date' name='date' ref = {dateRef} required/>
                <label>Last name <span>*</span></label>
                <input type='text' name='userlastname' ref = {lnRef} onChange = {lastname} required/>
                <ul className = {(viewLast)?"visiblement":"cached"}> {(lastName&&lastName.length!==0)?(lastName.map((item, i)=><li key = {i} onClick = {()=>onClickLast(item._id)}>{item.fullname.split(/\s/)[0]}</li>)):null}</ul>
                <label>First name <span>*</span></label>
                <input type='text' name='userfirstname' ref = {fnRef} onChange ={firstname} required/>
                <ul className = {(viewFirst)?"visiblement":"cached"}>{(firstName&&firstName.length!==0)?(firstName.map((item, i)=><li key = {i} onClick = {()=>onClickFirst(item._id)}>{item.fullname.split(/\s/)[1]}</li>)):null}</ul>
                <label>Amount <span>*</span></label>
                <input type='number' name='amount' ref = {amRef} required/>
                {<div className = {(!checkbox)?"cached":"visiblement_ info" }><label>Change personal data</label><input type = "checkbox"  onChange = {()=>setViewInfo(!viewInfo)}></input></div>}
                    <div className = {(viewInfo)?"info":"noinfo"}>
                        <label>E-mail <span>*</span></label>
                        <input type='text' name='usermail' ref = {mailRef}/>
                        <label>Phone <span>*</span></label>
                        <input type='text' name='usernumber' ref = {numRef}/>
                        <label>Address <span>*</span></label>
                        <input type='text' name='address'ref = {adRef}/>
                        <label>Notes</label>
                    </div>
                <textarea className = "text" type='text' name='question' ref = {qRef}/>
                <input className="bot-send-mail" type='submit' value='Send'/>
              </div>
            </form>
        </div>
      )
  }   