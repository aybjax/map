import { useEffect, useRef, useState } from "react";
import { User } from "../utils/user";
import { useNavigate } from "react-router";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GeoJsonObject } from "geojson";
//@ts-ignore
import { Confirm } from "../components/Confirm.tsx";
//@ts-ignore
import { Suggested } from "../components/Suggested";
import { fetchApi } from "../utils/fetch";
// @ts-ignore
import { Header } from "../components/Header.tsx";
import { Sidebar } from "primereact/sidebar";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import "./statics/Home.css";
import { Toast } from "primereact/toast";
import { ScrollPanel } from "primereact/scrollpanel";

// const _MapBox = {
//   accessToken:
//     "pk.eyJ1IjoiYXliamF4IiwiYSI6ImNrdzJjcGh3bzA4eGUyb3FsamFieGQ4NHEifQ.9_DENBK_z10CzKMFvqfIcg",
// };

const coordinates = {};

export function Home() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const user = User.getInstance();

  const [map, setMap] = useState(null);

  const [id, setId] = useState(0);
  const [suggestedId, setSuggestedId] = useState(0);
  const [layers, setLayers] = useState<GeoJsonObject | null>(null);
  const [messagesVisible, setMessagesVisible] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [retrievingMessage, setRetrievingMessage] = useState(false);
  const [seedLoad, setSeedLoad] = useState(false);
  const [pageLoad, setPageLoad] = useState(false);
  const [year, setYear] = useState(user.year)
  const renewLayers = (n: number) => {
    setYear(n)
    user.year = n
    initLayers()
  }

  const pan = (id: number) => {
    if (!id) return;
    if (!map) return;

    //@ts-ignore
    map.panTo(coordinates[id]);
    //@ts-ignore
    map.setZoom(15);
    setTimeout(() => {
      //@ts-ignore
      map.panTo(coordinates[id]);
      //@ts-ignore
      map.setZoom(13);
    }, 500);
  };

  function initLayers() {
    setPageLoad(true);
    setLayers(null);

    return fetchApi("field")
      .then((response) => response.json())
      .then((fields) => {
        setLayers(fields);
        setPageLoad(false);

        return;
      })
      .catch((_) => {
        setPageLoad(false);
      });
  };

  const seedFields = () => {
    setSeedLoad(true);
    fetchApi("/field/seed", {
      method: "post",
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.success) {
          initLayers()
            .then((_) => {
              setSeedLoad(false);
              setMessagesVisible(false);
              if (toast.current) {
                //@ts-ignore
                toast.current.show({
                  severity: "success",
                  summary: body.success,
                  life: 3000,
                });
              }
            })
            .catch((_) => {
              setSeedLoad(false);
            });
        } else if (body.error) {
          setSeedLoad(false);
          if (toast.current) {
            //@ts-ignore
            toast.current.show({
              severity: "error",
              summary: body.error,
              life: 3000,
            });
          }
        }
      });
  };

  const resetFields = () => {
    setSeedLoad(true);
    fetchApi("/field/reset", {
      method: "post",
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.success) {
          initLayers()
            .then((_) => {
              setMessagesVisible(false);
              if (toast.current) {
                //@ts-ignore
                toast.current.show({
                  severity: "success",
                  summary: body.success,
                  life: 3000,
                });
              }
            })
            .catch((_) => {
              setSeedLoad(false);
            });
        } else if (body.error) {
          if (toast.current) {
            //@ts-ignore
            toast.current.show({
              severity: "error",
              summary: body.error,
              life: 3000,
            });
          }
        }
        setSeedLoad(false);
      });
  };

  useEffect(() => {
    const user = User.getInstance();

    if (!user.isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!messagesVisible) {
      return;
    }

    setRetrievingMessage(true);

    fetchApi("/all-suggest")
      .then((response) => response.json())
      .then((suggestions: any) => {
        setRetrievingMessage(false);
        setMessages(suggestions);
      })
      .catch((e) => setRetrievingMessage(true));
  }, [messagesVisible]);

  useEffect(() => {
    initLayers();
  }, []);

  // @ts-ignore
  return (
    <div>
      <Header showMessages={() => setMessagesVisible(true)} year = {year} setYear={renewLayers} />
      {pageLoad ? (
        <div className="flex items-center justify-center">
          <ProgressSpinner style={{ width: "50px", height: "50px" }} />
        </div>
      ) : (
        <MapContainer
          style={{ width: "100%", height: "90vh" }}
          zoom={10}
          center={[51, 71]}
          //@ts-ignore
          whenCreated={setMap}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {layers?.type && (
            <GeoJSON
              data={layers}
              // @ts-ignore
              onEachFeature={(field, layer) => {
                // layer.bindPopup("hello");
                // @ts-ignore
                coordinates[field.properties.id] = layer
                  //@ts-ignore
                  .getBounds()
                  .getCenter();
                //@ts-ignore
                layer.options.fillOpacity = 1;
                const color = field.properties.color
                  ? field.properties.color
                  : "#CADDE3";
                //@ts-ignore
                layer.options.fillColor = color;

                layer.on({    
                  // @ts-ignore
                  click: (event) => {
                    setId(event.target.feature.properties.id);
                  },
                  // @ts-ignore
                  mouseover: (event) => {
                    event.target.setStyle({
                      fillColor: "yellow",
                    });
                  },
                  // @ts-ignore
                  mouseout: (event) => {
                    const color = field.properties.color
                      ? field.properties.color
                      : "#CADDE3";
                    event.target.setStyle({
                      fillOpacity: 1,
                      fillColor: color,
                    });
                  },
                });
              }}
            >
              {/* <Popup>Hello</Popup> */}
            </GeoJSON>
          )}
        </MapContainer>
      )}
      <Confirm id={id} reset={() => setId(0)} initLayers={initLayers} />
      <Suggested
        id={suggestedId}
        reset={() => setSuggestedId(0)}
        initLayers={initLayers}
      />
      <Sidebar
        visible={messagesVisible}
        position="right"
        onHide={() => setMessagesVisible(false)}
      >
        <div className="flex flex-col height100">
          <ScrollPanel className="flex-grow overflow-y-auto">
            <h3 className="mb-4 font-bold">?????????????? ???? ??????????????</h3>
            {retrievingMessage ? (
              <div className="flex items-center justify-center">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} />
              </div>
            ) : messages.length > 0 ? (
              // @ts-ignore
              messages.map((message) => (
                <div className="flex mb-6" key={message.id}>
                  <div
                    className="flex-grow p-1 hover:bg-gray-100"
                    onClick={() => {
                      setSuggestedId(message.id);
                      setMessagesVisible(false);
                    }}
                  >
                    <div>
                      <span className="font-medium">Author:</span>{" "}
                      {message?.user?.username ?? "-"}
                    </div>
                    <div>
                      <span className="font-medium">??????????????:</span>{" "}
                      {message?.culture?.name ?? "-"}
                    </div>
                  </div>

                  <div>
                    <Button
                      icon="pi pi-angle-double-down"
                      className="p-button-rounded p-button-text p-button-sm"
                      onClick={() => pan(message.field_id)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>?????? ???????????????? ???? ?????????????? ???? ???????? ??????</p>
            )}
          </ScrollPanel>
          {User.getInstance().is_admin && (
            <div className="flex-none flex">
              <Button
                label="????????????????"
                icon="pi pi-undo"
                className="p-button-text flex-grow"
                onClick={seedFields}
                loading={seedLoad}
              />

              <Button
                label="????????????????"
                icon="pi pi-times"
                className="p-button-text flex-grow"
                onClick={resetFields}
                loading={seedLoad}
              />
            </div>
          )}
        </div>
      </Sidebar>
      <Toast ref={toast} />
    </div>
  );
}
