import imageCompression from "browser-image-compression";
import { axiosInstance } from "./axiosInstance";
import { isValidFileType } from "./isValidType";

const header = {
    "Content-Type": "multipart/form-data",
};

interface UploadResponse {
    ipfsHash?: string;
    gatewayUrl?: string;
    success?: boolean;
    [key: string]: any; // If server sends other keys
}

export const uploadPinataFile = async (
    file: File,
    isCompress?: boolean
): Promise<UploadResponse> => {
    try {

        const check = isValidFileType(file);
        if (!check) {
            throw new Error("Invalid file type jpeg, png, jpg allowed.");
        }
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };

        const compressedFile = isCompress
            ? await imageCompression(file, options)
            : file;

        const formData = new FormData();
        formData.append("file", compressedFile);

        const response = await axiosInstance.post<UploadResponse>('upload/file', formData, {
            headers: header,
        });

        return response.data;
    } catch (error: any) {
        console.error("Error uploading file:", error);
        throw error;
    }
};
export const uploadFile = async (
    file: File,
    isCompress?: boolean
): Promise<UploadResponse> => {
    try {

        const check = isValidFileType(file);
        if (!check) {
            throw new Error("Invalid file type jpeg, png, jpg allowed.");
        }
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };

        const compressedFile = isCompress
            ? await imageCompression(file, options)
            : file;

        const formData = new FormData();
        formData.append("image", compressedFile);

        const response = await axiosInstance.post<UploadResponse>('image/upload', formData, {
            headers: header,
        });

        return response.data;
    } catch (error: any) {
        console.error("Error uploading file:", error);
        throw error;
    }
};
