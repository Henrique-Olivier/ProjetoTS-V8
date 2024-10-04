import { Categorie } from "./model/categories.ts";

const supabaseURL: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function getCategories(): Promise<Categorie[] | null> {
  try {
    const res = await fetch(`${supabaseURL}/rest/v1/categories`, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Erro na resposta da API: ${res.status}`);
    }

    const data = await res.json();
    return data.map(
      (Element: { id: string; name: string; image_url: string }) => {
        return new Categorie(Element.id, Element.name, Element.image_url);
      }
    );
  } catch (error) {
    console.error(`Falha ao buscar informações da tabela categories:` + error);
    return null;
  }
}
