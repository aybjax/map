import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { setTimeout } from "timers";
import { useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";

interface ConfirmProp {
  id: number;
  reset: () => void;
}

const getContent: () => Promise<{ posajeno: string; prognoz: string }> = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        posajeno: "posajeno",
        prognoz: "prognoz",
      });
    }, 5000);
  });

export function Confirm(props: ConfirmProp) {
  const id = props.id;

  const [response, setResponse] = useState({
    posajeno: "",
    prognoz: "",
    fetched: false,
  });
  getContent().then((r) =>
    setResponse({
      ...r,
      fetched: true,
    })
  );

  if (id === 0) {
    return null;
  }

  return (
    <Dialog
      header="Header"
      visible={props.id !== 0}
      style={{ width: "50vw" }}
      onHide={props.reset}
      footer={
        response.fetched ? (
          <div className="animate__animated animate__zoomIn">
            <Button
              label="No"
              icon="pi pi-times"
              onClick={props.reset}
              className="p-button-text"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              onClick={props.reset}
              autoFocus
            />
          </div>
        ) : null
      }
    >
      {response.fetched ? (
        <div className="animate__animated animate__fadeIn">
          {" "}
          <p>{response.posajeno}</p>
          <p>{response.prognoz}</p>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <ProgressSpinner style={{ width: "50px", height: "50px" }} />
        </div>
      )}
    </Dialog>
  );
}
