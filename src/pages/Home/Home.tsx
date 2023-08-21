import React, { useState, useEffect } from "react";
import { auth, firestore } from "../../config/firebase";
import { DocumentSnapshot, collection, getDocs, query, where } from "firebase/firestore";
import './home.css';
import { useAuthState } from "react-firebase-hooks/auth";

interface ChallanType {
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

export function Home() {
    const [month, setMonth] = useState(new Date().toDateString());
    const [resultData, setResultData] = useState({
        totalCount: 0,
        pendingCount: 0,
        paidCount: 0,
        totalPendingAmount: 0,
        totalPaidAmount: 0,
        pendingChallans: [] as ChallanType[],
        paidChallans: [] as ChallanType[],
    });

    const [user] = useAuthState(auth);

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value).toDateString();
        setMonth(date);
    };

    const fetchData = async () => {
        if(!user){
            return;
        }
        try {
            const date = new Date(month);
            const monthYear = date.getMonth().toString() + date.getFullYear().toString();

            const querySnapshot = await getDocs(query(collection(firestore, "challans"), where('monthYear', '==', monthYear)))

            let totalCount = 0;
            let pendingCount = 0;
            let paidCount = 0;
            let totalPendingAmount = 0;
            let totalPaidAmount = 0;
            const pendingChallansArray: ChallanType[] = [];
            const paidChallansArray: ChallanType[] = [];

            querySnapshot.forEach((doc: DocumentSnapshot) => {
                const challanData = doc.data() as ChallanType;
                totalCount++;

                if (challanData.status === "Pending") {
                    pendingCount++;
                    totalPendingAmount += challanData.totalFee;
                    pendingChallansArray.push(challanData);
                } else if (challanData.status === "Paid") {
                    paidCount++;
                    totalPaidAmount += challanData.totalFee;
                    paidChallansArray.push(challanData);
                }
            });

            setResultData({
                totalCount,
                pendingCount,
                paidCount,
                totalPendingAmount,
                totalPaidAmount,
                pendingChallans: pendingChallansArray,
                paidChallans: paidChallansArray,
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    })

    return (
        <div>
            {user ?
                <div className="filters">
                    <br></br>
                    Select Fee Month: <input onChange={handleMonthChange} type="date" />
                    <hr></hr>
                    <br></br>
                    <div className="graphs">
                        <div className="graph">
                            <h2>Challan Count Comparison</h2>
                            <div className="bar">
                                {resultData.paidCount &&
                                    <div
                                        className="bar-segment"
                                        style={{ width: `${(resultData.paidCount / resultData.totalCount) * 100}%` }}
                                    >
                                        Paid: {resultData.paidCount ? resultData.paidCount : ""}
                                    </div>
                                }

                                {
                                    resultData.pendingCount &&
                                    <div
                                        className="bar-segment"
                                        style={{ width: `${(resultData.pendingCount / resultData.totalCount) * 100}%` }}
                                    >
                                        Pending: {resultData.pendingCount ? resultData.pendingCount : ""}
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="graph">
                            <h2>Amount Comparison</h2>
                            <div className="bar">
                                {
                                    resultData.totalPaidAmount &&
                                    <div
                                        className="bar-segment"
                                        style={{ width: `${(resultData.totalPaidAmount / (resultData.totalPendingAmount + resultData.totalPaidAmount)) * 100}%` }}
                                    >
                                        Paid: Rs.{resultData.totalPaidAmount}
                                    </div>
                                }
                                {
                                    resultData.totalPendingAmount &&
                                    <div
                                        className="bar-segment"
                                        style={{ width: `${(resultData.totalPendingAmount / (resultData.totalPendingAmount + resultData.totalPaidAmount)) * 100}%` }}
                                    >
                                        Pending: Rs.{resultData.totalPendingAmount}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <hr></hr>
                    <div className="top-pending">
                        <h2>Top 5 Pending Challans</h2>
                        <ul>
                            {resultData.pendingChallans
                                .sort((a, b) => b.totalFee - a.totalFee)
                                .slice(0, 5)
                                .map((challan) => (
                                    <li key={challan.id}>
                                        <strong>Roll No:</strong> {challan.rollNo},{" "}
                                        <strong>Name:</strong> {challan.studentName},{" "}
                                        <strong>Total Fee:</strong> Rs. {challan.totalFee},{" "}
                                        <strong>Due Date:</strong> {challan.dueDate}
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            : <h3>Login to continue</h3>}
        </div>
    );
}
