import 'dotenv/config'
import express from 'express'
import multer from 'multer'
import bcrypt from 'bcryptjs'
import pg from 'pg'
import { randomUUID, randomBytes } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

if(!process.env.DATABASE_URL) throw new Error('DATABASE_URL não configurada. Copie .env.example para .env e informe a conexão do Supabase.')
pg.types.setTypeParser(1082,v=>v);pg.types.setTypeParser(1700,v=>Number(v))
const databaseConfig={connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==='test'?false:{rejectUnauthorized:false}}
const bootstrap=new pg.Client(databaseConfig);await bootstrap.connect();await bootstrap.query('CREATE SCHEMA IF NOT EXISTS grwm_app');await bootstrap.end()
const pool=new pg.Pool({...databaseConfig,options:'-c search_path=grwm_app',max:10})
const root=process.cwd()
await pool.query(readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)),'schema.sql'),'utf8'))
const app=express(),clean=v=>typeof v==='string'?v.trim():'',now=()=>new Date().toISOString(),fail=(res,c,m)=>res.status(c).json({error:m})
const safe=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next),one=async(q,p=[])=>(await pool.query(q,p)).rows[0],rows=async(q,p=[])=>(await pool.query(q,p)).rows
const get=(table,id,user)=>one(`SELECT * FROM ${table} WHERE id=$1 AND user_id=$2`,[id,user])
async function tx(fn){const c=await pool.connect();try{await c.query('BEGIN');const r=await fn(c);await c.query('COMMIT');return r}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}}
async function auth(req,res,next){const token=req.headers.authorization?.replace(/^Bearer /,'')||req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith('grwm-session='))?.split('=')[1],s=token&&await one('SELECT user_id FROM sessions WHERE token=$1',[token]);if(!s)return fail(res,401,'Entre na sua conta para continuar.');req.userId=s.user_id;req.token=token;next()}
const idsForLook=async id=>(await rows('SELECT item_id FROM look_items WHERE look_id=$1',[id])).map(x=>x.item_id)
const withItems=async l=>({...l,itemIds:await idsForLook(l.id)})
async function validIds(ids,user){if(!ids.length)return false;return (await one('SELECT COUNT(*)::int n FROM items WHERE user_id=$1 AND id=ANY($2::uuid[])',[user,ids])).n===ids.length}
app.use(express.json({limit:'1mb'}))
app.get('/uploads/:filename',auth,safe(async(req,res)=>{const filename=path.basename(req.params.filename),owned=await one('SELECT mime_type,content FROM uploads WHERE filename=$1 AND user_id=$2',[filename,req.userId]),published=owned||await one('SELECT u.mime_type,u.content FROM uploads u JOIN items i ON i.image=$1 JOIN look_items li ON li.item_id=i.id JOIN posts p ON p.look_id=li.look_id WHERE u.filename=$2 LIMIT 1',[`/uploads/${filename}`,filename]);if(!published?.content)return fail(res,403,'Imagem não disponível.');res.type(published.mime_type||'application/octet-stream').send(published.content)}))
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:5242880},fileFilter:(_r,f,cb)=>cb(null,['image/jpeg','image/png','image/webp'].includes(f.mimetype))})

app.post('/api/register',safe(async(req,res)=>{const name=clean(req.body.name),email=clean(req.body.email).toLowerCase(),password=req.body.password;if(name.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof password!=='string'||password.length<8)return fail(res,400,'Informe nome, e-mail válido e senha de pelo menos 8 caracteres.');if(await one('SELECT 1 FROM users WHERE email=$1',[email]))return fail(res,409,'Este e-mail já está cadastrado.');const id=randomUUID(),token=randomBytes(32).toString('hex');await tx(async c=>{await c.query('INSERT INTO users VALUES($1,$2,$3,$4,$5)',[id,name,email,bcrypt.hashSync(password,10),now()]);await c.query('INSERT INTO sessions VALUES($1,$2,$3)',[token,id,now()])});res.status(201).json({token,user:{id,name,email}})}))
app.post('/api/login',safe(async(req,res)=>{const u=await one('SELECT * FROM users WHERE email=$1',[clean(req.body.email).toLowerCase()]);if(!u||!bcrypt.compareSync(req.body.password||'',u.password))return fail(res,401,'E-mail ou senha incorretos.');const token=randomBytes(32).toString('hex');await pool.query('INSERT INTO sessions VALUES($1,$2,$3)',[token,u.id,now()]);res.json({token,user:{id:u.id,name:u.name,email:u.email}})}))
app.post('/api/logout',auth,safe(async(req,res)=>{await pool.query('DELETE FROM sessions WHERE token=$1',[req.token]);res.json({ok:true})}))
app.get('/api/me',auth,safe(async(req,res)=>res.json(await one('SELECT id,name,email FROM users WHERE id=$1',[req.userId]))))
app.put('/api/me',auth,safe(async(req,res)=>{const name=clean(req.body.name);if(name.length<2)return fail(res,400,'Nome inválido.');res.json(await one('UPDATE users SET name=$1 WHERE id=$2 RETURNING id,name,email',[name,req.userId]))}))
app.post('/api/upload',auth,upload.single('image'),safe(async(req,res)=>{if(!req.file)return fail(res,400,'Envie JPG, PNG ou WebP de até 5 MB.');const filename=`${randomUUID()}${path.extname(req.file.originalname).toLowerCase()}`;await pool.query('INSERT INTO uploads(filename,user_id,mime_type,content,created_at) VALUES($1,$2,$3,$4,$5)',[filename,req.userId,req.file.mimetype,req.file.buffer,now()]);res.json({image:`/uploads/${filename}`})}))
app.get('/api/features',(_r,res)=>res.json({vision:false,tryOn:false}))

const fields=['name','category','subcategory','color','style','season','formality','brand','size','price','bought_at','notes','image','favorite','destination','condition']
const vals=b=>fields.map(f=>f==='price'?(b[f]===''||b[f]==null?null:Number(b[f])):f==='favorite'?(b[f]?1:0):clean(b[f])||null)
app.get('/api/items',auth,safe(async(req,res)=>res.json(await rows('SELECT * FROM items WHERE user_id=$1 ORDER BY created_at DESC',[req.userId]))))
app.post('/api/items',auth,safe(async(req,res)=>{if(!clean(req.body.name)||!clean(req.body.category)||!clean(req.body.image))return fail(res,400,'Nome, categoria e foto são obrigatórios.');const id=randomUUID(),v=[id,req.userId,...vals(req.body),now()];await pool.query(`INSERT INTO items(id,user_id,${fields.join(',')},created_at) VALUES(${v.map((_,i)=>`$${i+1}`).join(',')})`,v);res.status(201).json(await get('items',id,req.userId))}))
app.put('/api/items/:id',auth,safe(async(req,res)=>{const old=await get('items',req.params.id,req.userId);if(!old)return fail(res,404,'Peça não encontrada.');const v=vals({...old,...req.body});await pool.query(`UPDATE items SET ${fields.map((f,i)=>`${f}=$${i+1}`).join(',')} WHERE id=$${v.length+1} AND user_id=$${v.length+2}`,[...v,old.id,req.userId]);res.json(await get('items',old.id,req.userId))}))
app.delete('/api/items/:id',auth,safe(async(req,res)=>{const i=await get('items',req.params.id,req.userId);if(!i)return fail(res,404,'Peça não encontrada.');if(await one('SELECT 1 FROM look_items WHERE item_id=$1',[i.id]))return fail(res,409,'Remova a peça dos looks antes de excluir.');await pool.query('DELETE FROM items WHERE id=$1',[i.id]);if(i.image?.startsWith('/uploads/'))await pool.query('DELETE FROM uploads WHERE filename=$1 AND user_id=$2',[path.basename(i.image),req.userId]);res.json({ok:true})}))

app.get('/api/looks',auth,safe(async(req,res)=>res.json(await Promise.all((await rows('SELECT * FROM looks WHERE user_id=$1 ORDER BY created_at DESC',[req.userId])).map(withItems)))))
app.post('/api/looks',auth,safe(async(req,res)=>{const ids=[...new Set(req.body.itemIds||[])];if(!clean(req.body.name)||!await validIds(ids,req.userId))return fail(res,400,'Nome ou peças inválidas.');const id=randomUUID();await tx(async c=>{await c.query('INSERT INTO looks VALUES($1,$2,$3,$4,$5,$6,$7,$8)',[id,req.userId,clean(req.body.name),clean(req.body.occasion)||null,clean(req.body.style)||null,clean(req.body.origin)||'manual',req.body.favorite?1:0,now()]);for(const x of ids)await c.query('INSERT INTO look_items VALUES($1,$2)',[id,x])});res.status(201).json(await withItems(await get('looks',id,req.userId)))}))
app.put('/api/looks/:id',auth,safe(async(req,res)=>{const old=await get('looks',req.params.id,req.userId);if(!old)return fail(res,404,'Look não encontrado.');const ids=[...new Set(req.body.itemIds||await idsForLook(old.id))];if(!await validIds(ids,req.userId))return fail(res,400,'Peças inválidas.');await tx(async c=>{await c.query('UPDATE looks SET name=$1,occasion=$2,style=$3,favorite=$4 WHERE id=$5',[clean(req.body.name||old.name),clean(req.body.occasion)||null,clean(req.body.style)||null,req.body.favorite?1:0,old.id]);await c.query('DELETE FROM look_items WHERE look_id=$1',[old.id]);for(const x of ids)await c.query('INSERT INTO look_items VALUES($1,$2)',[old.id,x])});res.json(await withItems(await get('looks',old.id,req.userId)))}))
app.delete('/api/looks/:id',auth,safe(async(req,res)=>{await pool.query('DELETE FROM looks WHERE id=$1 AND user_id=$2',[req.params.id,req.userId]);res.json({ok:true})}))

app.get('/api/uses',auth,safe(async(req,res)=>res.json(await rows('SELECT * FROM uses WHERE user_id=$1 ORDER BY used_at DESC',[req.userId]))))
app.post('/api/uses',auth,safe(async(req,res)=>{if(!await get('looks',req.body.lookId,req.userId))return fail(res,400,'Look inválido.');const id=randomUUID(),day=clean(req.body.usedAt)||now().slice(0,10);await pool.query('INSERT INTO uses VALUES($1,$2,$3,$4,$5,$6,$7)',[id,req.userId,req.body.lookId,day,req.body.liked==null?null:(req.body.liked?1:0),req.body.again==null?null:(req.body.again?1:0),clean(req.body.notes)||null]);res.status(201).json({id})}))
app.delete('/api/uses/:id',auth,safe(async(req,res)=>{await pool.query('DELETE FROM uses WHERE id=$1 AND user_id=$2',[req.params.id,req.userId]);res.json({ok:true})}))
app.get('/api/plans',auth,safe(async(req,res)=>res.json(await rows('SELECT * FROM plans WHERE user_id=$1 ORDER BY planned_at DESC',[req.userId]))))
app.post('/api/plans',auth,safe(async(req,res)=>{if(!await get('looks',req.body.lookId,req.userId))return fail(res,400,'Look inválido.');const id=randomUUID();await pool.query('INSERT INTO plans VALUES($1,$2,$3,$4,0)',[id,req.userId,req.body.lookId,req.body.plannedAt]);res.status(201).json({id})}))
app.post('/api/plans/:id/confirm',auth,safe(async(req,res)=>{const p=await one('SELECT * FROM plans WHERE id=$1 AND user_id=$2',[req.params.id,req.userId]);if(!p||p.confirmed)return fail(res,p?409:404,'Planejamento indisponível.');await tx(async c=>{await c.query('INSERT INTO uses VALUES($1,$2,$3,$4,NULL,NULL,NULL)',[randomUUID(),req.userId,p.look_id,p.planned_at]);await c.query('UPDATE plans SET confirmed=1 WHERE id=$1',[p.id])});res.json({ok:true})}))
app.delete('/api/plans/:id',auth,safe(async(req,res)=>{await pool.query('DELETE FROM plans WHERE id=$1 AND user_id=$2',[req.params.id,req.userId]);res.json({ok:true})}))
app.get('/api/preferences',auth,safe(async(req,res)=>res.json(await one('SELECT * FROM preferences WHERE user_id=$1',[req.userId])||{user_id:req.userId,styles:'',colors:'',avoid_colors:'',item_types:'',notes:''})))
app.put('/api/preferences',auth,safe(async(req,res)=>res.json(await one('INSERT INTO preferences VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(user_id) DO UPDATE SET styles=$2,colors=$3,avoid_colors=$4,item_types=$5,notes=$6 RETURNING *',[req.userId,clean(req.body.styles),clean(req.body.colors),clean(req.body.avoid_colors),clean(req.body.item_types),clean(req.body.notes)]))))

const simple={inspirations:'created_at',feedback:'created_at'}
for(const [table,order] of Object.entries(simple))app.get(`/api/${table}`,auth,safe(async(req,res)=>res.json(await rows(`SELECT * FROM ${table} WHERE user_id=$1 ORDER BY ${order} DESC`,[req.userId]))))
app.get('/api/capsules',auth,safe(async(req,res)=>{const cs=await rows('SELECT * FROM capsules WHERE user_id=$1 ORDER BY created_at DESC',[req.userId]);res.json(await Promise.all(cs.map(async c=>({...c,itemIds:(await rows('SELECT item_id FROM capsule_items WHERE capsule_id=$1',[c.id])).map(x=>x.item_id)}))))}))
app.post('/api/capsules',auth,safe(async(req,res)=>{const ids=[...new Set(req.body.itemIds||[])],id=randomUUID();if(!clean(req.body.name)||ids.length&&!await validIds(ids,req.userId))return fail(res,400,'Cápsula inválida.');await tx(async c=>{await c.query('INSERT INTO capsules VALUES($1,$2,$3,$4)',[id,req.userId,clean(req.body.name),now()]);for(const x of ids)await c.query('INSERT INTO capsule_items VALUES($1,$2)',[id,x])});res.status(201).json({id,name:req.body.name,itemIds:ids})}))
app.delete('/api/capsules/:id',auth,safe(async(req,res)=>{await pool.query('DELETE FROM capsules WHERE id=$1 AND user_id=$2',[req.params.id,req.userId]);res.json({ok:true})}))
app.post('/api/inspirations',auth,safe(async(req,res)=>{const id=randomUUID();res.status(201).json(await one('INSERT INTO inspirations VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',[id,req.userId,clean(req.body.image),clean(req.body.title),clean(req.body.category)||null,clean(req.body.color)||null,clean(req.body.style)||null,clean(req.body.notes)||null,now()]))}))
app.delete('/api/inspirations/:id',auth,safe(async(req,res)=>{await pool.query('DELETE FROM inspirations WHERE id=$1 AND user_id=$2',[req.params.id,req.userId]);res.json({ok:true})}))
app.get('/api/posts',auth,safe(async(req,res)=>res.json(await rows('SELECT p.*,u.name author,l.name look_name FROM posts p JOIN users u ON u.id=p.user_id JOIN looks l ON l.id=p.look_id ORDER BY p.created_at DESC'))))
app.post('/api/posts',auth,safe(async(req,res)=>{const id=randomUUID();await pool.query('INSERT INTO posts VALUES($1,$2,$3,$4)',[id,req.userId,req.body.lookId,now()]);res.status(201).json({id})}))
app.delete('/api/posts/:id',auth,safe(async(req,res)=>{await pool.query('DELETE FROM posts WHERE id=$1 AND user_id=$2',[req.params.id,req.userId]);res.json({ok:true})}))
app.post('/api/posts/:id/save',auth,safe(async(req,res)=>{await pool.query('INSERT INTO saved_posts VALUES($1,$2) ON CONFLICT DO NOTHING',[req.userId,req.params.id]);res.json({ok:true})}))
app.delete('/api/posts/:id/save',auth,safe(async(req,res)=>{await pool.query('DELETE FROM saved_posts WHERE user_id=$1 AND post_id=$2',[req.userId,req.params.id]);res.json({ok:true})}))
app.get('/api/trips',auth,safe(async(req,res)=>{const ts=await rows('SELECT * FROM trips WHERE user_id=$1 ORDER BY starts_at DESC',[req.userId]);res.json(await Promise.all(ts.map(async t=>({...t,plans:await rows('SELECT * FROM trip_looks WHERE trip_id=$1',[t.id]),packed:(await rows('SELECT item_id FROM trip_packed WHERE trip_id=$1',[t.id])).map(x=>x.item_id)}))))}))
app.post('/api/trips',auth,safe(async(req,res)=>{const id=randomUUID();res.status(201).json(await one('INSERT INTO trips VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',[id,req.userId,clean(req.body.name),clean(req.body.destination),req.body.startsAt,req.body.endsAt,clean(req.body.activities)||null,now()]))}))
app.post('/api/trips/:id/looks',auth,safe(async(req,res)=>{await pool.query('INSERT INTO trip_looks VALUES($1,$2,$3,$4) ON CONFLICT DO UPDATE SET activity=EXCLUDED.activity',[req.params.id,req.body.lookId,req.body.day,clean(req.body.activity)||null]);res.json({ok:true})}))
app.delete('/api/trips/:id/looks',auth,safe(async(req,res)=>{await pool.query('DELETE FROM trip_looks WHERE trip_id=$1 AND look_id=$2 AND day=$3',[req.params.id,req.body.lookId,req.body.day]);res.json({ok:true})}))
app.post('/api/trips/:id/pack/:itemId',auth,safe(async(req,res)=>{await pool.query('INSERT INTO trip_packed VALUES($1,$2) ON CONFLICT DO NOTHING',[req.params.id,req.params.itemId]);res.json({ok:true})}))
app.delete('/api/trips/:id/pack/:itemId',auth,safe(async(req,res)=>{await pool.query('DELETE FROM trip_packed WHERE trip_id=$1 AND item_id=$2',[req.params.id,req.params.itemId]);res.json({ok:true})}))
app.delete('/api/trips/:id',auth,safe(async(req,res)=>{await pool.query('DELETE FROM trips WHERE id=$1 AND user_id=$2',[req.params.id,req.userId]);res.json({ok:true})}))
app.post('/api/feedback',auth,safe(async(req,res)=>{const id=randomUUID();await pool.query('INSERT INTO feedback VALUES($1,$2,$3,$4,$5,$6)',[id,req.userId,JSON.stringify(req.body.itemIds||[]),clean(req.body.occasion)||null,req.body.liked?1:0,now()]);res.status(201).json({id})}))

app.get('/api/health',safe(async(_r,res)=>{await pool.query('SELECT 1');res.json({ok:true,database:'postgresql'})}))
const dist=path.join(root,'dist');if(existsSync(dist)){app.use(express.static(dist));app.get(/^(?!\/api|\/uploads).*/,(_r,res)=>res.sendFile(path.join(dist,'index.html')))}
app.use((e,_r,res,_n)=>{console.error(e);if(e.code==='23505'||e.code==='23503')return fail(res,409,'Registro em uso ou já existente.');fail(res,500,'Não foi possível concluir a operação.')})
const port=Number(process.env.PORT)||3001,server=app.listen(port,'127.0.0.1',()=>console.log(`API GRWM em http://127.0.0.1:${port} · PostgreSQL`))
process.on('SIGINT',()=>server.close(()=>pool.end()));process.on('SIGTERM',()=>server.close(()=>pool.end()))

