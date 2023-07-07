export class fileHelper {
    static customFileName(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
     
      const originalName = file.originalname.split(".")[0];
      let fileExtension = file.originalname.split(".")[1];
      cb(null, originalName + '-' + uniqueSuffix+"."+fileExtension);
    }
   
    static destinationPath(req, file, cb) {
      cb(null, './uploads/')
    }
  }
