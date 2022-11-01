import Image from "next/image";

import appCelulares from "../assets/celulares_img.png";
import logoImg from "../assets/logo_copa.svg";
import userAvatarExampleImg from "../assets/avatares.png";
import iconCheckImg from "../assets/check_icon.png";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/pools", { title: poolTitle });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert(
        "Bolão criado com sucesso, o código foi copiado para a área de transferência"
      );
      setPoolTitle("");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="max-w-6xl h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoImg} alt="nlw cup logo"></Image>
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={userAvatarExampleImg} alt="some people faces"></Image>
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500"> {props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form className="mt-10 flex gap-2" onSubmit={handleSubmit}>
          <input
            className="flex-1 py-4 px-6 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={(e) => setPoolTitle(e.target.value)}
            value={poolTitle}
          ></input>
          <button
            type="submit"
            className="bg-yellow-500 py-4 px-6 rounded font-bold text-gray-800 text-sm uppercase hover:bg-yellow-400"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar seus amigos!
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600  flex justify-between items-center text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="verify icon"></Image>
            <div className="flex flex-col">
              <span className="font-bolt text-2xl"> {props.poolCount}</span>
              <span> Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600"></div>
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="verify icon"></Image>
            <div className="flex flex-col">
              <span className="font-bolt text-2xl"> {props.guessCount}</span>
              <span> Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image src={appCelulares} alt="two cellphones showing a preview"></Image>
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("/pools/count"),
      api.get("/guesses/count"),
      api.get("users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.pools,
      guessCount: guessCountResponse.data.guesses,
      userCount: userCountResponse.data.users,
    },
  };
};
