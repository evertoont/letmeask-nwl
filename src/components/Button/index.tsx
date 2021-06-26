import { ButtonHTMLAttributes } from "react";
import "./style.scss";
import cx from "classnames"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
  isLogout?: boolean;
};

export function Button({ isOutlined = false, isLogout = false, ...props }: ButtonProps) {
  return (
    <button className={cx('button',
    {outlined: isOutlined},
    {logout: isLogout})} {...props} />
  );
}
