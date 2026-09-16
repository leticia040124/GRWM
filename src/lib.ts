export type User = { id:string; name:string; email:string }
export type Item = { id:string; name:string; category:string; subcategory:string|null; color:string|null; style:string|null; season:string|null; formality:string|null; brand:string|null; size:string|null; price:number|null; bought_at:string|null; notes:string|null; image:string; favorite:number; destination:string|null; condition:string|null; created_at:string }
export type Look = { id:string; name:string; occasion:string|null; style:string|null; origin:string; favorite:number; itemIds:string[]; created_at:string }
export type Use = { id:string; look_id:string; used_at:string; liked:number|null; again:number|null; notes:string|null }
export type Plan = { id:string; look_id:string; planned_at:string; confirmed:number }
export type Preferences = { styles:string; colors:string; avoid_colors:string; item_types:string; notes:string }
export type Capsule = { id:string; name:string; itemIds:string[] }
export type Inspiration = { id:string; image:string; title:string; category:string|null; color:string|null; style:string|null; notes:string|null }
export type Post = { id:string; user_id:string; look_id:string; look_name:string; author:string; itemIds:string[]; pieces:Item[]; saved:boolean }
export type Trip = { id:string; name:string; destination:string; starts_at:string; ends_at:string; activities:string|null; plans:{look_id:string;day:string;activity:string|null}[]; packed:string[] }
export type Feedback = { id:string; item_ids:string; occasion:string|null; liked:number }

export const token = () => localStorage.getItem('grwm-token')
export async function api<T>(url:string, options:RequestInit = {}):Promise<T> {
  const response = await fetch(`/api${url}`, { ...options, headers: { ...(options.body instanceof FormData ? {} : {'Content-Type':'application/json'}), ...(token() ? {Authorization:`Bearer ${token()}`} : {}), ...options.headers } })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Não foi possível concluir a operação.')
  return data as T
}
export const send = <T,>(url:string, method:string, body?:unknown) => api<T>(url,{method,body:body===undefined?undefined:JSON.stringify(body)})
export async function uploadImage(file:File):Promise<string> { const form=new FormData(); form.append('image',file); const result=await api<{image:string}>('/upload',{method:'POST',body:form}); return result.image }
export const text = (value:string|null|undefined) => (value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
export const today = () => new Date().toISOString().slice(0,10)
export type VisionResult={category:string;color:string;style:string;season:string;formality:string;notes:string}
export const analyzeImage=(image:string)=>send<VisionResult>('/vision','POST',{image})
export function internalCategory(value:string){const c=text(value);const aliases:[RegExp,string][]=[[/camiseta|blusa|top|regata/,'Blusas'],[/camisa/,'Camisas'],[/calca|jeans/,'Calças'],[/short|bermuda/,'Shorts'],[/saia/,'Saias'],[/vestido/,'Vestidos'],[/casaco|jaqueta|blazer/,'Casacos'],[/tenis|sapato|sandalia|bota|calcado/,'Calçados'],[/bolsa|mochila/,'Bolsas'],[/acessorio|brinco|colar|pulseira|oculos/,'Acessórios'],[/maquiagem|batom|blush|base|sombra/,'Maquiagem']];return aliases.find(([regex])=>regex.test(c))?.[1]||''}

export function usesForItem(itemId:string, looks:Look[], uses:Use[]) {
  return uses.filter(u=>looks.find(l=>l.id===u.look_id)?.itemIds.includes(itemId)).sort((a,b)=>b.used_at.localeCompare(a.used_at))
}
export function recommend(items:Item[], opts:{occasion?:string;style?:string;must?:string;avoid?:string;capsule?:string[];preferences?:Preferences;feedback?:Feedback[];salt?:number}):Item[][] {
  const pool=items.filter(i=>!i.destination || i.destination==='manter').filter(i=>!opts.capsule || opts.capsule.includes(i.id)).filter(i=>!opts.avoid || !text(i.name+' '+i.category+' '+i.subcategory).includes(text(opts.avoid)))
  const must=pool.find(i=>i.id===opts.must)
  if (opts.must && !must) return []
  const category=(i:Item) => text(i.category+' '+i.subcategory)
  const type=(i:Item) => /vestido/.test(category(i))?'dress':/calca|saia|short|bermuda/.test(category(i))?'bottom':/tenis|sapato|sandalia|bota|calcado|salto/.test(category(i))?'shoe':/bolsa/.test(category(i))?'bag':/acessorio|brinco|colar|pulseira|maquiagem|batom|blush/.test(category(i))?'extra':'top'
  const groups=['top','bottom','dress','shoe','bag','extra'] as const
  const desired=text(opts.style||opts.preferences?.styles), occasion=text(opts.occasion), colors=text(opts.preferences?.colors), rejected=text(opts.preferences?.avoid_colors)
  const score=(i:Item,n:number) => {
    let result=0
    if (desired && text(i.style).includes(desired)) result+=4
    if (colors && text(i.color) && colors.includes(text(i.color))) result+=2
    if (rejected && text(i.color) && rejected.includes(text(i.color))) result-=5
    if (occasion && /trabalho|formal|jantar|festa/.test(occasion) && /formal|elegante/.test(text(i.formality+' '+i.style))) result+=2
    if (occasion && /praia|passeio|academia/.test(occasion) && /casual|confortavel|verao/.test(text(i.style+' '+i.season))) result+=2
    if (i.favorite) result+=1
    for (const f of opts.feedback||[]) if ((JSON.parse(f.item_ids) as string[]).includes(i.id)) result+=f.liked?1:-2
    return result + ((n+opts.salt!||0)%7)*0.08
  }
  const picked:Item[][]=[]
  for (let option=0; option<3; option++) {
    const selection:Item[]=must?[must]:[]
    const hasDress=must && type(must)==='dress'
    for (const group of groups) {
      if (hasDress && (group==='top'||group==='bottom')) continue
      if (must && group==='dress' && type(must)!=='dress') continue
      if (group==='extra' && pool.length<4) continue
      if (selection.some(i=>type(i)===group)) continue
      const candidates=pool.filter(i=>type(i)===group && !selection.includes(i)).sort((a,b)=>score(b,option)-score(a,option))
      if (candidates.length) selection.push(candidates[option%candidates.length])
    }
    if (!hasDress && !selection.some(i=>type(i)==='top') && selection.some(i=>type(i)==='bottom')) continue
    if (selection.length>=2 && !picked.some(p=>p.map(i=>i.id).sort().join()===selection.map(i=>i.id).sort().join())) picked.push(selection)
  }
  return picked
}
export function recreate(items:Item[], inspiration:{category?:string|null;color?:string|null;style?:string|null}) {
  return recommend(items,{style:inspiration.style||'',salt:1}).sort((a,b)=>matching(b)-matching(a))
  function matching(look:Item[]) { return look.reduce((n,i)=>n+(inspiration.color&&text(i.color)===text(inspiration.color)?2:0)+(inspiration.category&&text(i.category).includes(text(inspiration.category))?2:0),0) }
}
export function resaleRange(item:Item, uses:number):[number,number]|null {
  if(item.price==null || item.price<=0 || !item.condition)return null
  const years=item.bought_at?Math.max(0,(Date.now()-new Date(item.bought_at).getTime())/31557600000):0
  const condition=({ 'Como nova':0.8,'Muito bom':0.65,'Bom':0.5,'Regular':0.35 } as Record<string,number>)[item.condition]||0.45
  const value=item.price*condition*Math.max(0.5,1-years*0.08)*Math.max(0.55,1-uses*0.015)
  return [Math.round(value*0.9),Math.round(value*1.1)]
}

