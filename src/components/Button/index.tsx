import { ButtonHTMLAttributes } from "react";
import "./style.scss";
import cx from "classnames";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
  isLogout?: boolean;
  isDanger?: boolean;
};

export function Button({
  isOutlined = false,
  isLogout = false,
  isDanger = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx(
        "button",
        { outlined: isOutlined },
        { logout: isLogout },
        { danger: isDanger }
      )}
      {...props}
    />
  );
}
