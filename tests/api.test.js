import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cwd = mkdtempSync(path.join(tmpdir(), 'grwm-test-'))
const port = 31000 + Math.floor(Math.random() * 1000)
const server = spawn(process.execPath, [path.join(root, 'server/index.js')], { cwd, env: { ...process.env, OPENAI_API_KEY: '', PORT: String(port) }, stdio: 'ignore' })
const base = `http://127.0.0.1:${port}/api`
async function request(url, method='GET', body, token) {
  const response = await fetch(base+url,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined})
  return {status:response.status,data:await response.json()}
}
async function ready() {for(let n=0;n<40;n++){try{if((await request('/health')).status===200)return}catch{}await new Promise(r=>setTimeout(r,100))}throw new Error('A API não iniciou.')}

test('contas isoladas, peças, look, uso e viagem', async () => {
  try {
    await ready()
    const one=await request('/register','POST',{name:'Pessoa Um',email:'um@example.com',password:'senhaSegura123'})
    const two=await request('/register','POST',{name:'Pessoa Dois',email:'dois@example.com',password:'senhaSegura123'})
    assert.equal(one.status,201);assert.equal(two.status,201)
    const a=one.data.token,b=two.data.token
    const form=new FormData()
    form.append('image',new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==','base64')],{type:'image/png'}),'piece.png')
    const upload=await fetch(base+'/upload',{method:'POST',headers:{Authorization:`Bearer ${a}`},body:form})
    assert.equal(upload.status,200)
    const image=(await upload.json()).image
    assert.equal((await fetch(`http://127.0.0.1:${port}${image}`)).status,401)
    assert.equal((await fetch(`http://127.0.0.1:${port}${image}`,{headers:{Authorization:`Bearer ${a}`}})).status,200)
    assert.equal((await fetch(`http://127.0.0.1:${port}${image}`,{headers:{Authorization:`Bearer ${b}`}})).status,403)
    const piece=await request('/items','POST',{name:'Blusa',category:'Blusas',image},a)
    assert.equal(piece.status,201)
    assert.equal((await request('/features')).data.tryOn,false)
    assert.equal((await request('/try-on','POST',{personImage:image,itemId:piece.data.id,mode:'clothes'},a)).status,503)
    assert.equal((await request('/items','GET',undefined,b)).data.length,0)
    assert.equal((await request(`/items/${piece.data.id}`,'PUT',{name:'Outro nome'},b)).status,404)
    const second=await request('/items','POST',{name:'Calça',category:'Calças',image},a)
    const look=await request('/looks','POST',{name:'Look teste',itemIds:[piece.data.id,second.data.id]},a)
    assert.equal(look.status,201)
    assert.equal((await request('/looks','GET',undefined,b)).data.length,0)
    assert.equal((await request('/uses','POST',{lookId:look.data.id,usedAt:'2026-09-15'},a)).status,201)
    const plan=await request('/plans','POST',{lookId:look.data.id,plannedAt:'2026-09-16'},a)
    assert.equal(plan.status,201)
    assert.equal((await request(`/plans/${plan.data.id}/confirm`,'POST',undefined,a)).status,200)
    assert.equal((await request('/plans','GET',undefined,a)).data[0].confirmed,1)
    const trip=await request('/trips','POST',{name:'Viagem',destination:'Fortaleza',startsAt:'2026-09-15',endsAt:'2026-09-17'},a)
    assert.equal(trip.status,201)
    assert.equal((await request(`/trips/${trip.data.id}/looks`,'POST',{lookId:look.data.id,day:'2026-09-15'},a)).status,200)
    assert.equal((await request('/trips','GET',undefined,a)).data[0].plans.length,1)
    assert.equal((await request(`/items/${piece.data.id}`,'DELETE',undefined,a)).status,409)
  } finally {
    server.kill()
    await new Promise(resolve => server.once('exit',resolve))
    if (path.resolve(cwd).startsWith(path.resolve(tmpdir())+path.sep) && path.basename(cwd).startsWith('grwm-test-')) rmSync(cwd,{recursive:true,force:true})
  }
})

