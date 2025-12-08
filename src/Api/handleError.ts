/* eslint-disable prettier/prettier */
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ErrorResponse {
  message?: string;
}

export const handleError = (err: AxiosError<ErrorResponse> | Error) => {
  let error = "An unexpected error occurred";

  if ('response' in err && err.response) {
    const message = err.response.data?.message || "No message provided";

    switch (err.response.status) {
      case 400:
        error = message;
        break;
      case 401:
        error = "Unauthorized: " + message;
        break;
      case 402:
        error = "Payment Required: " + message;
        break;
      case 403:
        error = "Forbidden: " + message;
        break;
      case 404:
        error = "Not Found: " + message;
        break;
      case 429:
        error = "Too many login attempts. Try again later.";
        break;
      case 500:
        error = "Please try again later";
        break;
      case 501:
        error = "Not Implemented: " + message;
        break;
      case 502:
        error = "Bad Gateway: " + message;
        break;
      case 503:
        error = "Service Unavailable: Please try again later";
        break;
      case 504:
        error = "Gateway Timeout: Please try again later";
        break;
      default:
        error = "Error: " + message;
    }
  } else if (err.message) {
    error = err.message;
  }

  toast.error(error);
};
