import instagram from '../../../assets/Images/SVG/instagram.wine.svg';
import twitter from '../../../assets/Images/SVG/twitter.wine.svg';
import facebook from '../../../assets/Images/SVG/facebook.wine.svg';
import background from '../../../assets/Images/Backgrounds/Footer-Background.png';
import { Link } from 'react-router-dom';
const Footer = () => {
    return (
        <footer className="footer footer-center p-10 bg-base-100 text-base-content rounded" style={{ background: `url(${background})` }}>
            <div>
                <div className="grid grid-flow-col gap-4">
                    {/* FIXME: set link fo dashboard button */}
                    <span><Link to='/dashboard/profile'>Dashboard</Link></span>
                </div>
                <div>
                    <div className="grid grid-flow-col gap-4">
                        <a className='mx-0' href="https://twitter.com/utsaho_utsho" target='_blank' rel='noreferrer'><img width='50px' src={twitter} alt="" /></a>

                        <a className='mx-0' href='https://instagram.com/utshoooooo0' rel='noreferrer' target='_blank'><img width='50px' src={instagram} alt="" /></a>

                        <a className='mx-0' href='https://facebook.com/utshoooooo0' rel='noreferrer' target='_blank'><img width='50px' src={facebook} alt="" /></a>
                    </div>
                </div>
            </div>
            <div>
                <p>Copyright &copy; {new Date().getFullYear()} - All right reserved by <span className=' font-bold text-sm'>BD BUS Ltd</span> .</p>
            </div>
        </footer >
    );
};

export default Footer;