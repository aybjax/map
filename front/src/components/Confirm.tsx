import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { fetchApi } from "../utils/fetch";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import "./Confirm.css";
import { Toast } from "primereact/toast";

interface PrepResponse {
  preps: {
    id: number;
    name: string;
  }[];
}

interface ConfirmProp {
  id: number;
  reset: () => void;
}

interface FieldResponse {
  id?: number;
  planted?: string;
  comment?: string;
  confirmed?: false;
}

interface FieldResponseFetched extends FieldResponse {
  fetched: boolean;
}

const getContent = (field_id: number): Promise<FieldResponse | null> => {
  return fetchApi("field/" + field_id).then((response) => {
    if (response.ok) {
      return response.json();
    }

    return null;
  });
};

export function Confirm(props: ConfirmProp) {
  const toast = useRef(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [cultureId, setCultureId] = useState<number>(0);
  const [cultureComment, setCultureComment] = useState<string>("");
  const [prep, setPrep] = useState<PrepResponse>({ preps: [] });

  const checkCulture = () => {
    setError("");
    setSuccess("");
    const payload = { field_id: props.id, culture_id: cultureId };
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

  const suggestCulture = () => {
    setError("");
    setSuccess("");

    const payload = {
      field_id: props.id,
      culture_id: cultureId,
      comment: cultureComment,
    };
    fetchApi("culture-suggest", {
      method: "post",
      body: JSON.stringify(payload),
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

  const [response, setResponse] = useState<FieldResponseFetched>({
    id: 0,
    planted: "",
    comment: "",
    confirmed: false,
    fetched: false,
  });

  useEffect(() => {
    if (props.id) {
      getContent(props.id).then((r) => {
        if (r) {
          setResponse({
            ...r,
            fetched: true,
          });
        } else {
          setResponse({
            fetched: false,
          });
        }
      });
    } else {
      setCultureId(0);
      setCultureComment("");
      setError("");
      setSuccess("");
    }
  }, [props.id]);

  useEffect(() => {
    fetchApi("culture")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return null;
      })
      .then((content: PrepResponse | null) => {
        if (content) {
          setPrep(content);
        }
      });
  }, []);

  if (props.id === 0) {
    return null;
  }

  return (
    <>
      <Dialog
        header="Отправить запрос"
        visible={props.id !== 0}
        style={{ width: "50vw" }}
        onHide={() => {
          props.reset();
        }}
        footer={
          response.fetched ? (
            <div className="animate__animated animate__zoomIn">
              <Button
                label="Проверить"
                icon="pi pi-question-circle"
                onClick={checkCulture}
                className="p-button-text"
              />
              <Button
                label="Отправить"
                icon="pi pi-send"
                onClick={suggestCulture}
                autoFocus
              />
            </div>
          ) : null
        }
      >
        {response.fetched ? (
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
              Культура:
              <div>{response?.planted?.length ? response.planted : "-"}</div>
            </div>
            <div className="mt-4">
              Примечание:
              <div>{response?.comment?.length ? response.comment : "-"}</div>
            </div>
            <div className="mt-4">Культура для посадки:</div>
            <Dropdown
              className="width100"
              options={prep.preps}
              value={cultureId}
              onChange={(e) => setCultureId(e.value)}
              placeholder="Выберите культуру"
              optionLabel="name"
              optionValue="id"
            />
            <div className="mt-4">Примечание:</div>
            <InputTextarea
              className="width100"
              value={cultureComment}
              onChange={(e) => setCultureComment(e.target.value)}
              rows={5}
              cols={30}
            />
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
