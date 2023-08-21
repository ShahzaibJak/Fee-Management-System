import { useState } from 'react';
import './student-card.css'
import { EditStudent } from '../edit-student/edit-student';
import { doc, collection, updateDoc } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { PayChallan } from '../pay-challan/pay-challan';


interface propsType {
    student: {
        fullName: string;
        remarks: string;
        fatherName: string;
        admissionFee: number;
        monthlyFee: number;
        class: string;
        rollNo: string;
        userid: string;
        date: string;
        id: string;
        status: string;
    } | null,

}

export function StudentCard(props: propsType) {

    const [edit, setEdit] = useState(false);

    const navigate = useNavigate();

    const [pay, setPay] = useState(false)

    const docRef = doc(collection(firestore, "students"), props.student?.id)

    const handleEditChange = () => {
        setEdit(!edit)
    }

    const handlePayment = () => {
        setPay(!pay)
    }

    const handleStatusChange = () => {
        let status = "Active"

        if (status === props.student?.status) {
            status = "Disabled"
        }

        try {
            updateDoc(docRef, { status: status })
            alert("Student status changed to " + status)
            navigate("/search-student")
        } catch (error) {
            console.log("Error changing student status : " + error)
        }

    }

    const student = props.student;


    return (
        <div className="student-card">
            <div className='actions'>
                <b></b>
                <button onClick={handleEditChange}>Edit</button><br></br>
                {student?.status === "Active" && <><button onClick={handlePayment}>View Challan</button><br></br></>}
                <button onClick={handleStatusChange}>{props.student?.status === 'Active' ? 'Disable' : 'Enable'}</button>
            </div>
            <h3>Name : {props.student?.fullName}</h3>
            <p className="student-detail"><b>Father / Guardian Name :</b> {props.student?.fatherName} </p>
            <p className="student-detail"><b>Roll No :</b> {props.student?.rollNo} </p>
            <p className="student-detail"><b>Class : </b>{props.student?.class} </p>
            <p className="student-detail"><b>Remarks : </b>{props.student?.remarks} </p>
            {edit &&
                <div className='popup-overlay'>
                    <div className='popup-content'>
                        <EditStudent old={student} />
                        <button className="close-button" onClick={handleEditChange}>
                            Cancel
                        </button>
                    </div>
                </div>
            }

            {pay && student?.status === "Active" &&
                <div className='popup-overlay'>
                    <div className='popup-content'>
                        <PayChallan id={student?.id || ""} />
                        <button className="close-button" onClick={handlePayment}>
                            Cancel
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}