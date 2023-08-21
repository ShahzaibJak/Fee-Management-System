import { useState, useEffect } from "react";
import { collection, query, where, orderBy, limit, getDocs, updateDoc, doc } from "firebase/firestore";
import { firestore } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { ChallanPrint } from "../ChallanPrint/challan-print"; // Adjust the path to your PDF component
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';


interface propType {
    id: string;
}

interface challanType {
    rollNo: string;
    monthYear: string;
    date: string;
    dueDate: string;
    studentName: string;
    studentClass: string;
    monthlyFee: number;
    admissionFee: number;
    previousDues: number;
    studentId: string;
    status: string;
    totalFee: number;
    userid: string;
    id: string;
}

export function PayChallan(props: propType) {
    const [challan, setChallan] = useState<challanType | null>(null);
    const studentId = props?.id;
    const navigate = useNavigate()
    useEffect(() => {
        const fetchChallan = async () => {
            // Query the challans collection to get the latest document for the given student
            const challanQuerySnapshot = await getDocs(
                query(
                    collection(firestore, "challans"),
                    where("studentId", "==", studentId),
                    orderBy("date", "desc"), // Order by date in descending order
                    limit(1) // Retrieve only one document (the latest)
                )
            );

            // Check if there's a matching challan
            if (!challanQuerySnapshot.empty) {
                const latestChallan = { ...challanQuerySnapshot.docs[0].data(), id: challanQuerySnapshot.docs[0].id } as challanType;
                setChallan(latestChallan);
            }
            else {
                alert("Student has no challan")
                navigate('/student-search')
            }
        };
        fetchChallan();
    }, [studentId]);

    const generatePdfDocument = async (documentData: any) => {
        const blob = await pdf((
            <ChallanPrint
                challan={challan}
            />
        )).toBlob();
        saveAs(blob, challan?.studentName+'-'+challan?.date+'.pdf');
    };

    const handlePayment = async () => {
        try {
            await updateDoc(doc(collection(firestore, 'challans'), challan?.id), { status: "Paid" })
            alert("Payment Status Updated")
            navigate('/search-student')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="student-card">

            <h3>Name : {challan?.studentName}</h3>
            <p className="student-detail"><b>Date : </b> {challan?.date} </p>
            <p className="student-detail"><b>Roll No :</b> {challan?.rollNo} </p>
            <p className="student-detail"><b>Total Fee : </b> {challan?.totalFee} </p>
            <p className="student-detail"><b>Due Date : </b> {challan?.dueDate} </p>
            <p className="student-detail"><b>Status : </b> {challan?.status} </p>
            <p className="student-detail">
                <b>Payable Amount : </b>
                {(new Date(challan?.dueDate || "") > new Date()) ? challan?.totalFee : (challan?.totalFee || 0) + 100}
            </p>
            <button className="button" onClick={handlePayment}>Pay Challan</button><br></br>
            <button className="button" onClick={generatePdfDocument}>Print Challan</button><br></br>
        </div>
    );
}
