import { FormEvent } from "react";

import illustrationImg from "../../assets/images/illustration.svg";
import logoImg from "../../assets/images/logo.svg";
import { Button } from "../../components/Button";

import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import { database } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";

import "../../styles/auth.scss";

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState("");

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === "") {
      toast.error("Nome da sala está vazio!");
      return;
    }

    if (!user) {
      toast.error("Você precisa estar logado para criar uma sala!");
      return;
    }

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.push(`/admin/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração de perguntas e respostas" />
        <strong>Crie sala de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          {user && (
            <div className="info-user">
              <img src={user?.avatar} alt={user?.name} />
            </div>
          )}
          <h2>Crie uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={(event) => setNewRoom(event.target.value)}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente ou <br /> ainda não possui uma
            conta? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
