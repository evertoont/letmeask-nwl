import { useHistory, useParams, Link } from "react-router-dom";
import logoImg from "../../assets/images/logo.svg";
import deleteImg from "../../assets/images/delete.svg";
import checkImg from "../../assets/images/check.svg";
import answerImg from "../../assets/images/answer.svg";

import toast, { Toaster } from "react-hot-toast";
import { Button } from "../../components/Button";
import { RoomCode } from "../../components/RoomCode";

import { useAuth } from "../../hooks/useAuth";
import { CardQuestion } from "../../components/CardQuestion";
import { useRoom } from "../../hooks/useRoom";
import { database } from "../../services/firebase";

import { EmptyQuestion } from "../../components/EmptyQuestion";
import "./style.scss";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const history = useHistory();

  const { questions, title, dataRoom } = useRoom(roomId);
  const questionsQuantity = questions.length;

  function userIsLogged() {
    if (!user) {
      toast.error("Você deve estar logado!");
      return;
    }
    return true;
  }

  async function userOwnsTheRoom() {
    const authorIdRoom = dataRoom?.authorId;

    if (user?.id === authorIdRoom) {
      return true;
    }
    toast.error("Você não pode executar está ação!");
    return;
  }

  async function handleClosedRoom() {
    if (await userOwnsTheRoom()) {
      if (dataRoom?.endedAt) {
        toast.error("Está sala já está fechada!");
        return;
      }
      if (window.confirm("Tem certeza que você deseja encerrar a sala?")) {
        await database.ref(`rooms/${roomId}`).update({
          endedAt: new Date(),
        });
        history.push("/");
      }
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (userIsLogged()) {
      if (await userOwnsTheRoom()) {
        if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
          await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
      }
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    if (userIsLogged()) {
      if (await userOwnsTheRoom()) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
          isAnswered: true,
        });
      }
    }
  }

  async function handleHighlightQuestion(questionId: string) {
    if (userIsLogged()) {
      if (await userOwnsTheRoom()) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
          isHighlighted: true,
        });
      }
    }
  }

  return (
    <div id="page-admin">
      <header>
        <div className="content">
          <Link to="/">
            <img src={logoImg} alt="Letmeask" />
          </Link>
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleClosedRoom}>
              Encerra sala
            </Button>
          </div>
        </div>
        <Toaster toastOptions={{ duration: 2100 }} />
      </header>

      <main>
        <div className="room-title">
          <h1>Sala - {title}</h1>
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
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                >
                  {!question.isAnswered && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleCheckQuestionAsAnswered(question.id)
                        }
                      >
                        <img
                          src={checkImg}
                          alt="Marcar pergunta como respondida"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleHighlightQuestion(question.id)}
                      >
                        <img src={answerImg} alt="Dar destaque à pergunta" />
                      </button>
                    </>
                  )}
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
            <div className="wait-question">
              <EmptyQuestion />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
