import * as yup from 'yup'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import { addDoc,collection } from 'firebase/firestore';
import{firestore} from '../../config/firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

export function StudentForm(){
   
    interface studentFormData{
        fullName:string;
        remarks:string;
        fatherName:string;
        admissionFee:number;
        monthlyFee:number;
        class:string;
        rollNo:string;
    }

    const studentSchema = yup.object().shape({
        fullName:yup.string().required(),
        remarks:yup.string().required(),
        fatherName:yup.string().required(),
        admissionFee:yup.number().integer().positive().required(), 
        monthlyFee:yup.number().integer().positive().required(),
        class:yup.string().required(),
        rollNo:yup.string().required(),
    })

    interface studentType{
        fullName:string;
        remarks:string;
        fatherName:string;
        admissionFee:number;
        monthlyFee:number;
        class:string;
        rollNo:string;
        status:string;
        userid:string;
        date:string;
    }

    const navigate = useNavigate()

    const postRef = collection(firestore,"students")
    
    const {handleSubmit, register, formState:{errors}} = useForm<studentFormData>({
        resolver:yupResolver(studentSchema),
    })

    const [user] = useAuthState(auth)
    const postSubmit = async (data : studentFormData) => {
        const postData : studentType  = {
            ...data,
            userid : user?.uid || "",
            status:"Active",
            date: new Date().toDateString()
        }
        const result = await addDoc(postRef,postData)
        if(result){
            alert("Student Added successfully.")
            navigate('/create-student')
        }
    }

    return (
        <form onSubmit={handleSubmit(postSubmit)}>
            <input type='text' placeholder='Enter Student Full Name...' {...register("fullName")} />
            <p style={{color:'red'}}>{errors.fullName?.message}</p>
            <br></br>
            <input type='text' placeholder='Enter Student Father Name...' {...register("fatherName")} />
            <p style={{color:'red'}}>{errors.fatherName?.message}</p>
            <br></br>
            <input type='text' placeholder='Enter Student Roll No...' {...register("rollNo")} />
            <p style={{color:'red'}}>{errors.rollNo?.message}</p>
            <br></br>
            <input type='number' placeholder='Enter Student Monthly Fee...' {...register("monthlyFee")} />
            <p style={{color:'red'}}>{errors.monthlyFee?.message}</p>
            <br></br>
            <input type='number' placeholder='Enter Student Admission Fee...' {...register("admissionFee")} />
            <p style={{color:'red'}}>{errors.admissionFee?.message}</p>
            <br></br>
            <input type='text' placeholder='Enter Student Class...' {...register("class")} />
            <p style={{color:'red'}}>{errors.class?.message}</p>
            <br></br>
            <textarea placeholder='Enter Remarks...' {...register("remarks")}/>
            <p style={{color:'red'}}>{errors.remarks?.message}</p>
            <input className='post-submit' type='submit' value="Create Student" />
        </form>
    )
}