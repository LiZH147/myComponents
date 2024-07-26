import express from 'express';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        // destination()指定上传目录
        const dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, './uploads') // 将文件存储到指定目录
    },
    filename(req, file, cb) {
        const ext = file.originalname.split('.').pop();
        cb(null, `${Date.now()}-${file.fieldname}.${ext}`);
    }
})
// 创建multer实例并配置相关选项
const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
            const err = new Error('Only image files are allowed!');
            err.status = 400;
            return cb(err, false);
        }
        return cb(null, true);
    }
})
// 这里处理文件上传请求
router.post('/upload/image', upload.single('file'), (req, res) => {
    // upload.single('file')指定了只能上传单个文件
    res.json({ message: '文件上传成功', data: req.file })
})

export default router;