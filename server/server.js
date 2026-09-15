import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ========================================
// TESTE DO BACKEND
// ========================================

app.get("/", (req, res) => {
  res.json({
    mensagem: "Backend do GRWM funcionando!",
  });
});

// ========================================
// TESTE DO BANCO
// ========================================

app.get("/teste-banco", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT NOW()");

    res.json({
      mensagem: "Banco conectado com sucesso!",
      data: resultado.rows[0],
    });
  } catch (erro) {
    console.error("Erro no banco:", erro);

    res.status(500).json({
      erro: "Erro ao conectar com o banco.",
    });
  }
});

// ========================================
// CATEGORIAS
// ========================================

// LISTAR CATEGORIAS
app.get("/categorias", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        id,
        nome,
        criado_em
      FROM categorias
      ORDER BY id ASC
    `);

    res.json(resultado.rows);
  } catch (erro) {
    console.error("Erro ao buscar categorias:", erro);

    res.status(500).json({
      erro: "Erro ao buscar categorias.",
    });
  }
});

// ========================================
// ROUPAS
// ========================================

// LISTAR ROUPAS
app.get("/roupas", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        r.id,
        r.usuario_id,
        r.categoria_id,
        r.nome,
        r.descricao,
        r.cor_principal,
        r.cor_secundaria,
        r.estilo,
        r.estacao,
        r.material,
        r.imagem_url,
        r.vezes_usada,
        r.ultimo_uso,
        r.criado_em,
        r.atualizado_em,
        c.nome AS categoria
      FROM roupas r
      LEFT JOIN categorias c
        ON c.id = r.categoria_id
      ORDER BY r.criado_em DESC
    `);

    res.json(resultado.rows);
  } catch (erro) {
    console.error("Erro ao buscar roupas:", erro);

    res.status(500).json({
      erro: "Erro ao buscar roupas.",
    });
  }
});

// BUSCAR UMA ROUPA
app.get("/roupas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `
      SELECT
        r.id,
        r.usuario_id,
        r.categoria_id,
        r.nome,
        r.descricao,
        r.cor_principal,
        r.cor_secundaria,
        r.estilo,
        r.estacao,
        r.material,
        r.imagem_url,
        r.vezes_usada,
        r.ultimo_uso,
        r.criado_em,
        r.atualizado_em,
        c.nome AS categoria
      FROM roupas r
      LEFT JOIN categorias c
        ON c.id = r.categoria_id
      WHERE r.id = $1
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        erro: "Roupa não encontrada.",
      });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao buscar roupa:", erro);

    res.status(500).json({
      erro: "Erro ao buscar roupa.",
    });
  }
});

// CADASTRAR ROUPA
app.post("/roupas", async (req, res) => {
  try {
    console.log("DADOS RECEBIDOS:", req.body);

    const {
      nome,
      cor_principal,
      imagem_url,
      categoria_id,
      usuario_id,
    } = req.body;

    if (!nome || !cor_principal) {
      return res.status(400).json({
        erro: "Nome e cor são obrigatórios.",
      });
    }

    if (!usuario_id) {
      return res.status(400).json({
        erro: "Usuário é obrigatório.",
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO roupas (
        usuario_id,
        categoria_id,
        nome,
        cor_principal,
        imagem_url
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        usuario_id,
        categoria_id || null,
        nome,
        cor_principal,
        imagem_url || null,
      ]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao cadastrar roupa:", erro);

    res.status(500).json({
      erro: "Erro ao cadastrar roupa.",
    });
  }
});

// EDITAR ROUPA
app.put("/roupas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nome,
      cor_principal,
      imagem_url,
      categoria_id,
    } = req.body;

    if (!nome || !cor_principal) {
      return res.status(400).json({
        erro: "Nome e cor são obrigatórios.",
      });
    }

    const resultado = await pool.query(
      `
      UPDATE roupas
      SET
        nome = $1,
        cor_principal = $2,
        imagem_url = $3,
        categoria_id = $4,
        atualizado_em = NOW()
      WHERE id = $5
      RETURNING *
      `,
      [
        nome,
        cor_principal,
        imagem_url || null,
        categoria_id || null,
        id,
      ]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        erro: "Roupa não encontrada.",
      });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao editar roupa:", erro);

    res.status(500).json({
      erro: "Erro ao editar roupa.",
    });
  }
});

// EXCLUIR ROUPA
app.delete("/roupas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `
      DELETE FROM roupas
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        erro: "Roupa não encontrada.",
      });
    }

    res.json({
      mensagem: "Roupa excluída com sucesso.",
      roupa: resultado.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao excluir roupa:", erro);

    res.status(500).json({
      erro: "Erro ao excluir roupa.",
    });
  }
});

// ========================================
// SERVIDOR
// ========================================

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});