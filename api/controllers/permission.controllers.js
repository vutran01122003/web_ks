const PermissionService = require("../services/permission.service");

class PermissionControllers {
    getRegistedRoutes = async (req, res, next) => {
        try {
            const routes = [];
            let route = null;

            routerStack.forEach(function (middleware) {
                if (middleware.route) {
                    route = middleware.route;
                    routes.push({
                        path: route.path,
                        method: Object.keys(route.methods)[0],
                    });
                } else if (middleware.name === "router") {
                    middleware.handle.stack.forEach(function (handler) {
                        route = handler.route;
                        route &&
                            routes.push({
                                path: route.path,
                                method: Object.keys(route.methods)[0],
                            });
                    });
                }
            });

            const result = await Promise.all(
                routes.map((route) =>
                    PermissionService.createRole({
                        method: route.method,
                        url: route.path,
                    })
                )
            );

            res.status(200).json({
                status: 200,
                data: routes,
            });
        } catch (error) {
            next(error);
        }
    };

    createGroup = async (req, res, next) => {
        try {
            const { name, groupCode, description } = req.body;

            const createdGroup = await PermissionService.createGroup({ name, description, groupCode });

            res.status(201).json({
                msg: "Tạo chức vụ thành công",
                status: 201,
                data: createdGroup,
            });
        } catch (error) {
            next(error);
        }
    };

    getAllGroup = async (req, res, next) => {
        try {
            const groups = await PermissionService.getAllGroup();

            res.status(200).json({
                status: 200,
                msg: "Lấy dữ liệu các chức vụ thành công",
                data: groups,
            });
        } catch (error) {
            next(error);
        }
    };

    updateGroupById = async (req, res, next) => {
        try {
            const groupId = req.params.groupId;
            const data = req.body;

            const updatedGroup = await PermissionService.updateGroupById({ groupId, data });

            res.status(200).json({
                status: 200,
                msg: "Cập nhật chức vụ thành công",
                data: updatedGroup,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteGroup = async (req, res, next) => {
        try {
            const groupId = req.params.groupId;

            const deletedGroup = await PermissionService.deleteGroup({ groupId });

            res.status(200).json({
                msg: "Xóa chức vụ thành công",
                status: 200,
                data: deletedGroup,
            });
        } catch (error) {
            next(error);
        }
    };

    createRole = async (req, res, next) => {
        try {
            const { name, method, description, url } = req.body;

            const createdRole = await PermissionService.createRole({ name, method, description, url });

            res.status(201).json({
                msg: "Tạo quyền thành công",
                status: 200,
                data: createdRole,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteRole = async (req, res, next) => {
        try {
            const roleId = req.params.roleId;

            const deletedRole = await PermissionService.deleteRole({ roleId });

            res.status(200).json({
                msg: "Xóa quyền thành công",
                status: 200,
                data: deletedRole,
            });
        } catch (error) {
            next(error);
        }
    };

    grantPermissionsToGroup = async (req, res, next) => {
        try {
            const groupId = req.params.groupId;
            const roleIdList = req.body.roleIdList;

            const result = await PermissionService.grantPermissionsToGroup({ roleIdList, groupId });

            res.status(200).json({
                msg: "Thêm quyền cho chức vụ thành công",
                status: 200,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    revokePermissionsToGroup = async (req, res, next) => {
        try {
            const { roleId, groupId } = req.params;

            const result = await PermissionService.revokePermissionsToGroup({ roleId, groupId });

            res.status(200).json({
                msg: "Thu hồi quyền cho chức vụ thành công",
                status: 200,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new PermissionControllers();
