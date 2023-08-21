import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';

export function Navbar() {
    const [user] = useAuthState(auth)
    const navigate = useNavigate()
    const logout = async () => {
        try {
            const result = await signOut(auth)
            navigate('/login')
        }
        catch (error) {
            console.log(JSON.stringify(error))
        }
    }
    return (
        <div className='navbar'>
            <div className='nav-links'>
                <Link to="/">Home</Link>
                {!user && <Link to="/login">Login</Link>}
                {user &&
                    <>
                        <Link to="/create-student">Create Student</Link>
                        <Link to="/search-student">Search Student</Link>
                        <Link to="/generate-challan">Generate Challans</Link>
                    </>
                }
            </div>
            <div className='nav-profile'>
                {user &&
                    <>
                        <button onClick={logout} className='logout-button'>
                            Logout
                        </button>
                    </>
                }
            </div>
        </div>
    )
}