import GLOBALTYPES from '../redux/actions/globalTypes';

export default function notifyError({ dispatch, error, defaultMessage }) {
    const errorData = error?.response?.data;
    const status = errorData?.status;
    const msg = errorData?.msg;

    if (!defaultMessage) defaultMessage = 'Có lỗi xảy ra';

    dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
            error: status === 401 ? 'Hết phiên đăng nhập' : msg ?? defaultMessage
        }
    });

    if (status && status === 401) window.location.reload();
}
