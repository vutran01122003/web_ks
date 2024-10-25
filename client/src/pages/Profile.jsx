import EducationInfo from '../components/Profile/EducationInfo';
import PersonInfo from '../components/Profile/PersonInfo';
import { authSelector } from '../redux/selector';
import { useSelector } from 'react-redux';
import ScrollToTopButton from '../components/Button/ScrollToTopButton';

const Profile = () => {
    const auth = useSelector(authSelector);
    return (
        <div className="pageProfile">
            <EducationInfo auth={auth} />
            <PersonInfo auth={auth} />
            <ScrollToTopButton />
        </div>
    );
};

export default Profile;
