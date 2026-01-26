import imageCompression from "browser-image-compression";
import { supabase } from "@/integrations/supabase/client";
import { isValidFileType } from "./isValidType";

interface UploadResponse {
    ipfsHash?: string;
    gatewayUrl?: string;
    image?: string;
    success?: boolean;
    [key: string]: any;
}

export const uploadPinataFile = async (
    file: File,
    isCompress?: boolean
): Promise<UploadResponse> => {
    return uploadFile(file, isCompress);
};

export const uploadFile = async (
    file: File,
    isCompress?: boolean,
    bucket: string = 'avatars'
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

        const fileToUpload = isCompress
            ? await imageCompression(file, options)
            : file;

        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, fileToUpload, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return {
            success: true,
            ipfsHash: fileName,
            gatewayUrl: publicUrl,
            image: publicUrl,
            image_url: publicUrl
        };
    } catch (error: any) {
        console.error("Error uploading file to Supabase:", error);
        throw error;
    }
};

