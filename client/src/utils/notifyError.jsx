import GLOBALTYPES from '../redux/actions/globalTypes';

export default function notifyError({ dispatch, error, defaultMessage }) {
    const { status, msg } = error.response?.data;

    if (!defaultMessage) defaultMessage = 'Có lỗi xảy ra';

    dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
            error: status === 401 ? 'Hết phiên đăng nhập' : msg ?? defaultMessage
        }
    });

    // if (status === 401) window.location.reload();
}
