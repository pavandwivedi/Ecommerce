import React,{useState} from 'react'
import "../../styles/AuthStyles.css";
import Layout from '../../components/Layout/Layout'
//  import {toast} from 'react-toastify'
import { toast } from 'react-hot-toast';
 import 'react-toastify/dist/ReactToastify.css'; // necessary CSS
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function Register() {

const [name,setName] = useState("");
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [phone,setPhone] = useState("")
const [address,setAddress] = useState("")
const [answer,setAnswer] = useState("")
const navigate = useNavigate();
// form function


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, {
      name,
      email,
      password,
      phone,
      address,
      answer,
    });

    if (res.data && res.data.success === true) {
      toast.success(res.data.message);
      navigate('/login');
    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error('Something went wrong');
  }
};

   
// console.log(process.env.REACT_APP_API)
  
  return (
       <>
       <Layout title={"Register-Ecommerce App"}>

    <div className='form-container' style={{minHeight:"90vh"}}>

       
   <form onSubmit={handleSubmit}>

  <div className="mb-3">
    <h1 className="title">REGISTER NOW</h1>
    <input type="text" value={name} onChange={(e)=>setName(e.target.value)}  className="form-control" id="exampleInputName" aria-describedby="emailHelp" placeholder='Enter Your Name' required />
</div>

  <div className="mb-3">

    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Email Address' required autoFocus/>
    
  </div>

  <div className="mb-3">
   
    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder='Password' required/>
  </div>

  <div className="mb-3">
    
    <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} className="form-control" id="exampleInputPhone" placeholder='Enter Your Phone' required  />
    </div>
    <div className="mb-3">
   
    <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)} className="form-control" id="exampleInputAddress" placeholder='Enter address'required />
  </div>


    <div className="mb-3">
   
    <input type="text" value={answer} onChange={(e)=>setAnswer(e.target.value)} className="form-control" id="exampleInputAddress" placeholder='Your Favorite Sports'required />
  </div>
 
  

  <button type="submit"  className="btn btn-primary">Submit</button>
</form>
    </div>
</Layout>
    </> 
  )
}

export default Register
