const fs = require("node:fs/promises");
const path = require("path");
const {
    app: { uri_base, clientDomain }
} = require("../config/config");

const storeFiles = async ({ destination, files }) => {
    try {
        const uploadDir = `${__dirname}/../data/${destination}`;

        await fs.mkdir(uploadDir, { recursive: true });

        const filesData = await Promise.all(
            files.map(async (file) => {
                const originalname = file.originalname;
                const parts = originalname.split(".");
                const extendName = parts[parts.length - 1];
                const baseName = parts[0];
                const fileName = `${baseName}_${new Date().getTime()}.${extendName}`;
                const filePath = path.join(uploadDir, fileName);

                return fs.writeFile(filePath, file.buffer).then(() => ({
                    fileUrl: `${
                        process.env.NODE_ENV === "PRO" ? clientDomain : uri_base
                    }/files/${destination}/${fileName}`,
                    originalName: fileName
                }));
            })
        );

        return filesData;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    storeFiles
};
