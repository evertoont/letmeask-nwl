import "./style.scss";
import closedImg from "../../assets/images/close.svg";
import { Button } from "../Button";
import { database } from "../../services/firebase";
import { useHistory } from "react-router-dom";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  roomId: string;
  questionId?: string;
  type: string;
};

export function Modal(props: ModalProps) {
  const history = useHistory();

  async function handleClosedRoom() {
    await database.ref(`rooms/${props.roomId}`).update({
      endedAt: new Date(),
    });
    closeModal();
    history.push("/");
  }

  async function handleDeleteQuestion() {
    closeModal();
    await database.ref(`rooms/${props.roomId}/questions/${props.questionId}`).remove();
  }

  function closeModal() {
    props.setIsOpen(false);
  }

  const title_close = "Encerrar Sala";
  const subtitle_close = "Tem certeza que você deseja encerrar esta sala?";
  const title_delete = "Deletar pergunta";
  const subtitle_delete = "Tem certeza que você deseja deletar esta pergunta?";

  return (
    <div className="modal-container">
      <div className="modal">
        <img src={closedImg} alt="Closed Room" />
        <h3>{props.type === "close" ? title_close : title_delete}</h3>
        <span>{props.type === "close" ? subtitle_close : subtitle_delete}</span>
        <div className="buttons">
          <Button isOutlined isLogout onClick={closeModal}>
            Cancelar
          </Button>
          <Button
            isOutlined
            isDanger
            onClick={
              props.type === "close" ? handleClosedRoom : handleDeleteQuestion
            }
          >
            {props.type === "close" ? "Sim, encerrar" : "Sim, deletar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
