declare namespace Express {
  namespace Multer {
    interface File {
      /** Original filename */
      originalname: string;
      /** File mimetype */
      mimetype: string;
      /** Size of the file in bytes */
      size: number;
      /** The folder to upload the file to */
      path: string;
      /** The public ID of the uploaded file in Cloudinary - available when using CloudinaryStorage */
      public_id?: string;
      /** The URL of the uploaded file with HTTPS - available when using CloudinaryStorage */
      secure_url?: string;
      /** The URL of the uploaded file - available when using CloudinaryStorage */
      url?: string;
      /** Format of the uploaded file - available when using CloudinaryStorage */
      format?: string;
    }
  }
}