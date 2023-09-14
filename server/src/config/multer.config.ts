import multer from "multer";
import os from "os";

const uploadMiddleware = multer({ dest: os.tmpdir() });
export default uploadMiddleware;
