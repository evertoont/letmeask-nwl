import { useHistory } from "react-router-dom";

import logoImg from "../../assets/images/logo.svg";
import { Button } from "../../components/Button";
import "./style.scss";

export function NotFound() {
  const history = useHistory();

  return (
    <div id="page-notfound">
      <main>
        <div className="container">
          <img src={logoImg} alt="Letmeask" />
          <h2>Error 404: Page not found!</h2>
          <Button type="submit" onClick={() => history.push("/")}>
            Voltar
          </Button>
        </div>
      </main>
    </div>
  );
}
