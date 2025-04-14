const fs = require("fs");
const mongoose = require("mongoose");
const Role = require("../../models/roles.model");
const Group = require("../../models/group.model");
const User = require("../../models/user.model");

// Convert $oid to ObjectId
function toObjectId(val) {
    return new mongoose.Types.ObjectId(val.$oid);
}

// Convert $date to Date
function toDate(val) {
    return new Date(val.$date);
}

// Convert nested method.{get|post|patch|delete} arrays to ObjectId[]
function convertMethodObject(method) {
    const result = {};
    for (const key in method) {
        if (Array.isArray(method[key])) {
            result[key] = method[key].map(toObjectId);
        }
    }
    return result;
}

// Init roles collection
async function initRoleCollection() {
    try {
        const count = await Role.countDocuments();
        if (count > 0) return;

        const raw = fs.readFileSync(`${__dirname}/files/KSTN_DB.roles.json`, "utf-8");
        const data = JSON.parse(raw);

        const cleaned = data.map((item) => ({
            ...item,
            _id: toObjectId(item._id),
            createdAt: toDate(item.createdAt),
            updatedAt: toDate(item.updatedAt)
        }));

        await Role.insertMany(cleaned);
        console.log("✅ Imported Role collection.");
    } catch (err) {
        throw err;
    }
}

// Init groups collection
async function initGroupCollection() {
    try {
        const count = await Group.countDocuments();
        if (count > 0) return;

        const raw = fs.readFileSync(`${__dirname}/files/KSTN_DB.groups.json`, "utf-8");
        const data = JSON.parse(raw);

        const cleaned = data.map((item) => ({
            ...item,
            _id: toObjectId(item._id),
            method: convertMethodObject(item.method),
            createdAt: toDate(item.createdAt),
            updatedAt: toDate(item.updatedAt)
        }));

        await Group.insertMany(cleaned);
        console.log("✅ Imported Group collection.");
    } catch (err) {
        throw err;
    }
}

async function initAdminUser() {
    try {
        const exists = await User.findOne({ userId: "00000000" });
        if (exists) return;

        const adminUser = new User({
            userId: "00000000",
            firstName: "Admin",
            password: "$2a$10$UB1rQZgBlcp4kG8Ci160kOrQ9fLFqfk0q8FjUg776WjmsMN.C0aom",
            gender: "nam",
            isActive: true,
            groups: ["670cdd2e58c8cef6bf3f0df8"]
        });

        await adminUser.save();
        console.log("✅ Admin user created.");
    } catch (err) {
        throw err;
    }
}

module.exports = {
    initRoleCollection,
    initGroupCollection,
    initAdminUser
};
