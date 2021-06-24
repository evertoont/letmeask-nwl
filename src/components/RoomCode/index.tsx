import copyImg from "../../assets/images/copy.svg";
import "./style.scss";
import toast from 'react-hot-toast';

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
