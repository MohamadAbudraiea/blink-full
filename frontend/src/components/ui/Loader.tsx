import { useTheme } from "@/context/theme-provider";

function Loader() {
  const { theme } = useTheme();

  return (
    <div className="flex justify-center items-center h-screen">
      <img
        src={theme === "dark" ? `/cabsola.png` : `/black-cabsola.png`}
        alt="Loading"
        className="h-32 w-32 transform animate-spin"
      />
    </div>
  );
}

export default Loader;
