import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { fetchApi } from "../utils/fetch";
import "./Suggested";
import { Toast } from "primereact/toast";

interface SuggestedProp {
  id: number;
  reset: () => void;
}

interface FieldResponse {
  id: number;
  culture_id: string | number;
  field_id: string | number;
  user_id: string | number;
  comment: string;
  created_at: string;
  updated_at: string;
  culture: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  field: {
    type: string;
    culture_id: number | string | null;
    geometry: {
      type: string;
      coordinates: any[];
    };
    properties: {
      id: number;
      planted: string;
      planted_id: string | number;
      comment: string | null;
    };
    culture: null | {
      id: number;
      name: string;
      created_at: string;
      updated_at: string;
    };
  };
  user: {
    id: number;
    username: string;
    is_admin: "0" | "1";
    created_at: string;
    updated_at: string;
  };
}

const getContent = (suggestion_id: number): Promise<FieldResponse | null> => {
  return fetchApi("suggestion/" + suggestion_id).then((response) => {
    if (response.ok) {
      return response.json();
    }

    return null;
  });
};

export function Suggested(props: SuggestedProp) {
  const toast = useRef(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [content, setContent] = useState<FieldResponse | null>(null);

  const checkCulture = () => {
    setError("");
    setSuccess("");
    const payload = {
      field_id: content?.field_id,
      culture_id: content?.culture_id,
    };
    fetchApi("culture-check", {
      method: "post",
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((response: { success?: string; error?: string }) => {
        if (response.error) {
          setError(response.error);
        }
        if (response.success) {
          setSuccess(response.success);
        }
      });
  };

  const acceptSuggestion = () => {
    setError("");
    setSuccess("");

    fetchApi("suggestion/" + props.id, {
      method: "post",
    })
      .then((response) => response.json())
      .then((response: { success?: string; error?: string }) => {
        if (response.error) {
          setError(response.error);
        }
        if (response.success) {
          if (toast.current) {
            //@ts-ignore
            toast.current.show({
              severity: "success",
              summary: response.success,
              life: 3000,
            });
          }

          setTimeout(props.reset, 1000);
        }
      });
  };

  const deleteSuggestion = () => {
    setError("");
    setSuccess("");

    fetchApi("/suggestion/" + props.id, {
      method: "delete",
    })
      .then((response) => response.json())
      .then((response: { success?: string; error?: string }) => {
        if (response.error) {
          setError(response.error);
        }
        if (response.success) {
          if (toast.current) {
            //@ts-ignore
            toast.current.show({
              severity: "success",
              summary: response.success,
              life: 3000,
            });
          }

          setTimeout(props.reset, 1000);
        }
      });
  };

  useEffect(() => {
    if (props.id) {
      getContent(props.id).then((r) => {
        setContent(r);
      });
    } else {
      setError("");
      setSuccess("");
      setContent(null);
    }
  }, [props.id]);

  if (props.id === 0) {
    return null;
  }

  return (
    <>
      <Dialog
        header="Принять запрос"
        visible={props.id !== 0}
        style={{ width: "50vw" }}
        onHide={() => {
          props.reset();
        }}
        footer={
          content ? (
            <div className="animate__animated animate__zoomIn">
              <Button
                label="Удалить"
                icon="pi pi-times"
                onClick={deleteSuggestion}
                className="p-button-text"
              />
              <Button
                label="Проверить"
                icon="pi pi-question-circle"
                onClick={checkCulture}
                className="p-button-text"
              />
              <Button
                label="Принять"
                icon="pi pi-send"
                onClick={acceptSuggestion}
                autoFocus
              />
            </div>
          ) : null
        }
      >
        {content ? (
          <div className="animate__animated animate__fadeIn">
            {success && (
              <div className="flex justify-center text-green-400">
                {success}
              </div>
            )}
            {error && (
              <div className="flex justify-center text-red-700">{error}</div>
            )}
            <div className="mt-4">
              Автор:
              <div>
                {content?.user?.username?.length ? content.user.username : "-"}
              </div>
            </div>
            <div className="mt-4">
              Посажено:
              <div>
                {content?.field?.culture?.name?.length
                  ? content.field.culture.name
                  : "-"}
              </div>
            </div>
            <div className="mt-4">
              Примечание:
              <div>
                {content?.field?.properties?.comment?.length
                  ? content.field.properties.comment
                  : "-"}
              </div>
            </div>
            <div className="mt-4">
              Запрос на посадку:
              <div>
                {content?.culture?.name?.length ? content.culture.name : "-"}
              </div>
            </div>
            <div className="mt-4">
              Примечание:
              <div>{content?.comment?.length ? content.comment : "-"}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <ProgressSpinner style={{ width: "50px", height: "50px" }} />
          </div>
        )}
      </Dialog>
      <Toast ref={toast} />
    </>
  );
}
