import copyImg from "../../assets/images/copy.svg";
import toast from 'react-hot-toast';
import "./style.scss";
import { useTheme } from "../../hooks/useTheme";

type RoomCodeProps = {
  code: string;
};

export function RoomCode(props: RoomCodeProps) {

  const theme = useTheme()

  function copyRoomCodeToClipBoard() {
    toast.success("Código Copiado!")
    navigator.clipboard.writeText(props.code);
  }

  return (
    <button
      className={`room-code ${theme}`}
      onClick={copyRoomCodeToClipBoard}
    >
      <div className="clipboard">
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span>Sala # {props.code}</span>
    </button>
  );
}
