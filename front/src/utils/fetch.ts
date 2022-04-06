import { User } from "./user";

export const fetchApi = (
  input: RequestInfo,
  init: RequestInit | null = null
): Promise<Response> => {
  const urlBase = "http://tse-ground-map.ru/api/";

  if (typeof input === "string") {
    if (input.startsWith("/")) {
      input = input.slice(1);
    }

    input = urlBase + input;
  }

  if (!init) {
    init = {};
  }

  const user = User.getInstance();

  if (!init?.headers) {
    init.headers = {};
  }

  //@ts-ignore
  init.headers["Authorization"] = `Bearer ${user.token}`;
  //@ts-ignore
  init.headers["X-YEAR"] = user.year;

  return fetch(input, init).then((response) => {
    if (response.status === 301 || response.status === 302) {
      window.location.reload();
    }

    return response;
  });
};
