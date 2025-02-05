import { ProxyAgent } from "proxy-agent";
import { ofetch } from "ofetch";

const agent = new ProxyAgent();
/** ポケモンの取得 */
export const findPokemon = async (name) => {
  try{
    const pokemon = await ofetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
      agent,
    });
    console.log("Fetched Pokemon:", pokemon); // 取得したデータを確認
    return pokemon;
  } catch (error) {
    console.error("Fetch Error:", error); // エラーを詳細に確認
    throw error;
  }
};
