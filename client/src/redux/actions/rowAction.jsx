import { getDataApi, patchDataApi, postDataApi } from '../../utils/fetchData';
import GLOBALTYPES from '../../redux/actions/globalTypes';
const [RESUBMITED_STATUS] = ['phải nộp lại'];

export const addRow =
    ({ formData }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            const { major, cohort, faculty, contentId, rowListId, path } = JSON.parse(formData.get('rowData'));

            const res = contentId
                ? await patchDataApi(`/rows/${rowListId}`, formData)
                : await postDataApi('/rows', formData);

            const page = await getDataApi(path, {
                major,
                cohort,
                faculty
            });

            dispatch({
                type: GLOBALTYPES.PAGE.UPDATE_DYNAMIC_PAGE,
                payload: {
                    page: page.data.data
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res?.data.msg
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Thêm Hoạt Động Thất Bại'
                }
            });
        }
    };

export const getDynamicRows =
    ({
        tab,
        userData,
        page,
        limit,
        currentRows,
        activity,
        pageStudentMajor,
        pageStudentCohort,
        pageStudentLevelYear
    }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ROW.LOADING_PENDING_ROWS,
                payload: {
                    loading: true
                }
            });

            const res = await getDataApi('/dynamic-rows', {
                page: page || 1,
                limit: limit || 10,
                current_rows: currentRows,
                rows_type: tab,
                student_id: userData?.userId || null,
                major: userData?.major || null,
                activity,
                pageStudentMajor,
                pageStudentCohort,
                pageStudentLevelYear
            });

            dispatch({
                type: GLOBALTYPES.ROW.GET_DYNAMIC_ROWS,
                payload: {
                    rowsType: tab,
                    dynamicRows: res.data.data,
                    page
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Lấy Dữ Liệu Chỉ Tiêu Chờ Duyệt Thất Bại'
                }
            });
        } finally {
            dispatch({
                type: GLOBALTYPES.ROW.LOADING_PENDING_ROWS,
                payload: {
                    loading: false
                }
            });
        }
    };

export const updateRowsStatus =
    ({
        userId,
        pageInfo,
        noteValue,
        rowsType,
        rowListId,
        contentIdList,
        prevStatus,
        status,
        deadline,
        isTimedExtension
    }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            const res = await patchDataApi(`/dynamic-rows/${rowListId}`, {
                userId,
                pageInfo,
                contentIdList,
                prevStatus,
                status,
                noteValue,
                deadline,
                isTimedExtension
            });

            if (prevStatus === RESUBMITED_STATUS && status === RESUBMITED_STATUS) {
                dispatch({
                    type: GLOBALTYPES.ROW.UPDATE_ROW,
                    payload: {
                        rowsType,
                        rowId: rowListId,
                        contentId: contentIdList[0],
                        editedData: {
                            noteValue,
                            deadline: new Date(deadline).toISOString()
                        }
                    }
                });
            } else {
                dispatch({
                    type: GLOBALTYPES.ROW.REMOVE_ROW,
                    payload: {
                        rowsType,
                        rowId: rowListId,
                        contentId: contentIdList[0]
                    }
                });
            }

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res?.data.msg
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Duyệt Chỉ Tiêu Thất Bại'
                }
            });
        }
    };
