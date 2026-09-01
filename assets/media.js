(() => {
  const DB_NAME='vrode-rovno-media';
  const DB_VERSION=1;
  const STORE='productImages';
  let dbPromise;

  const open=()=>{
    if(dbPromise) return dbPromise;
    dbPromise=new Promise((resolve,reject)=>{
      if(!('indexedDB' in window)){ reject(new Error('IndexedDB недоступен')); return; }
      const req=indexedDB.open(DB_NAME,DB_VERSION);
      req.onupgradeneeded=()=>{
        const db=req.result;
        if(!db.objectStoreNames.contains(STORE)){
          const st=db.createObjectStore(STORE,{keyPath:'key'});
          st.createIndex('productId','productId',{unique:false});
        }
      };
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error || new Error('Не удалось открыть хранилище фото'));
    });
    return dbPromise;
  };

  const txDone=tx=>new Promise((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Транзакция отменена'))});
  const reqDone=req=>new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});
  const makeKey=(productId)=>`${productId}:${(crypto.randomUUID?.() || (Date.now()+'-'+Math.random().toString(16).slice(2)))}`;

  async function get(productId){
    const db=await open();
    const tx=db.transaction(STORE,'readonly');
    const rows=await reqDone(tx.objectStore(STORE).index('productId').getAll(productId));
    return (rows||[]).sort((a,b)=>(a.order??9999)-(b.order??9999)||(a.createdAt??0)-(b.createdAt??0));
  }

  async function add(productId, files){
    if(!productId || !files?.length) return [];
    const current=await get(productId);
    let order=current.length ? Math.max(...current.map(x=>Number(x.order)||0))+1 : 0;
    const db=await open();
    const tx=db.transaction(STORE,'readwrite');
    const st=tx.objectStore(STORE);
    const added=[];
    for(const f of files){
      const rec={key:makeKey(productId),productId,blob:f,name:f.name||'image',type:f.type||'image/jpeg',size:f.size||0,order:order++,createdAt:Date.now()};
      st.put(rec); added.push(rec);
    }
    await txDone(tx);
    return added;
  }

  async function remove(key){
    const db=await open(); const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).delete(key); await txDone(tx);
  }

  async function removeProduct(productId){
    const rows=await get(productId); if(!rows.length) return;
    const db=await open(); const tx=db.transaction(STORE,'readwrite'); const st=tx.objectStore(STORE); rows.forEach(r=>st.delete(r.key)); await txDone(tx);
  }

  async function makeCover(productId,key){
    const rows=await get(productId); const selected=rows.find(r=>r.key===key); if(!selected) return;
    const ordered=[selected,...rows.filter(r=>r.key!==key)];
    const db=await open(); const tx=db.transaction(STORE,'readwrite'); const st=tx.objectStore(STORE);
    ordered.forEach((r,i)=>st.put({...r,order:i})); await txDone(tx);
  }

  async function count(productId){ return (await get(productId)).length; }
  const objectURL=rec=>rec?.blob ? URL.createObjectURL(rec.blob) : '';

  window.VRMedia={get,add,remove,removeProduct,makeCover,count,objectURL};
})();
