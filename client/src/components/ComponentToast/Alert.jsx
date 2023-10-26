import { useSelector } from 'react-redux';
import Loading from './Loading';
import Toast from './Toast';
import { alertSelector } from '../../redux/selector';

export default function Alert() {
    const alert = useSelector(alertSelector);
    return (
        <>
            {alert.loading && <Loading />}
            {alert.error && <Toast status='error' msg={alert.error} />}
            {alert.success && <Toast status='success' msg={alert.success} />}
        </>
    );
}
