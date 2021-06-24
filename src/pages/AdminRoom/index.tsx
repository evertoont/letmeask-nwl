import { useHistory, useParams } from "react-router-dom";
import logoImg from "../../assets/images/logo.svg";
import deleteImg from "../../assets/images/delete.svg";

import { Toaster } from "react-hot-toast";
import { Button } from "../../components/Button";
import { RoomCode } from "../../components/RoomCode";

// import { useAuth } from "../../hooks/useAuth";
import { CardQuestion } from "../../components/CardQuestion";
import { useRoom } from "../../hooks/useRoom";
import { database } from "../../services/firebase";

import "../../styles/room.scss";
import { Loading } from "../../components/Loading";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  // const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const history = useHistory();

  const { questions, title } = useRoom(roomId);
  const questionsQuantity = questions.length;

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerra sala
            </Button>
          </div>
        </div>
        <Toaster toastOptions={{ duration: 2100 }} />
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questionsQuantity > 0 && (
            <span>{questionsQuantity} pergunta(s)</span>
          )}
        </div>

        <div className="question-list">
          {questionsQuantity > 0 ? (
            questions.map((question) => {
              return (
                <CardQuestion
                  key={question.id}
                  content={question.content}
                  author={question.author}
                >
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
                </CardQuestion>
              );
            })
          ) : (
            <Loading />
          )}
        </div>
      </main>
    </div>
  );
}
