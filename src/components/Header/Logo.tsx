import dark from "../../assets/logo_dark.svg";
import light from "../../assets/logo_light.svg";
import Image from "next/image";

export interface ILogoProps {
  mode: string;
}

export default function Logo(props: ILogoProps) {
  return (
    <div>
      {props.mode === "dark" ? (
        <Image className="logo h-14 w-auto" src={dark} alt="Doğukan Öksüz" />
      ) : (
        <Image className="logo h-14 w-auto" src={light} alt="Doğukan Öksüz" />
      )}
    </div>
  );
}
