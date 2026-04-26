export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  try {
    const chunks = [];

    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const body = Buffer.concat(chunks);

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": req.headers["content-type"],
      },
      body,
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      erro: "Erro no servidor",
      detalhe: error.message,
    });
  }
}
