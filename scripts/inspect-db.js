import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL não configurada. Copie .env.example para .env e informe a conexão do Supabase.')
  process.exit(1)
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, options: '-c search_path=grwm_app', max: 1 })

try {
  const tables = await pool.query("SELECT tablename FROM pg_tables WHERE schemaname = 'grwm_app' ORDER BY tablename")
  console.log('Conexão com o PostgreSQL/Supabase: OK\n')
  console.log('Tabelas e quantidades:')
  for (const { tablename } of tables.rows) {
    const result = await pool.query(`SELECT COUNT(*)::int AS total FROM "${tablename}"`)
    console.log(`- ${tablename}: ${result.rows[0].total}`)
  }

  console.log('\nUsuários (senhas não são exibidas):')
  console.table((await pool.query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 50')).rows)
  console.log('Peças cadastradas:')
  console.table((await pool.query('SELECT id, user_id, name, category, color, favorite, created_at FROM items ORDER BY created_at DESC LIMIT 50')).rows)
  console.log('Looks cadastrados:')
  console.table((await pool.query('SELECT id, user_id, name, occasion, favorite, created_at FROM looks ORDER BY created_at DESC LIMIT 50')).rows)
} catch (error) {
  console.error('Não foi possível consultar o banco:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}

