import { firestore } from '../../config/firebase';
import { getDocs, where, collection, query } from 'firebase/firestore';
import { useState } from 'react';
import { StudentCard } from '../../components/StudentCard/StudentCard';
import './search-student.css';

export function SearchStudent() {
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

    const [students, setStudents] = useState<studentType[]>([]);
    const [rollNo, setRollNo] = useState<string>("");
    const [name, setName] = useState<string>("");

    const handleNameChange = (event: any) => {
        setName(event.target.value);
    }

    const handleRollNoChange = (event: any) => {
        setRollNo(event.target.value);
    }

    const searchByName = async () => {
        const studentsRef = collection(firestore, 'students');
        const nameQuery = query(studentsRef, where('fullName', '==', name));

        try {
            const querySnapshot = await getDocs(nameQuery);
            if (!querySnapshot.empty) {
                const studentData: studentType[] = querySnapshot.docs.map(doc => ({
                    ...doc.data() as studentType,
                    id: doc.id
                }));
                setStudents(studentData);
            } else {
                setStudents([]); // No matching students found
                alert("Not Found");
            }
        } catch (error) {
            console.error('Error searching by name:', error);
        }
    };

    const searchByRollNo = async () => {
        const studentsRef = collection(firestore, 'students');
        const rollNoQuery = query(studentsRef, where('rollNo', '==', rollNo));

        try {
            const querySnapshot = await getDocs(rollNoQuery);
            if (!querySnapshot.empty) {
                const studentData: studentType[] = querySnapshot.docs.map(doc => ({
                    ...doc.data() as studentType,
                    id: doc.id
                }));
                setStudents(studentData);
            } else {
                setStudents([]); // No matching students found
                alert("Not Found");
            }
        } catch (error) {
            console.error('Error searching by roll number:', error);
        }
    };

    return (
        <div>
            <div className='search-form'>
                <h3>Search By Roll No. </h3>
                <input type='text' value={rollNo} placeholder='Enter Roll No. to Search Student ' onChange={handleRollNoChange} />
                <button onClick={searchByRollNo}>Search</button>
            </div>
            <div className='search-form'>
                <h3>Search By Name. </h3>
                <input type='text' value={name} placeholder='Enter Full Name to Search Student ' onChange={handleNameChange} />
                <button onClick={searchByName}>Search</button>
            </div>
            <hr></hr>
            <div className='students'>
                {
                    students.map(student => (
                        <StudentCard key={student.id} student={student} />
                    ))
                }
            </div>
        </div>
    )
}
