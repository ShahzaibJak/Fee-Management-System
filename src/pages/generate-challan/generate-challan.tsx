import { useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { auth, firestore } from "../../config/firebase";
import './generate-challan.css';
import { useAuthState } from "react-firebase-hooks/auth";

export function GenerateChallan() {
    // ... (interface definitions and state hooks)
    interface challan {
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
    }

    interface studentType {
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
    }

    const [month, setMonth] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");
    const studentCollection = collection(firestore, "students");
    const challanCollection = collection(firestore, "challans");
    const [user] = useAuthState(auth)

    const handleSubmit = async () => {
        const studentsToGenerateChallan: studentType[] = [];

        if ((!month || month === "") || (!dueDate || dueDate === "")){
            alert("Enter Fee and Due Date to generate Challans!")
            return;
        }

        // Get Month Year from the user-entered date
        const date = new Date(month);
        const monthYear = date.getMonth().toString() + date.getFullYear().toString();

        // Query the challans collection to get all challans for the given month+year
        const challanQuerySnapshot = await getDocs(
            query(challanCollection, where('monthYear', '==', monthYear))
        );

        const existingChallansMap: Record<string, boolean> = {};
        challanQuerySnapshot.forEach((doc) => {
            const challanData = doc.data() as challan;
            existingChallansMap[challanData.studentId] = true;
        });

        // Query the students collection to get all active students
        const studentQuerySnapshot = await getDocs(
            query(studentCollection, where('status', '==', 'Active'))
        );

        const lastMonth = (date.getMonth() === 0) ? 11 : date.getMonth() - 1;
        const lastYear = (lastMonth === 11) ? date.getFullYear() - 1 : date.getFullYear();
        const lastMonthYear = lastMonth.toString() + lastYear.toString();
        const lastMonthChallans: Record<string, challan> = {};
        console.log("Last Month Year" + lastMonthYear)
        const previousChallanQuerySnapshot = await getDocs(
            query(challanCollection, where('monthYear', '==', lastMonthYear))
        );

        previousChallanQuerySnapshot.forEach((doc) => {
            const challanData = doc.data() as challan;
            lastMonthChallans[challanData.studentId] = challanData;
        });

        studentQuerySnapshot.forEach((doc) => {
            const studentData = { ...doc.data(), id: doc.id } as studentType;

            if (!existingChallansMap[studentData.id]) {
                studentsToGenerateChallan.push(studentData);
            }
        });


        const generatedChallansPromises = studentsToGenerateChallan.map(async (student) => {

            let prevDues = 0;
            let admissionFee = 0;

            const lastMonthChallan = lastMonthChallans[student.id];
            console.log("last challan : " + JSON.stringify(lastMonthChallan))
            if (lastMonthChallan && lastMonthChallan.status === "Pending") {
                prevDues = lastMonthChallan.totalFee;
            } else {
                admissionFee = student.admissionFee;
            }

            // Create the new challan object
            const newChallan: challan = {
                studentName: student.fullName,
                rollNo: student.rollNo,
                monthYear: monthYear,
                date: date.toDateString(),
                dueDate: new Date(dueDate).toDateString(),
                studentClass: student.class,
                monthlyFee: student.monthlyFee,
                admissionFee: admissionFee,
                previousDues: prevDues,
                studentId: student.id,
                status: "Pending",
                totalFee: student.monthlyFee + prevDues + admissionFee,
                userid: user?.uid || ""
            };

            // Generate challans for the students in the studentsToGenerateChallan array
            try {
                await addDoc(challanCollection, newChallan);
            } catch (error) {
                console.log("Error adding challan:");
                console.log(error);
            }

        })

        // Wait for all the challans to be generated
        try {
            await Promise.all(generatedChallansPromises);
            alert("All challans have been generated successfully!");
        } catch (error) {
            console.log("Error generating challans:");
            console.log(error);
        }

    }

    return (
        <div>
            <div className="challan-form">
                <h3>Generate Challans</h3>
                Fee Date : 
                <input type="date" placeholder="Select Fee Month" onChange={(e) => setMonth(e.target.value)} /><br></br>
                Due Date :
                <input type="date" placeholder="Select Fee Due Date" onChange={(e) => setDueDate(e.target.value)} />
                <button onClick={handleSubmit}>Generate Fee Bills</button>
            </div>
        </div>
    )
}
