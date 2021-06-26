import { useHistory, useParams, Link } from "react-router-dom";
import { useState } from "react";

import logoImg from "../../assets/images/logo.svg";
import deleteImg from "../../assets/images/delete.svg";
import checkImg from "../../assets/images/check.svg";
import answerImg from "../../assets/images/answer.svg";

import toast, { Toaster } from "react-hot-toast";
import { Button } from "../../components/Button";
import { RoomCode } from "../../components/RoomCode";
import { Modal } from "../../components/Modal";

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
  const { user, signOut } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const history = useHistory();

  const { questions, title, dataRoom } = useRoom(roomId);
  const questionsQuantity = questions.length;
  const [isOpen, setIsOpen] = useState(false);
  const [questionIdModal, setQuestionIdModal] = useState("");
  const [typeModal, setTypeModal] = useState("");

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

  async function closedRoom() {
    if (await userOwnsTheRoom()) {
      if (dataRoom?.endedAt) {
        toast.error("Está sala já está fechada!");
        return;
      } else {
        setTypeModal("close");
        setIsOpen(true);
      }
    }
  }

  async function deleteQuestion(questionId: string) {
    if (userIsLogged()) {
      if (await userOwnsTheRoom()) {
        setQuestionIdModal(questionId);
        setTypeModal("delete");
        setIsOpen(true);
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

  async function handleLogOut() {
    await signOut();
    history.push("/");
  }

  return (
    <>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          roomId={roomId}
          questionId={questionIdModal}
          type={typeModal}
        />
      )}
      <div id="page-admin">
        <header>
          <div className="content">
            <Link to="/">
              <img src={logoImg} alt="Letmeask" />
            </Link>
            <div>
              <RoomCode code={roomId} />
              <Button isOutlined onClick={closedRoom} disabled={!user}>
                Encerra sala
              </Button>
              {user && <Button
                isOutlined
                isLogout
                onClick={handleLogOut}
                disabled={!user}
              >
                Sair
              </Button>}
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
                      onClick={() => deleteQuestion(question.id)}
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
    </>
  );
}
