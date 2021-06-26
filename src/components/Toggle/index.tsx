import Switch from "react-switch";
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
      />
    </div>
  );
}
