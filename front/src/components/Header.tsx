import "./Header.css";
import { Button } from "primereact/button";
import { User } from "../utils/user";

interface HomeProps {
  showMessages: () => void;
}

export const Header = (props: HomeProps) => {
  const user = User.getInstance();
  return (
    <div className="header flex items-center">
      <div>
        <span className="ml-4 select-none inline-block font-medium">
          {user.username}
        </span>
        <span className="ml-2 select-none">
          ({user.is_admin ? "администратор" : "пользователь"})
        </span>
      </div>
      <div className="flex-grow"></div>
      {user.is_admin && (
        <Button
          // icon="pi pi-bell"
          label="Рекоммендации"
          className="p-button-rounded p-button-text p-button-sm mr-16"
          onClick={props.showMessages}
        />
      )}
      <Button
        // icon="pi pi-sign-out"
        label="Выйти"
        className="p-button-rounded p-button-text p-button-sm"
        onClick={user.logout}
      />
    </div>
  );
};
