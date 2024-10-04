import { Product } from "./model/products";

const supabaseURL: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function getProducts(): Promise<Product[] | null> {
  try {
    const res = await fetch(`${supabaseURL}/rest/v1/products`, {
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
      (Element: {
        id: string;
        name: string;
        resume: string;
        category_id: string;
        price: number;
      }) => {
        return new Product(
          Element.id,
          Element.name,
          Element.resume,
          Element.category_id,
          Element.price
        );
      }
    );
  } catch (error) {
    console.error(`Falha ao buscar informações da tabela categories:` + error);
    return null;
  }
}
