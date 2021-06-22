import logoImg from "../assets/images/logo.svg";
import "../styles/notfound.scss";
import { Button } from "../components/Button";
import { useHistory } from "react-router-dom";

export function NotFound() {
  const history = useHistory();

  return (
    <div id="page-notfound">
      <main>
        <div className="container">
          <img src={logoImg} alt="Letmeask" />
          <h2>Error 404: Page not found!</h2>
          <Button type="submit" onClick={() => history.goBack()}>
            Voltar
          </Button>
        </div>
      </main>
    </div>
  );
}
