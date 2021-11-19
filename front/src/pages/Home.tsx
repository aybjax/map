import { useEffect, useState } from "react";
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

// const _MapBox = {
//   accessToken:
//     "pk.eyJ1IjoiYXliamF4IiwiYSI6ImNrdzJjcGh3bzA4eGUyb3FsamFieGQ4NHEifQ.9_DENBK_z10CzKMFvqfIcg",
// };

const coordinates = {};

export function Home() {
  const navigate = useNavigate();

  const [map, setMap] = useState(null);

  const [id, setId] = useState(0);
  const [suggestedId, setSuggestedId] = useState(0);
  const [layers, setLayers] = useState<GeoJsonObject | null>(null);
  const [messagesVisible, setMessagesVisible] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [retrievingMessage, setRetrievingMessage] = useState(false);

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
    fetchApi("field")
      .then((response) => response.json())
      .then((fields) => {
        setLayers(fields);
      });
  }, []);

  // @ts-ignore
  return (
    <div>
      <Header showMessages={() => setMessagesVisible(true)} />
      <MapContainer
        style={{ width: "100%", height: "90vh" }}
        zoom={10}
        center={[51, 71]}
        whenCreated={setMap}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {layers?.type && (
          <GeoJSON
            data={layers}
            // @ts-ignore
            onEachFeature={(field, layer) => {
              // layer.bindPopup("hello");
              coordinates[field.properties.id] = layer.getBounds().getCenter();
              switch (field.properties.planted_id) {
                case 1:
                  layer.options.fillColor = "#EF9A9A";
                  break;
                case 2:
                  layer.options.fillColor = "#F48FB1";
                  break;
                case 3:
                  layer.options.fillColor = "#CE93D8";
                  break;
                case 4:
                  layer.options.fillColor = "#B39DDB";
                  break;
                case 5:
                  layer.options.fillColor = "#9FA8DA";
                  break;
                case 6:
                  layer.options.fillColor = "#90CAF9";
                  break;
                case 7:
                  layer.options.fillColor = "#81D4FA";
                  break;
                case 8:
                  layer.options.fillColor = "#80CBC4";
                  break;
                case 9:
                  layer.options.fillColor = "#A5D6A7";
                  break;
                case 10:
                  layer.options.fillColor = "#212121";
                  break;
                default:
                  layer.options.fillColor = "cadde3";
              }

              layer.on({
                click: (event) => {
                  setId(event.target.feature.properties.id);
                },
                mouseover: (event) => {
                  event.target.setStyle({
                    fillColor: "#EF9A9A",
                  });
                },
                mouseout: (event) => {
                  // event.target.setStyle({
                  //   fillColor: "cadde3",
                  // });
                  switch (field.properties.planted_id) {
                    case 1:
                      event.target.setStyle({
                        fillColor: "#EF9A9A",
                      });
                      break;
                    case 2:
                      event.target.setStyle({
                        fillColor: "#F48FB1",
                      });
                      break;
                    case 3:
                      event.target.setStyle({
                        fillColor: "#CE93D8",
                      });
                      break;
                    case 4:
                      event.target.setStyle({
                        fillColor: "#B39DDB",
                      });
                      break;
                    case 5:
                      event.target.setStyle({
                        fillColor: "#9FA8DA",
                      });
                      break;
                    case 6:
                      event.target.setStyle({
                        fillColor: "#90CAF9",
                      });
                      break;
                    case 7:
                      event.target.setStyle({
                        fillColor: "#81D4FA",
                      });
                      break;
                    case 8:
                      event.target.setStyle({
                        fillColor: "#80CBC4",
                      });
                      break;
                    case 9:
                      event.target.setStyle({
                        fillColor: "#A5D6A7",
                      });
                      break;
                    case 10:
                      event.target.setStyle({
                        fillColor: "#212121",
                      });
                      break;
                    default:
                      event.target.setStyle({
                        fillColor: "cadde3",
                      });
                  }
                },
              });
            }}
          >
            {/* <Popup>Hello</Popup> */}
          </GeoJSON>
        )}
      </MapContainer>
      <Confirm id={id} reset={() => setId(0)} />
      <Suggested id={suggestedId} reset={() => setSuggestedId(0)} />
      <Sidebar
        visible={messagesVisible}
        position="right"
        onHide={() => setMessagesVisible(false)}
      >
        <h3 className="mb-4 font-bold">Запросы на посадку</h3>
        {retrievingMessage ? (
          <div className="flex items-center justify-center">
            <ProgressSpinner style={{ width: "50px", height: "50px" }} />
          </div>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <div className="flex mb-6">
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
                  <span className="font-medium">Посадка:</span>{" "}
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
          <p>Нет запросов на посадку</p>
        )}
      </Sidebar>
    </div>
  );
}
