import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import illustrationImg from "../../assets/images/illustration.svg";
import logoImg from "../../assets/images/logo.svg";
import logoDarkImg from "../../assets/images/logo-dark.svg";
import googleIconImg from "../../assets/images/google-icon.svg";
import githubIconImg from "../../assets/images/github-icon.png";
import loginImg from "../../assets/images/login.svg";
import toast, { Toaster } from "react-hot-toast";
import {Toggle} from "../../components/Toggle"

import { Button } from "../../components/Button";
import { database } from "../../services/firebase";

import "../../styles/auth.scss";
import { useTheme } from "../../hooks/useTheme";

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle, signInWithGitHub } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  const { theme } = useTheme();

  async function handleCreateRoomGoogle() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push("/rooms/new");
  }

  async function handleCreateRoomGitHub() {
    if (!user) {
      await signInWithGitHub();
    }

    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      toast.error("Campo está vazio!");
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      toast.error("Está sala não existe!");
      return;
    }

    if (roomRef.val().endedAt) {
      toast.error("A sala está fechada.");
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth" className={theme}>
      <aside>
        <img src={illustrationImg} alt="Ilustração de perguntas e respostas" />
        <strong>Crie sala de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
        <div className="main-content">
          <div className="toggle">
            <Toggle/>
          </div>
          <img src={theme === 'light' ? logoImg : logoDarkImg} alt="Letmeask" />
          <button className="create-room create-room-google" onClick={handleCreateRoomGoogle}>
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <button className="create-room create-room-github" onClick={handleCreateRoomGitHub}>
            <img src={githubIconImg} alt="Logo do Github" />
            Crie sua sala com o Github
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              autoFocus
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              <img src={loginImg} alt="login" /> Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
