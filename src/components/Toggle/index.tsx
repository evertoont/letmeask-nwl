import Switch from "react-switch";
import luaImg from "../../assets/images/lua.svg"
import { useTheme } from "../../hooks/useTheme";

export function Toggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="toggle">
      <Switch
        onChange={toggleTheme}
        checked={theme === "dark"}
        checkedIcon={false}
        height={20}
        width={50}
        onColor={"#e559f9"}
        offColor={"#141414"}
        checkedHandleIcon={<div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontSize: 12
          }}
        >
          🌞
        </div>}
        uncheckedHandleIcon={<div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontSize: 12
          }}
        >
          🌙
        </div>}
      />
    </div>
  );
}
