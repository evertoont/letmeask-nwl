import { useHistory } from "react-router-dom";

import logoImg from "../../assets/images/logo.svg";
import logoDarkImg from "../../assets/images/logo-dark.svg";
import { Button } from "../../components/Button";
import { useTheme } from "../../hooks/useTheme";
import "./style.scss";

export function NotFound() {
  const history = useHistory();
  const {theme} = useTheme()

  return (
    <div id="page-notfound" className={theme}>
      <main>
        <div className="container">
          <img src={theme === 'light' ? logoImg : logoDarkImg} alt="Letmeask" />
          <h2>Error 404: Page not found!</h2>
          <Button type="submit" onClick={() => history.push("/")}>
            Voltar
          </Button>
        </div>
      </main>
    </div>
  );
}
