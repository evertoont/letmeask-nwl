import { FormEvent, useState } from "react";
import {Link, useHistory} from 'react-router-dom'

import { useParams } from "react-router-dom";
import logoImg from "../../assets/images/logo.svg";
import logoDarkImg from "../../assets/images/logo-dark.svg";

import toast, { Toaster } from "react-hot-toast";
import { Button } from "../../components/Button";
import { RoomCode } from "../../components/RoomCode";
import { Loading } from "../../components/Loading"
import {Toggle} from "../../components/Toggle"

import { useAuth } from "../../hooks/useAuth";
import { database } from "../../services/firebase";
import { CardQuestion } from "../../components/CardQuestion";
import { useRoom } from "../../hooks/useRoom";
import { useTheme } from "../../hooks/useTheme";

import "./style.scss";

type RoomParams = {
  id: string;
};

export function Room() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState("");
  const roomId = params.id;
  const history = useHistory()
  const {theme} = useTheme()

  const { questions, title, dataRoom } = useRoom(roomId);
  const questionsQuantity = questions.length;

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (dataRoom?.endedAt) {
      toast.error("Está sala já está fechada!");
      return;
    }
    
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
    toast.success("Pergunta enviada com sucesso!");

    setNewQuestion("");
  }

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    
    if (!user) {
      toast.error("Você deve estar logado!");
      return;
    }

    if (likeId) {
      await database
        .ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
        .remove();
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id,
      });
    }
  }

  async function handleUserLogin() {
    if (!user) {
      await signInWithGoogle();
    }
  }

  async function handleLogOut(){
    if (user) {
      await signOut()
      history.push('/')  
    }else{
      toast.error("Você não está logado!");    
    }
  }
  return (
    <div id="page-room" className={theme}>
      <header>
        <div className="content">
          <Link to="/"><img src={theme === 'light' ? logoImg : logoDarkImg} alt="Letmeask"/></Link>
          <div>
            <RoomCode code={roomId} />
            {user && <Button isOutlined isLogout onClick={handleLogOut}> Sair</Button>}
            <Toggle/>
          </div>
        </div>
        <Toaster toastOptions={{ duration: 2100 }} />
      </header>

      <main>
        <div className="room-title">
          <h1>Sala: {title}</h1>
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
                Para eviar uma pergunta, <button type="button" onClick={handleUserLogin}>faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        <div className="question-list">
          {questionsQuantity === 0 ? (
            <Loading />
          ) : ( questions.map((question) => {
            return (
              <CardQuestion
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <button
                    className={`like-button ${question.likeId ? "liked" : ""}`}
                    type="button"
                    aria-label="Marcar como gostei"
                    onClick={() =>
                      handleLikeQuestion(question.id, question.likeId)
                    }
                  >
                    {question.likeCount > 0 && (
                      <span>{question.likeCount}</span>
                    )}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 
                      20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107
                       3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587
                        2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979
                         21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134
                          21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919
                           9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 
                           19.9499 8.99672 19.66 9H14Z"
                        stroke="#737380"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </CardQuestion>
            );
          })
        )}
        </div>
      </main>
    </div>
  );
}
