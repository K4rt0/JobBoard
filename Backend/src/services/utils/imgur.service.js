const imgur = require("imgur");
const { env } = require("~/config/environment");
const fs = require("fs");
const path = require("path");

imgur.setClientId(env.IMGUR_CLIENT_ID);

const upload_image = async (file, retries = 3) => {
  try {
    const tempDir = path.join(__dirname, "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    const tempPath = path.join(tempDir, file.name);
    await fs.promises.writeFile(tempPath, file.data);

    let response;
    for (let i = 0; i < retries; i++) {
      try {
        response = await imgur.uploadFile(tempPath);
        break;
      } catch (error) {
        if (error.message.includes("503") && i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          throw error;
        }
      }
    }

    await fs.promises.unlink(tempPath);

    if (!response || !response.link) {
      throw new Error("Không thể upload ảnh lên Imgur");
    }
    return {
      link: response.link,
      delete_hash: response.deletehash || null,
    };
  } catch (error) {
    throw error;
  }
};

const delete_image = async (delete_hash) => {
  try {
    const response = await imgur.deleteImage(delete_hash);
    return response;
  } catch (error) {
    throw error;
  }
};

export const imgur_service = {
  upload_image,
  delete_image,
};
