import { useEffect, useState } from "react";
import throttle from "lodash/throttle";

export interface IProgress {
  contentHeight: number;
}

const Progress: React.FC<IProgress> = ({ contentHeight }) => {
  const [progress, setProgress] = useState<number>(10);
  const [show, setShow] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const calculateBarHeight = () => {
        let height = (window.scrollY / contentHeight) * 100 + 10;
        if (height <= 10)
            return 10;
        if (height >= 100)
            return 100;
        else
            return height;
      }

      if (calculateBarHeight() > 98) {
        setShow(false);
      } else {
        setShow(true);
      }

      setProgress(calculateBarHeight());
    }, 20);

    if (contentHeight) {
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }
    return undefined;
  }, [contentHeight]);

  return (
    <div
      tabIndex={-1}
      style={{ position: "relative", outline: "none", userSelect: "none", opacity: show ? 1 : 0 }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "calc(88vh - 40px)",
          maxHeight: "425px",
          width: "2px",
          opacity: "0.6",
          overflow: "hidden",
        }}
        className="bg-gray-300 dark:bg-gray-800"
      >
        <div
          style={{
            transform: `translateY(${progress}%)`,
            position: "absolute",
            height: "100%",
            top: "-100%",
            width: "2px",
            left: "0",
          }}
          className="bg-gray-800 dark:bg-gray-300"
        />
      </div>
    </div>
  );
};

export default Progress;
