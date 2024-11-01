const createError = require("http-errors");
const Group = require("../models/group.model");
const Role = require("../models/roles.model");

class PermissionService {
    static createGroup = async ({ name, description, groupCode }) => {
        try {
            const group = await Group.findOne({ name });
            if (group) throw createError.Conflict("Chức vụ đã tồn tại");

            const createdGroup = await Group.create({
                name,
                description,
                groupCode
            });
            return createdGroup;
        } catch (error) {
            throw error;
        }
    };

    static getGroupsByGroupCode = async ({ groupCodeList }) => {
        return await Group.find({ groupCode: { $in: groupCodeList } });
    };

    static getGroupByGroupCode = async (groupCode) => {
        const group = await Group.findOne({ groupCode });

        if (!group) throw createError.NotFound("Chức vụ không tồn tại");

        return group;
    };

    static getAllGroup = async () => {
        try {
            const groups = await Group.find();

            return groups;
        } catch (error) {
            throw error;
        }
    };

    static getGroupById = async ({ groupId }) => {
        try {
            const group = await Group.findById(groupId);
            if (!group) throw createError.NotFound("Chức vụ không tồn tại");

            return group;
        } catch (error) {
            throw error;
        }
    };

    static updateGroupById = async ({ groupId, data }) => {
        try {
            const updatedGroup = await Group.findByIdAndUpdate(groupId, data, { new: true });

            if (!updatedGroup) throw createError.NotFound("Chức vụ không tồn tại");

            return updatedGroup;
        } catch (error) {
            throw error;
        }
    };

    static deleteGroup = async ({ groupId }) => {
        try {
            const deletedGroup = await Group.findByIdAndDelete(groupId);

            if (!deletedGroup) throw createError.NotFound("Chức vụ không tồn tại");

            return deletedGroup;
        } catch (error) {
            throw error;
        }
    };

    static createRole = async ({ name, method, url, description }) => {
        try {
            const role = await Role.findOne({ method, url });

            if (role) throw createError.Conflict("Đã tồn tại quyền có chức năng tương tự");

            const createdRole = await Role.create({
                name,
                method,
                url,
                description
            });

            return createdRole;
        } catch (error) {
            throw error;
        }
    };

    static deleteRole = async ({ roleId }) => {
        try {
            const deletedRole = await Role.findByIdAndDelete(roleId);

            if (!deletedRole) throw createError.NotFound("Quyền không tồn tại");

            return deletedRole;
        } catch (error) {
            throw error;
        }
    };

    static grantPermissionsToGroup = async ({ groupId, roleIdList }) => {
        try {
            const group = Group.findById(groupId);

            if (!group) throw createError.NotFound("Chức vụ không tồn tại");

            const role = Role.find({
                _id: {
                    $in: roleIdList
                }
            });

            if (!role) throw createError.NotFound("Quyền không tồn tại");

            const result = await Promise.all([group, role]);

            if (result[0] === null) throw createError.NotFound("Chức vụ không tồn tại");

            result[1].forEach((role) => {
                if (!result[0].method[role.method].includes(role._id)) result[0].method[role.method].push(role._id);
            });

            await result[0].save();

            return result[0];
        } catch (error) {
            throw error;
        }
    };

    static revokePermissionsToGroup = async ({ groupId, roleId }) => {
        try {
            const group = Group.findById(groupId);
            const role = Role.findById(roleId);

            const result = await Promise.all([group, role]);

            if (result[0] === null) throw createError.NotFound("Chức vụ không tồn tại");
            if (result[1] === null) throw createError.NotFound("Quyền không tồn tại");

            if (!result[0].method[result[1].method].includes(result[1]._id))
                throw createError.Conflict("Chức vụ được chọn không có quyền này");

            result[0].method[result[1].method] = result[0].method[result[1].method].filter((id) => id != roleId);

            await result[0].save();

            return result[0];
        } catch (error) {
            throw error;
        }
    };
}

module.exports = PermissionService;
