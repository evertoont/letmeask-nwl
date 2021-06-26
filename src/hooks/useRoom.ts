import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

type Questions = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

type DataRoomProps = {
  authorId: string;
  endedAt: string;
  title: string;
};

export function useRoom(roomId: String) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [dataRoom, setDataRoom] = useState<DataRoomProps>();
  const [title, setTitle] = useState("");
  const history = useHistory()

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on("value", (room) => {
      const databaseRoom = room.val();
      if (databaseRoom != null) {
        const firebaseQuestions: FirebaseQuestions =
          databaseRoom.questions ?? {};
        setDataRoom(databaseRoom);

        const parsedQuestions = Object.entries(firebaseQuestions).map(
          ([key, value]) => {
            return {
              id: key,
              content: value.content,
              author: value.author,
              isHighlighted: value.isHighlighted,
              isAnswered: value.isAnswered,
              likeCount: Object.values(value.likes ?? {}).length,
              likeId: Object.entries(value.likes ?? {}).find(
                ([key, like]) => like.authorId === user?.id
              )?.[0],
            };
          }
        );
        setTitle(databaseRoom.title);
        setQuestions(parsedQuestions);
      }else{
        history.push('/')
      }
    });

    return () => {
      roomRef.off("value");
    };
  }, [roomId, user?.id, history]);

  return { questions, title, dataRoom };
}
