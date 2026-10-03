/**
 * Contrato independente do fornecedor. O navegador nunca recebe segredo TouchPay.
 * Para integrar: use mode:'api' e endpoint HTTPS do SEU backend, que deve responder
 * { updatedAt: 'ISO-8601', products: [{id,code,name,category,unit,price,oldPrice,
 * stock,description,image}] }. Veja INTEGRACAO.md. Não é um endpoint TouchPay real.
 */
window.CATALOG_CONFIG = { mode:'demo', endpoint:'', lowStockThreshold:5 };
window.CatalogSource = {
  async getProducts() {
    if (window.CATALOG_CONFIG.mode === 'demo') return {products:window.DEMO_PRODUCTS,updatedAt:null,isDemo:true};
    const endpoint = new URL(window.CATALOG_CONFIG.endpoint, location.href);
    if (!window.CATALOG_CONFIG.endpoint || endpoint.protocol !== 'https:') throw new Error('Configure um endpoint HTTPS.');
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(),12000);
    try {
      const response = await fetch(endpoint.href,{signal:controller.signal,cache:'no-store',credentials:'omit'});
      if (!response.ok) throw new Error('Falha ao consultar catálogo.');
      const data = await response.json();
      if (!Array.isArray(data.products) || !data.updatedAt || !Number.isFinite(Date.parse(data.updatedAt))) throw new Error('Formato de resposta inválido.');
      const ids = new Set();
      const products = data.products.map(p=>{
        if (!p || !['string','number'].includes(typeof p.id) || !String(p.id).trim() || ids.has(String(p.id)) || typeof p.name!=='string' || !p.name.trim() || typeof p.category!=='string' || !p.category.trim() || !Number.isFinite(p.price) || p.price<0 || !Number.isFinite(p.stock) || p.stock<0) throw new Error('Produto inválido.');
        ids.add(String(p.id));
        let image = 'assets/icon.svg';
        if (typeof p.image==='string') { const url=new URL(p.image,location.href); if (url.protocol==='https:' || url.origin===location.origin && ['http:','file:'].includes(url.protocol)) image=url.href; }
        return {id:String(p.id),name:p.name,category:p.category,price:p.price,stock:p.stock,code:String(p.code??p.id),unit:String(p.unit??''),description:String(p.description??''),oldPrice:Number.isFinite(p.oldPrice)&&p.oldPrice>p.price?p.oldPrice:null,image};
      });
      return {products,updatedAt:data.updatedAt,isDemo:false};
    } finally { clearTimeout(timeout); }
  }
};
