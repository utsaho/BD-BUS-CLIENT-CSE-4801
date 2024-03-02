import './NotFound.css';
import { Link } from 'react-router-dom';
const NotFound = () => {
    return (
        <div className='grid place-items-center'>
            <h2 className="Oops font-bold w-fit h-fit">Oops!</h2>
            <h2 className="text-3xl uppercase font-bold">404 - Page Not found</h2>
            <p className='text-xl text-gray-600 w-1/2 text-center mt-3'>The page you are looking for might have been removed had its name changed or temporarily unavailable</p>
            <Link to='/' className='btn btn-outline btn-error rounded-full mt-2'>go to homepage</Link>
        </div>
    );
};

export default NotFound;