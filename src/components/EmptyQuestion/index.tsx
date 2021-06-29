import emptyImg from "../../assets/images/empty-questions.svg";
import { useTheme } from "../../hooks/useTheme";
import { Loading } from "../Loading/";
import "./style.scss";

export function EmptyQuestion() {

  const theme = useTheme()

  return (
    <div className={`empty-question ${theme}`}>
      <img src={emptyImg} alt="" />
      <p>Nenhuma pergunta por aqui...</p>
      <span>
        Envie o código desta sala para seus amigos e <br /> comece a responder
        perguntas!
      </span>
      <Loading />
    </div>
  );
}
