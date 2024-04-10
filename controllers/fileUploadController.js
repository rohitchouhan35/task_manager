import express from "express";
import S3 from "aws-sdk/clients/s3.js";
import multer from "multer";
import Task from "../models/task.model.js";

const fileUploadRouter = express.Router();

const s3 = new S3({
    region: process.env.region,
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
  });

  const uploadFile = (file) => {
    const fileStream = fs.createReadStream(file.path);
    const BucketParams = {
      Bucket: process.env.Bucket,
      Body: fileStream,
      Key: file.filename,
    };
    return s3.upload(BucketParams).promise();
  };
  const getfile = (key) => {
    const downloadParams = {
      Key: key,
      Bucket: process.env.Bucket,
    };
    return s3.getObject(downloadParams).createReadStream();
  };
  
  const uploadoptions = multer({ dest: "./imgfolder/" });
  
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: function (req, file, cb) {
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Invalid file type. Only JPEG, PNG, PDF,DOCX,txt and PPT files are allowed."
          )
        );
      }
    },
  });
  
  fileUploadRouter.post("/uploadfiles/:id", upload.array("files", 5), async (req, res) => {
    try {
      const task_id = req.params.id;
      const files = req.files;
  
      if (!task_id || !files || files.length === 0) {
        throw new Error("Invalid request or no files provided.");
      }
  
      const fileLinks = [];
  
      for (const file of files) {
        const params = {
          Bucket: process.env.Bucket,
          Body: file.buffer,
          Key: file.originalname,
        };
  
        const s3Result = await s3.upload(params).promise();
        fileLinks.push(s3Result.Location);
      }
  
      const task = await Task.findById(task_id);
  
      if (!task) {
        throw new Error("Task not found.");
      }
  
      task.filePaths = fileLinks;
      await task.save();
  
      res.status(200).send({
        message: "Files uploaded successfully.",
        updatedFilePaths: task.filePaths,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: error.message,
      });
    }
  }
);
  
export default fileUploadRouter;