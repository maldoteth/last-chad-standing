/* eslint-disable prettier/prettier */
/**
 * Get the file extension from a filename.
 * @param filename - The full name of the file.
 * @returns The file extension.
 */
const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

/**
 * Check if a file's extension is in the list of allowed types.
 * @param file - The file to validate.
 * @param type - Optional array of allowed file extensions.
 * @returns True if the file type is valid, false otherwise.
 */
const isValidFileType = (
  file: File,
  type: string[] = ["jpg", "jpeg", "png",],
): boolean => {
  const fileExtension = getFileExtension(file.name).toLowerCase();

  return type.includes(fileExtension);
};

export { isValidFileType };
