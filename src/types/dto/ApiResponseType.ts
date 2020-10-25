export interface ApiResponseFromServerType {
  status: string;
  statusCode: number;
  message: string;
  data?: any | any[];
  error?: any; // server error message
}

export interface ApiResponseType {
  status: "ok" | "error" | "login" | "serverError";
  data?: ApiResponseFromServerType | null;
  error?: ServerErrorType;
}

export interface ServerErrorType {
  message: string | string[];
  error: string;
  statusCode: number;
}
