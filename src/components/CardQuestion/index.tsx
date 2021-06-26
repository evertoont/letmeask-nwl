import { ReactNode } from "react";
import cx from "classnames";

import "./style.scss";
import { useTheme } from "../../hooks/useTheme";

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered: boolean;
  isHighlighted: boolean;
  amountLike?: number;
};

export function CardQuestion({
  content,
  author,
  isAnswered = false,
  isHighlighted = false,
  amountLike,
  children,
}: QuestionProps) {
  const {theme} = useTheme()
  return (
    <div
      className={cx(
        `question ${theme}`,
        { answered: isAnswered },
        { highlighted: isHighlighted && !isAnswered }
      )}
    >
      <div className="content">
        {amountLike !== undefined && (<span className="likes">{amountLike} {amountLike > 1 ? "likes" : "like"} </span>)}
      </div>
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}
