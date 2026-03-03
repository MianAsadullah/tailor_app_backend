export declare class UploadController {
    uploadImage(file: Express.Multer.File): {
        filename: string;
        path: string;
        originalName: string;
    };
    deleteImage(filename: string): Promise<{
        success: boolean;
    }>;
}
