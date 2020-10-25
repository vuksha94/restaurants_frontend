import axios, { AxiosResponse } from "axios";
import { ApiConfig } from "../config/api.config";
import { ApiResponseType, ServerErrorType } from "../types/dto/ApiResponseType";
import { ReservationData } from "../types/ReservationData";
import { UserType } from "../types/UserType";

export default function api(path: string, method: "get" | "post", body?: any) {
  return new Promise<ApiResponseType>((resolve) => {
    axios({
      method: method,
      url: path,
      baseURL: ApiConfig.API_URL,
      data: JSON.stringify(body),
      headers: {
        "Content-type": "application/json",
        Authorization: getToken(),
      },
    })
      .then((res) => responseHandler(res, resolve))
      .catch((err: ServerErrorType) => {

        // Bad Request Server Error
        const apiResponseType: ApiResponseType = {
          status: "serverError",
          /*data: {
            status: "serverError",
            message: msg,
            statusCode: err.statusCode,
            error: err
          },*/
          error: err
        };
        resolve(apiResponseType);
      });
  });
}

function responseHandler(
  res: AxiosResponse<any>,
  resolve: (value?: ApiResponseType) => void
): void {
  console.log(res);
  if (res.status < 200 || res.status >= 300) {
    if (res.status === 401) {
      // Unauthorized
      const newToken = res.data.data?.token;
      if (!newToken) {
        const response: ApiResponseType = {
          status: "login",
          data: null,
        };

        return resolve(response);
      }
    }
    // server error
    const apiResponseType: ApiResponseType = {
      status: "error",
      error: res.data,
    };

    return resolve(apiResponseType);
  }

  if (res.data.status === "error") {
    const apiResponseType: ApiResponseType = {
      status: "ok",
      data: res.data,
    };
    return resolve(apiResponseType);
  }
  const apiResponseType: ApiResponseType = {
    status: "ok",
    data: res.data,
  };

  return resolve(apiResponseType);
}

function getToken(): string {
  const token = localStorage.getItem("AUTH_TOKEN");
  return "Bearer " + token;
}

export function saveToken(token: string): void {
  localStorage.setItem("AUTH_TOKEN", token);
}
export function saveUser(user: UserType): void {
  console.log(user);
  localStorage.setItem("USER", JSON.stringify(user));
}
export function getUser(): UserType | null {
  const user = localStorage.getItem("USER");
  return user ? JSON.parse(user) as UserType : null;
}
export function getReservationData(): ReservationData | null {
  const reservationData = localStorage.getItem("RESERVATION_DATA");
  return reservationData ? JSON.parse(reservationData) as ReservationData : null;
}


export function isLoggedIn() {
  if (localStorage.getItem("AUTH_TOKEN")) return true;
  return false;
}

export function logOut() {
  localStorage.removeItem("AUTH_TOKEN");
}
