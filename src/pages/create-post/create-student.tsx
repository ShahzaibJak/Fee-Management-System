import './create-student.css';
import { StudentForm } from './student-form';

export function CreateStudent(){

    return(
        <div className='post-form'>
            <h2>Create Student</h2>
            <StudentForm />
        </div>
    )
}