import { User } from "./user";

export const fetchApi = (
  input: RequestInfo,
  init: RequestInit | null = null
): Promise<Response> => {
  const urlBase = "http://localhost:8000/api/";

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

  return fetch(input, init);
};
