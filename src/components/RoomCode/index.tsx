import copyImg from "../../assets/images/copy.svg";
import toast from 'react-hot-toast';
import "./style.scss";

type RoomCodeProps = {
  code: string;
};

export function RoomCode(props: RoomCodeProps) {
  function copyRoomCodeToClipBoard() {
    toast.success("Código Copiado!")
    navigator.clipboard.writeText(props.code);
  }

  return (
    <button
      className="room-code"
      onClick={copyRoomCodeToClipBoard}
    >
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span>Sala # {props.code}</span>
    </button>
  );
}
