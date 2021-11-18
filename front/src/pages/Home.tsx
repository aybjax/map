import { useEffect, useState } from "react";
import { User } from "../utils/user";
import { useNavigate } from "react-router";
import sources from "../data/geojsons";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GeoJsonObject } from "geojson";
import { Confirm } from "../components/confirm";
import { fetchApi } from "../utils/fetch";

// const _MapBox = {
//   accessToken:
//     "pk.eyJ1IjoiYXliamF4IiwiYSI6ImNrdzJjcGh3bzA4eGUyb3FsamFieGQ4NHEifQ.9_DENBK_z10CzKMFvqfIcg",
// };

const data: GeoJsonObject = sources as GeoJsonObject;

export function Home() {
  const navigate = useNavigate();

  const [id, setId] = useState(0);
  const [layers, setLayers] = useState<GeoJsonObject | null>(null);

  useEffect(() => {
    const user = User.getInstance();

    if (!user.isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchApi("field")
      .then((response) => response.json())
      .then((fields) => {
        setLayers(fields);
      });
  }, []);

  // @ts-ignore
  return (
    <>
      <MapContainer
        style={{ width: "100vw", height: "100vh" }}
        zoom={10}
        center={[51, 71]}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {layers?.type && (
          <GeoJSON
            data={layers}
            // @ts-ignore
            style={{ fillColor: "cadde3" }}
            // @ts-ignore
            onEachFeature={(field, layer) => {
              // layer.bindPopup("hello");

              layer.on({
                click: (event) => {
                  debugger;
                  setId(event.target.feature.properties.id);
                },
                mouseover: (event) => {
                  event.target.setStyle({
                    fillColor: "yellow",
                  });
                },
                mouseout: (event) => {
                  event.target.setStyle({
                    fillColor: "cadde3",
                  });
                },
              });
            }}
          >
            <Popup>Hello</Popup>
          </GeoJSON>
        )}
      </MapContainer>
      <Confirm id={id} reset={() => setId(0)} />
    </>
  );
}
