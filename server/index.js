import express from 'express'
import multer from 'multer'
import bcrypt from 'bcryptjs'
import { DatabaseSync } from 'node:sqlite'
import { randomUUID, randomBytes } from 'node:crypto'
import { mkdirSync, existsSync, unlinkSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const dataDir = path.join(root, 'data')
const uploadDir = path.join(dataDir, 'uploads')
mkdirSync(uploadDir, { recursive: true })
const db = new DatabaseSync(path.join(dataDir, 'grwm.sqlite'))
db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;')
db.exec(`
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS uploads (filename TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, name TEXT NOT NULL, category TEXT NOT NULL, subcategory TEXT, color TEXT, style TEXT, season TEXT, formality TEXT, brand TEXT, size TEXT, price REAL, bought_at TEXT, notes TEXT, image TEXT NOT NULL, favorite INTEGER NOT NULL DEFAULT 0, destination TEXT, condition TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS looks (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, name TEXT NOT NULL, occasion TEXT, style TEXT, origin TEXT NOT NULL, favorite INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS look_items (look_id TEXT NOT NULL REFERENCES looks(id) ON DELETE CASCADE, item_id TEXT NOT NULL REFERENCES items(id) ON DELETE RESTRICT, PRIMARY KEY(look_id,item_id));
CREATE TABLE IF NOT EXISTS uses (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, look_id TEXT NOT NULL REFERENCES looks(id) ON DELETE CASCADE, used_at TEXT NOT NULL, liked INTEGER, again INTEGER, notes TEXT);
CREATE TABLE IF NOT EXISTS plans (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, look_id TEXT NOT NULL REFERENCES looks(id) ON DELETE CASCADE, planned_at TEXT NOT NULL, confirmed INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS preferences (user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, styles TEXT, colors TEXT, avoid_colors TEXT, item_types TEXT, notes TEXT);
CREATE TABLE IF NOT EXISTS capsules (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, name TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS capsule_items (capsule_id TEXT NOT NULL REFERENCES capsules(id) ON DELETE CASCADE, item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE, PRIMARY KEY(capsule_id,item_id));
CREATE TABLE IF NOT EXISTS inspirations (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, image TEXT NOT NULL, title TEXT NOT NULL, category TEXT, color TEXT, style TEXT, notes TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, look_id TEXT NOT NULL REFERENCES looks(id) ON DELETE CASCADE, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS saved_posts (user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE, PRIMARY KEY(user_id,post_id));
CREATE TABLE IF NOT EXISTS trips (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, name TEXT NOT NULL, destination TEXT NOT NULL, starts_at TEXT NOT NULL, ends_at TEXT NOT NULL, activities TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS trip_looks (trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE, look_id TEXT NOT NULL REFERENCES looks(id) ON DELETE CASCADE, day TEXT NOT NULL, activity TEXT, PRIMARY KEY(trip_id,look_id,day));
CREATE TABLE IF NOT EXISTS trip_packed (trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE, item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE, PRIMARY KEY(trip_id,item_id));
CREATE TABLE IF NOT EXISTS feedback (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, item_ids TEXT NOT NULL, occasion TEXT, liked INTEGER NOT NULL, created_at TEXT NOT NULL);
`)

const app = express()
app.use(express.json({ limit: '1mb' }))
app.use('/uploads', auth, (req,res,next) => { const filename=path.basename(req.path); const own=db.prepare('SELECT 1 FROM uploads WHERE filename=? AND user_id=?').get(filename,req.userId); const published=db.prepare('SELECT 1 FROM items i JOIN look_items li ON li.item_id=i.id JOIN posts p ON p.look_id=li.look_id WHERE i.image=? LIMIT 1').get(`/uploads/${filename}`); if(!own&&!published) return fail(res,403,'Imagem não disponível.'); next() }, express.static(uploadDir))
const upload = multer({ storage: multer.diskStorage({ destination: uploadDir, filename: (_req, file, cb) => cb(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`) }), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_req, file, cb) => cb(null, ['image/jpeg','image/png','image/webp'].includes(file.mimetype)) })

const now = () => new Date().toISOString()
const fail = (res, code, message) => res.status(code).json({ error: message })
const get = (table, id, userId) => db.prepare(`SELECT * FROM ${table} WHERE id = ? AND user_id = ?`).get(id, userId)
const clean = (value) => typeof value === 'string' ? value.trim() : ''
function auth(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer /, '') || req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith('grwm-session='))?.split('=')[1]
  const row = token && db.prepare('SELECT user_id FROM sessions WHERE token = ?').get(token)
  if (!row) return fail(res, 401, 'Entre na sua conta para continuar.')
  req.userId = row.user_id
  req.token = token
  next()
}
function safe(handler) { return (req, res, next) => { try { handler(req, res) } catch (error) { next(error) } } }
function idsForLook(id) { return db.prepare('SELECT item_id FROM look_items WHERE look_id = ?').all(id).map(row => row.item_id) }
function lookWithItems(row) { return { ...row, itemIds: idsForLook(row.id) } }

app.post('/api/register', safe((req, res) => {
  const name = clean(req.body.name), email = clean(req.body.email).toLowerCase(), password = req.body.password
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || typeof password !== 'string' || password.length < 8) return fail(res, 400, 'Informe nome, e-mail válido e senha de pelo menos 8 caracteres.')
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) return fail(res, 409, 'Este e-mail já está cadastrado.')
  const id = randomUUID(), token = randomBytes(32).toString('hex')
  db.prepare('INSERT INTO users VALUES (?,?,?,?,?)').run(id, name, email, bcrypt.hashSync(password, 10), now())
  db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(token, id, now())
  res.setHeader('Set-Cookie',`grwm-session=${token}; HttpOnly; SameSite=Strict; Path=/`)
  res.status(201).json({ token, user: { id, name, email } })
}))
app.post('/api/login', safe((req, res) => {
  const email = clean(req.body.email).toLowerCase()
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user || !bcrypt.compareSync(req.body.password || '', user.password)) return fail(res, 401, 'E-mail ou senha incorretos.')
  const token = randomBytes(32).toString('hex')
  db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(token, user.id, now())
  res.setHeader('Set-Cookie',`grwm-session=${token}; HttpOnly; SameSite=Strict; Path=/`)
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
}))
app.post('/api/logout', auth, safe((req, res) => { db.prepare('DELETE FROM sessions WHERE token = ?').run(req.token); res.setHeader('Set-Cookie','grwm-session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'); res.json({ ok: true }) }))
app.get('/api/me', auth, safe((req, res) => { const u = db.prepare('SELECT id,name,email FROM users WHERE id = ?').get(req.userId); res.json(u) }))
app.put('/api/me', auth, safe((req, res) => { const name = clean(req.body.name); if (name.length < 2) return fail(res,400,'Informe um nome válido.'); db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name,req.userId); res.json(db.prepare('SELECT id,name,email FROM users WHERE id = ?').get(req.userId)) }))
app.post('/api/upload', auth, upload.single('image'), safe((req, res) => { if (!req.file) return fail(res,400,'Envie uma imagem JPG, PNG ou WebP de até 5 MB.'); db.prepare('INSERT INTO uploads VALUES (?,?,?)').run(req.file.filename,req.userId,now()); res.json({ image: `/uploads/${req.file.filename}` }) }))
app.get('/api/features', (_req,res) => res.json({vision:!!process.env.OPENAI_API_KEY,tryOn:!!process.env.OPENAI_API_KEY}))
app.post('/api/vision', auth, async (req,res) => {
  if(!process.env.OPENAI_API_KEY) return fail(res,503,'Análise automática não configurada. Preencha os campos manualmente.')
  const filename=path.basename(clean(req.body.image))
  if(!filename || !db.prepare('SELECT 1 FROM uploads WHERE filename=? AND user_id=?').get(filename,req.userId)) return fail(res,400,'Envie uma foto sua antes de analisar.')
  try {
    const ext=path.extname(filename).toLowerCase(),mime=ext==='.png'?'image/png':ext==='.webp'?'image/webp':'image/jpeg'
    const image=`data:${mime};base64,${readFileSync(path.join(uploadDir,filename)).toString('base64')}`
    const prompt='Analise a imagem de moda. Retorne somente um objeto JSON com category (categoria de roupa ou produto), color (cor predominante), style (estilo predominante), season (estação ou clima sugerido), formality (formalidade) e notes (breve explicação). Se não conseguir identificar uma característica, use string vazia. Não invente marca ou preço.'
    const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_VISION_MODEL||'gpt-5.6-luna',store:false,input:[{role:'user',content:[{type:'input_text',text:prompt},{type:'input_image',image_url:image}]}]})})
    if(!response.ok) return fail(res,502,'A análise automática falhou. Preencha os campos manualmente.')
    const data=await response.json()
    const content=data.output?.flatMap(x=>x.content||[]).find(x=>x.type==='output_text')?.text||''
    const parsed=JSON.parse(content.replace(/^```(?:json)?\s*|\s*```$/g,''))
    res.json(Object.fromEntries(['category','color','style','season','formality','notes'].map(x=>[x,typeof parsed[x]==='string'?parsed[x]:''])))
  } catch(error) {console.error(error);fail(res,502,'Não foi possível analisar a imagem. Continue o cadastro manualmente.')}
})
app.post('/api/try-on', auth, async (req,res) => {
  if(!process.env.OPENAI_API_KEY) return fail(res,503,'Simulação visual não configurada.')
  const person=path.basename(clean(req.body.personImage)),item=get('items',req.body.itemId,req.userId),mode=req.body.mode==='makeup'?'makeup':'clothes'
  if(!db.prepare('SELECT 1 FROM uploads WHERE filename=? AND user_id=?').get(person,req.userId)||!item) return fail(res,400,'Envie sua foto e escolha uma peça do seu closet.')
  if(mode==='makeup'&&item.category!=='Maquiagem') return fail(res,400,'Escolha um produto de maquiagem.')
  if(mode==='clothes'&&!['Blusas','Camisas','Calças','Saias','Vestidos','Casacos'].includes(item.category)) return fail(res,400,'A experiência inicial aceita apenas roupas.')
  const clothing=path.basename(item.image)
  if(!db.prepare('SELECT 1 FROM uploads WHERE filename=? AND user_id=?').get(clothing,req.userId)) return fail(res,400,'Imagem da peça indisponível.')
  try {
    const form=new FormData()
    form.append('model',process.env.OPENAI_IMAGE_MODEL||'gpt-image-2.5-sunburst')
    for(const filename of [person,clothing]) {const ext=path.extname(filename).toLowerCase(),mime=ext==='.png'?'image/png':ext==='.webp'?'image/webp':'image/jpeg';form.append('image[]',new Blob([readFileSync(path.join(uploadDir,filename))],{type:mime}),filename)}
    form.append('prompt',mode==='makeup'?`Crie uma visualização fotográfica aproximada da pessoa da primeira imagem usando uma maquiagem inspirada no produto da segunda imagem (${item.name}). Preserve a identidade da pessoa, o enquadramento e outros elementos visíveis. Não altere o rosto além da maquiagem.`:`Crie uma visualização fotográfica aproximada da pessoa da primeira imagem vestindo a roupa da segunda imagem (${item.name}). Preserve a identidade da pessoa, a pose e o cenário. Mude apenas a roupa necessária. O resultado é uma simulação visual, não uma indicação precisa de tamanho ou caimento.`)
    const response=await fetch('https://api.openai.com/v1/images/edits',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},body:form})
    if(!response.ok) return fail(res,502,'A simulação visual falhou. Confira o acesso ao modelo de imagem e tente novamente.')
    const data=await response.json(),encoded=data.data?.[0]?.b64_json
    if(!encoded) return fail(res,502,'O serviço não devolveu uma imagem.')
    const filename=`${randomUUID()}.png`
    writeFileSync(path.join(uploadDir,filename),Buffer.from(encoded,'base64'))
    db.prepare('INSERT INTO uploads VALUES (?,?,?)').run(filename,req.userId,now())
    res.json({image:`/uploads/${filename}`})
  } catch(error) {console.error(error);fail(res,502,'Não foi possível concluir a simulação visual.')}
})

const itemFields = ['name','category','subcategory','color','style','season','formality','brand','size','price','bought_at','notes','image','favorite','destination','condition']
function itemValues(body) { return itemFields.map(f => f === 'price' ? (body[f] === '' || body[f] == null ? null : Number(body[f])) : f === 'favorite' ? (body[f] ? 1 : 0) : clean(body[f]) || null) }
function validateItem(body, res) { if (!clean(body.name) || !clean(body.category) || !clean(body.image)) { fail(res,400,'Nome, categoria e foto são obrigatórios.'); return false } if (body.price != null && body.price !== '' && (!Number.isFinite(Number(body.price)) || Number(body.price)<0)) { fail(res,400,'Preço inválido.'); return false } return true }
app.get('/api/items', auth, safe((req,res) => res.json(db.prepare('SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC').all(req.userId))))
app.post('/api/items', auth, safe((req,res) => { if (!validateItem(req.body,res)) return; const id=randomUUID(); db.prepare(`INSERT INTO items (id,user_id,${itemFields.join(',')},created_at) VALUES (${Array(itemFields.length+3).fill('?').join(',')})`).run(id,req.userId,...itemValues(req.body),now()); res.status(201).json(get('items',id,req.userId)) }))
app.put('/api/items/:id', auth, safe((req,res) => { const old=get('items',req.params.id,req.userId); if (!old) return fail(res,404,'Peça não encontrada.'); const body={...old,...req.body}; if (!validateItem(body,res)) return; db.prepare(`UPDATE items SET ${itemFields.map(f=>`${f} = ?`).join(',')} WHERE id = ? AND user_id = ?`).run(...itemValues(body),req.params.id,req.userId); res.json(get('items',req.params.id,req.userId)) }))
app.delete('/api/items/:id', auth, safe((req,res) => { const item=get('items',req.params.id,req.userId); if (!item) return fail(res,404,'Peça não encontrada.'); if (db.prepare('SELECT 1 FROM look_items WHERE item_id = ? LIMIT 1').get(item.id)) return fail(res,409,'Remova a peça dos looks antes de excluí-la para preservar o histórico.'); db.prepare('DELETE FROM items WHERE id = ? AND user_id = ?').run(item.id,req.userId); if (item.image?.startsWith('/uploads/')) { const file=path.join(uploadDir,path.basename(item.image)); if (existsSync(file)) unlinkSync(file) } res.json({ok:true}) }))

function validateLook(req,res) { const ids=[...new Set(req.body.itemIds || [])]; if (!clean(req.body.name) || !ids.length) { fail(res,400,'Informe um nome e selecione ao menos uma peça.'); return null } for (const id of ids) if (!get('items',id,req.userId)) { fail(res,400,'O look contém uma peça indisponível.'); return null } return ids }
app.get('/api/looks', auth, safe((req,res) => res.json(db.prepare('SELECT * FROM looks WHERE user_id = ? ORDER BY created_at DESC').all(req.userId).map(lookWithItems))))
app.post('/api/looks', auth, safe((req,res) => { const ids=validateLook(req,res); if (!ids) return; const id=randomUUID(); db.prepare('INSERT INTO looks VALUES (?,?,?,?,?,?,?,?)').run(id,req.userId,clean(req.body.name),clean(req.body.occasion)||null,clean(req.body.style)||null,clean(req.body.origin)||'manual',req.body.favorite?1:0,now()); const stmt=db.prepare('INSERT INTO look_items VALUES (?,?)'); ids.forEach(itemId=>stmt.run(id,itemId)); res.status(201).json(lookWithItems(get('looks',id,req.userId))) }))
app.put('/api/looks/:id', auth, safe((req,res) => { const old=get('looks',req.params.id,req.userId); if (!old) return fail(res,404,'Look não encontrado.'); const body={...old,itemIds:idsForLook(old.id),...req.body}; req.body=body; const ids=validateLook(req,res); if (!ids) return; db.prepare('UPDATE looks SET name=?,occasion=?,style=?,favorite=? WHERE id=? AND user_id=?').run(clean(body.name),clean(body.occasion)||null,clean(body.style)||null,body.favorite?1:0,old.id,req.userId); db.prepare('DELETE FROM look_items WHERE look_id = ?').run(old.id); ids.forEach(itemId=>db.prepare('INSERT INTO look_items VALUES (?,?)').run(old.id,itemId)); res.json(lookWithItems(get('looks',old.id,req.userId))) }))
app.delete('/api/looks/:id', auth, safe((req,res) => { if (!get('looks',req.params.id,req.userId)) return fail(res,404,'Look não encontrado.'); db.prepare('DELETE FROM looks WHERE id = ? AND user_id = ?').run(req.params.id,req.userId); res.json({ok:true}) }))
app.get('/api/uses', auth, safe((req,res) => res.json(db.prepare('SELECT * FROM uses WHERE user_id = ? ORDER BY used_at DESC').all(req.userId))))
app.post('/api/uses', auth, safe((req,res) => { if (!get('looks',req.body.lookId,req.userId)) return fail(res,400,'Look inválido.'); const id=randomUUID(), day=clean(req.body.usedAt)||now().slice(0,10); db.prepare('INSERT INTO uses VALUES (?,?,?,?,?,?,?)').run(id,req.userId,req.body.lookId,day,req.body.liked==null?null:(req.body.liked?1:0),req.body.again==null?null:(req.body.again?1:0),clean(req.body.notes)||null); res.status(201).json({id,look_id:req.body.lookId,used_at:day}) }))
app.delete('/api/uses/:id', auth, safe((req,res) => { db.prepare('DELETE FROM uses WHERE id = ? AND user_id = ?').run(req.params.id,req.userId); res.json({ok:true}) }))
app.get('/api/plans', auth, safe((req,res) => res.json(db.prepare('SELECT * FROM plans WHERE user_id=? ORDER BY planned_at DESC').all(req.userId))))
app.post('/api/plans', auth, safe((req,res) => { if (!get('looks',req.body.lookId,req.userId)||!/^\d{4}-\d{2}-\d{2}$/.test(clean(req.body.plannedAt))) return fail(res,400,'Look ou data inválida.'); const id=randomUUID(); db.prepare('INSERT INTO plans VALUES (?,?,?,?,0)').run(id,req.userId,req.body.lookId,req.body.plannedAt); res.status(201).json({id}) }))
app.post('/api/plans/:id/confirm', auth, safe((req,res) => { const plan=db.prepare('SELECT * FROM plans WHERE id=? AND user_id=?').get(req.params.id,req.userId); if (!plan) return fail(res,404,'Planejamento não encontrado.'); if (plan.confirmed) return fail(res,409,'Este uso já foi confirmado.'); const id=randomUUID(); db.prepare('INSERT INTO uses VALUES (?,?,?,?,?,?,?)').run(id,req.userId,plan.look_id,plan.planned_at,null,null,null); db.prepare('UPDATE plans SET confirmed=1 WHERE id=?').run(plan.id); res.json({ok:true}) }))
app.delete('/api/plans/:id', auth, safe((req,res) => { db.prepare('DELETE FROM plans WHERE id=? AND user_id=?').run(req.params.id,req.userId); res.json({ok:true}) }))

app.get('/api/preferences', auth, safe((req,res) => res.json(db.prepare('SELECT * FROM preferences WHERE user_id = ?').get(req.userId)||{user_id:req.userId,styles:'',colors:'',avoid_colors:'',item_types:'',notes:''})))
app.put('/api/preferences', auth, safe((req,res) => { const f=['styles','colors','avoid_colors','item_types','notes']; db.prepare(`INSERT INTO preferences (user_id,${f.join(',')}) VALUES (?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET ${f.map(x=>`${x}=excluded.${x}`).join(',')}`).run(req.userId,...f.map(x=>clean(req.body[x]))); res.json(db.prepare('SELECT * FROM preferences WHERE user_id = ?').get(req.userId)) }))

app.get('/api/capsules', auth, safe((req,res) => res.json(db.prepare('SELECT * FROM capsules WHERE user_id = ? ORDER BY created_at DESC').all(req.userId).map(row=>({...row,itemIds:db.prepare('SELECT item_id FROM capsule_items WHERE capsule_id = ?').all(row.id).map(x=>x.item_id)})))))
app.post('/api/capsules', auth, safe((req,res) => { const name=clean(req.body.name), ids=[...new Set(req.body.itemIds||[])]; if (!name) return fail(res,400,'Informe um nome.'); if (ids.some(id=>!get('items',id,req.userId))) return fail(res,400,'Peça inválida.'); const id=randomUUID(); db.prepare('INSERT INTO capsules VALUES (?,?,?,?)').run(id,req.userId,name,now()); ids.forEach(x=>db.prepare('INSERT INTO capsule_items VALUES (?,?)').run(id,x)); res.status(201).json({id,name,itemIds:ids}) }))
app.delete('/api/capsules/:id', auth, safe((req,res) => { db.prepare('DELETE FROM capsules WHERE id=? AND user_id=?').run(req.params.id,req.userId); res.json({ok:true}) }))

app.get('/api/inspirations', auth, safe((req,res) => res.json(db.prepare('SELECT * FROM inspirations WHERE user_id = ? ORDER BY created_at DESC').all(req.userId))))
app.post('/api/inspirations', auth, safe((req,res) => { const image=clean(req.body.image),title=clean(req.body.title); if (!image||!title) return fail(res,400,'Informe imagem e título.'); const id=randomUUID(); db.prepare('INSERT INTO inspirations VALUES (?,?,?,?,?,?,?,?,?)').run(id,req.userId,image,title,clean(req.body.category)||null,clean(req.body.color)||null,clean(req.body.style)||null,clean(req.body.notes)||null,now()); res.status(201).json(get('inspirations',id,req.userId)) }))
app.delete('/api/inspirations/:id', auth, safe((req,res) => { db.prepare('DELETE FROM inspirations WHERE id=? AND user_id=?').run(req.params.id,req.userId); res.json({ok:true}) }))
app.get('/api/posts', auth, safe((req,res) => res.json(db.prepare('SELECT p.*,u.name AS author,l.name AS look_name FROM posts p JOIN users u ON u.id=p.user_id JOIN looks l ON l.id=p.look_id ORDER BY p.created_at DESC').all().map(p=>({...p,itemIds:idsForLook(p.look_id),pieces:db.prepare('SELECT i.id,i.name,i.category,i.color,i.style,i.image FROM items i JOIN look_items li ON li.item_id=i.id WHERE li.look_id=?').all(p.look_id),saved:!!db.prepare('SELECT 1 FROM saved_posts WHERE user_id=? AND post_id=?').get(req.userId,p.id)})))))
app.post('/api/posts', auth, safe((req,res) => { if (!get('looks',req.body.lookId,req.userId)) return fail(res,400,'Publique um look seu.'); if (db.prepare('SELECT 1 FROM posts WHERE look_id=?').get(req.body.lookId)) return fail(res,409,'Este look já foi publicado.'); const id=randomUUID(); db.prepare('INSERT INTO posts VALUES (?,?,?,?)').run(id,req.userId,req.body.lookId,now()); res.status(201).json({id}) }))
app.delete('/api/posts/:id', auth, safe((req,res) => { db.prepare('DELETE FROM posts WHERE id=? AND user_id=?').run(req.params.id,req.userId); res.json({ok:true}) }))
app.post('/api/posts/:id/save', auth, safe((req,res) => { if (!db.prepare('SELECT 1 FROM posts WHERE id=?').get(req.params.id)) return fail(res,404,'Publicação não encontrada.'); db.prepare('INSERT OR IGNORE INTO saved_posts VALUES (?,?)').run(req.userId,req.params.id); res.json({ok:true}) }))
app.delete('/api/posts/:id/save', auth, safe((req,res) => { db.prepare('DELETE FROM saved_posts WHERE user_id=? AND post_id=?').run(req.userId,req.params.id); res.json({ok:true}) }))

app.get('/api/trips', auth, safe((req,res) => res.json(db.prepare('SELECT * FROM trips WHERE user_id=? ORDER BY starts_at DESC').all(req.userId).map(t=>({...t,plans:db.prepare('SELECT * FROM trip_looks WHERE trip_id=?').all(t.id),packed:db.prepare('SELECT item_id FROM trip_packed WHERE trip_id=?').all(t.id).map(x=>x.item_id)})))))
app.post('/api/trips', auth, safe((req,res) => { const {name,destination,startsAt,endsAt}=req.body; if (![name,destination,startsAt,endsAt].every(clean)||endsAt<startsAt) return fail(res,400,'Informe nome, destino e período válido.'); const id=randomUUID(); db.prepare('INSERT INTO trips VALUES (?,?,?,?,?,?,?,?)').run(id,req.userId,clean(name),clean(destination),startsAt,endsAt,clean(req.body.activities)||null,now()); res.status(201).json(get('trips',id,req.userId)) }))
app.post('/api/trips/:id/looks', auth, safe((req,res) => { const trip=get('trips',req.params.id,req.userId),look=get('looks',req.body.lookId,req.userId),day=clean(req.body.day); if (!trip||!look||!day||day<trip.starts_at||day>trip.ends_at) return fail(res,400,'Viagem, look ou dia inválido.'); db.prepare('INSERT OR REPLACE INTO trip_looks VALUES (?,?,?,?)').run(trip.id,look.id,day,clean(req.body.activity)||null); res.json({ok:true}) }))
app.delete('/api/trips/:id/looks', auth, safe((req,res) => { if (!get('trips',req.params.id,req.userId)) return fail(res,404,'Viagem não encontrada.'); db.prepare('DELETE FROM trip_looks WHERE trip_id=? AND look_id=? AND day=?').run(req.params.id,req.body.lookId,req.body.day); res.json({ok:true}) }))
app.post('/api/trips/:id/pack/:itemId', auth, safe((req,res) => { if (!get('trips',req.params.id,req.userId)||!get('items',req.params.itemId,req.userId)) return fail(res,404,'Item não encontrado.'); db.prepare('INSERT OR IGNORE INTO trip_packed VALUES (?,?)').run(req.params.id,req.params.itemId); res.json({ok:true}) }))
app.delete('/api/trips/:id/pack/:itemId', auth, safe((req,res) => { db.prepare('DELETE FROM trip_packed WHERE trip_id=? AND item_id=?').run(req.params.id,req.params.itemId); res.json({ok:true}) }))
app.delete('/api/trips/:id', auth, safe((req,res) => { db.prepare('DELETE FROM trips WHERE id=? AND user_id=?').run(req.params.id,req.userId); res.json({ok:true}) }))

app.get('/api/feedback', auth, safe((req,res) => res.json(db.prepare('SELECT * FROM feedback WHERE user_id=? ORDER BY created_at DESC').all(req.userId))))
app.post('/api/feedback', auth, safe((req,res) => { const ids=req.body.itemIds||[]; if (!ids.length||ids.some(id=>!get('items',id,req.userId))) return fail(res,400,'Sugestão inválida.'); const id=randomUUID(); db.prepare('INSERT INTO feedback VALUES (?,?,?,?,?,?)').run(id,req.userId,JSON.stringify(ids),clean(req.body.occasion)||null,req.body.liked?1:0,now()); res.status(201).json({id}) }))
app.get('/api/health', (_req,res) => res.json({ok:true}))
const distDir = path.join(root, 'dist')
if (existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get(/^(?!\/api|\/uploads).*/, (_req,res) => res.sendFile(path.join(distDir,'index.html')))
}
app.use((error, _req, res, _next) => { console.error(error); if (error instanceof multer.MulterError) return fail(res,400,'Imagem acima do limite de 5 MB.'); if (error.code?.startsWith('SQLITE_CONSTRAINT')) return fail(res,409,'Este registro está em uso ou já existe.'); fail(res,500,'Não foi possível concluir a operação.') })
const port=Number(process.env.PORT)||3001
app.listen(port,'127.0.0.1',()=>console.log(`API GRWM em http://127.0.0.1:${port}`))

