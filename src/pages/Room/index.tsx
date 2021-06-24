import { FormEvent, useState } from "react";

import { useParams } from "react-router-dom";
import logoImg from "../../assets/images/logo.svg";
import "./style.scss";

import toast, { Toaster } from "react-hot-toast";
import { Button } from "../../components/Button";
import { RoomCode } from "../../components/RoomCode";

import { useAuth } from "../../hooks/useAuth";
import { database } from "../../services/firebase";
import { CardQuestion } from "../../components/CardQuestion";
import { useRoom } from "../../hooks/useRoom";

type RoomParams = {
  id: string;
};

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState("");
  const roomId = params.id;

  const { questions, title } = useRoom(roomId);
  const questionsQuantity = questions.length;

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      toast.error("Campo de pergunta está vazio!");
      return;
    }

    if (!user) {
      toast.error("Você deve estar logado!");
      return;
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isAnswered: false,
      isHighlighted: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion("");
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
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

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          ></textarea>

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para eviar uma pergunta, <button>faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <CardQuestion
                key={question.id}
                content={question.content}
                author={question.author}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
