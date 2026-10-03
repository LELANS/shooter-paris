const products = [
{id:'international',name:'Hoodie International',type:'hoodie',subtitle:'Noir / Imprimé dos',price:95,image:'p-hoodie-international.jpg',tag:'THE INTERNATIONAL',sizes:['XS','S','M','L','XL'],description:'Une silhouette ample, un noir affirmé. Le graphisme « The International SHOOTER » et ses villes s’inscrivent au dos pour une signature sans frontières.'},
{id:'spiral',name:'Hoodie Spiral',type:'hoodie',subtitle:'Noir / Signature blanche',price:95,image:'p-hoodie-spiral.jpg',tag:'SIGNATURE',sizes:['XS','S','M','L','XL'],description:'Le symbole circulaire SHOOTER s’impose en contraste sur le dos. Une pièce à capuche qui fait du graphisme le point de départ de la silhouette.'},
{id:'signature',name:'Casquette Signature',type:'cap',subtitle:'Noir / Broderie blanche',price:35,image:'cap-signature.jpeg',tag:'ACCESSOIRE',sizes:['Unique'],description:'Le symbole et le nom SHOOTER en broderie blanche sur fond noir. Un contraste net, une signature immédiatement reconnaissable.'},
{id:'script',name:'Trucker Script',type:'cap',subtitle:'Noir / Ton sur ton',price:35,image:'cap-script.jpeg',tag:'TON SUR TON',sizes:['Unique'],description:'Une signature manuscrite ton sur ton, une silhouette trucker et un dos en maille. Le détail discret qui complète le vestiaire.'}
];
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const money=value=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(value);
const imagePath=product=>`assets/img/${product.image}`;
const findProduct=id=>products.find(product=>product.id===id);
let cart=[];
try{const saved=JSON.parse(localStorage.getItem('shooter-cart-v1')||'[]');if(Array.isArray(saved))cart=saved.filter(item=>{const product=item&&findProduct(item.id);return product&&product.sizes.includes(item.size)&&Number.isInteger(item.quantity)&&item.quantity>0&&item.quantity<=20;}).map(({id,size,quantity})=>({id,size,quantity}));}catch{}
let toastTimer;
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3000);}
function saveCart(){try{localStorage.setItem('shooter-cart-v1',JSON.stringify(cart));}catch{toast('Panier conservé pour cette visite uniquement.');}$('#cart-count').textContent=cart.reduce((total,item)=>total+item.quantity,0);renderCart();}
function openDialog(dialog){if(!dialog.open)dialog.showModal();}
function renderProducts(filter='all'){
 const filtered=products.filter(product=>filter==='all'||product.type===filter);
 $('#product-count').textContent=`${String(filtered.length).padStart(2,'0')} PIÈCES`;
 $('#product-grid').innerHTML=filtered.map(product=>`<article class="product-card"><button class="product-image" data-product="${product.id}" aria-label="Découvrir ${product.name}"><span class="product-tag">${product.tag}</span><img class="${product.type==='cap'?'cap':''}" src="${imagePath(product)}" alt="${product.name}, ${product.subtitle}" loading="lazy" width="600" height="800"><span class="product-plus" aria-hidden="true">+</span></button><div class="product-info"><div><h3><button class="product-name" data-product="${product.id}">${product.name}</button></h3><p class="product-subtitle">${product.subtitle}</p></div><span class="product-price" aria-label="Prix indicatif : ${money(product.price)}">${money(product.price)}</span></div><span class="swatch" role="img" aria-label="Coloris noir"></span></article>`).join('');
}
function openProduct(id){
 const product=findProduct(id);if(!product)return;
 let selectedSize=product.sizes.length===1?product.sizes[0]:null;
 $('#product-detail').innerHTML=`<div class="product-detail-grid"><div class="detail-photo"><img src="${imagePath(product)}" alt="${product.name}, ${product.subtitle}"></div><div class="detail-content"><p class="eyebrow">COLLECTION 01 / ${product.tag}</p><h2 id="product-title">${product.name}</h2><p class="detail-price">${money(product.price)}<small>Prix indicatif</small></p><p class="detail-description">${product.description}</p><p class="detail-color">Coloris — Noir</p><div class="size-label"><span>Choisir une taille</span><button id="size-help">À propos des tailles</button></div><div class="sizes" role="group" aria-label="Taille">${product.sizes.map(size=>`<button data-size="${size}" aria-pressed="${size===selectedSize}">${size}</button>`).join('')}</div><p class="size-error" id="size-error" role="status"></p><button class="button dark detail-add" id="add-to-cart">AJOUTER AU PANIER <span>+</span></button><details><summary>Détails de la pièce</summary><p>${product.description} Composition, mesures et disponibilités seront précisées avant l’ouverture des ventes.</p></details><details><summary>Livraison & retours</summary><p>Cette boutique est en préparation. Les zones desservies, frais, délais de livraison et modalités de retour seront affichés avant toute commande.</p></details></div></div>`;
 $$('.sizes button').forEach(button=>button.addEventListener('click',()=>{selectedSize=button.dataset.size;$$('.sizes button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));$('#size-error').textContent='';}));
 $('#size-help').addEventListener('click',()=>showInfo('sizes'));
 $('#add-to-cart').addEventListener('click',()=>{
  if(!selectedSize){$('#size-error').textContent='Choisissez une taille pour ajouter cette pièce.';$('.sizes button').focus();return;}
  const existing=cart.find(item=>item.id===product.id&&item.size===selectedSize);
  if(existing?.quantity>=20){$('#size-error').textContent='Maximum de 20 pièces par taille dans cet aperçu.';return;}
  if(existing)existing.quantity+=1;else cart.push({id:product.id,size:selectedSize,quantity:1});
  saveCart();$('#product-dialog').close();openDialog($('#cart-dialog'));
 });
 openDialog($('#product-dialog'));
}
function renderCart(){
 $('#cart-items').innerHTML=cart.length?cart.map((item,index)=>{const product=findProduct(item.id);return `<article class="cart-item"><img src="${imagePath(product)}" alt="${product.name}"><div><h3>${product.name}</h3><p>Noir / ${item.size==='Unique'?'Taille unique':'Taille '+item.size}</p><p>${money(product.price*item.quantity)}</p><div class="cart-item-controls"><div class="quantity"><button data-cart-action="minus" data-index="${index}" aria-label="Réduire la quantité de ${product.name}">−</button><span>${item.quantity}</span><button data-cart-action="plus" data-index="${index}" aria-label="Augmenter la quantité de ${product.name}" ${item.quantity>=20?'disabled':''}>+</button></div><button class="remove-item" data-cart-action="remove" data-index="${index}">Retirer</button></div></div></article>`;}).join(''):'<div class="cart-empty"><span aria-hidden="true">↗</span><p>Votre prochaine signature vous attend.<br>Explorez les pièces de la collection.</p><button class="button dark" id="continue-shopping">DÉCOUVRIR LA COLLECTION <span>↗</span></button></div>';
 $('#cart-summary').innerHTML=cart.length?`<div class="cart-total"><span>Sous-total indicatif</span><span>${money(cart.reduce((total,item)=>total+findProduct(item.id).price*item.quantity,0))}</span></div><p class="cart-note">Les prix sont présentés à titre indicatif. Les ventes ne sont pas encore ouvertes ; aucun paiement ne sera prélevé.</p><button class="button dark cart-checkout" id="checkout-preview">OUVERTURE PROCHAINE <span>↗</span></button>`:'';
 $('#continue-shopping')?.addEventListener('click',()=>{$('#cart-dialog').close();$('#collection').scrollIntoView({behavior:'smooth'});});
 $('#checkout-preview')?.addEventListener('click',()=>showInfo('checkout'));
}
const info={
 delivery:['Livraison & retours','<p>La boutique est en préparation. Les frais, délais, pays desservis et modalités de retour ne sont pas encore définis.</p><p>Ces informations seront disponibles avant l’ouverture des commandes.</p>'],
 care:['Prendre soin de vos pièces','<p>Suivez les instructions figurant sur l’étiquette de chaque vêtement. Elles priment sur toute recommandation générale.</p><p>Les consignes spécifiques aux broderies et imprimés seront ajoutées aux fiches produits une fois validées par la marque.</p>'],
 contact:['Restons en contact.','<p>Le contact officiel SHOOTER Paris sera ajouté à l’ouverture de la boutique.</p><p>Pour le moment, découvrez la collection et composez votre sélection.</p>'],
 legal:['À propos de cet aperçu','<p>Cette version présente une proposition de boutique SHOOTER Paris. Les prix, tailles et textes de présentation sont provisoires. Aucun achat ni paiement n’est effectué.</p><p>Votre panier est mémorisé uniquement dans le navigateur de cet appareil. Aucun outil de suivi publicitaire n’est intégré, et aucune donnée de paiement n’est collectée.</p><p>La photographie d’ouverture est une illustration de campagne générée par IA. Les photos des produits et du lookbook proviennent des références fournies. Les informations légales du vendeur et les conditions de vente seront complétées avant lancement.</p>'],
 sizes:['Bien choisir sa taille','<p>Les tailles affichées servent à présenter le parcours d’achat. Les mesures réelles et les disponibilités doivent encore être confirmées.</p><p>Le guide des tailles définitif sera publié avant l’ouverture des commandes.</p>'],
 checkout:['Bientôt à vous.','<p>Votre sélection est prête. La boutique est encore en préparation et les paiements ne sont pas activés.</p><p>Les tarifs définitifs, les stocks et les conditions de livraison seront confirmés avant l’ouverture des ventes. Vous pouvez continuer à explorer la collection.</p>']
};
function showInfo(key){if(!info[key])return;$('#info-title').textContent=info[key][0];$('#info-content').innerHTML=info[key][1];openDialog($('#info-dialog'));}
let lookbookIndex=0;
const looks=['La silhouette noire, au contact de la pierre.','Une pause dans le mouvement. Le vestiaire SHOOTER.','Des lignes amples dans une architecture monumentale.','La casquette Script : la signature en détail.','Le symbole circulaire, porté comme une empreinte.','SHOOTER. Un graphisme qui affirme la silhouette.'];
function renderLookbook(){$('#lookbook-image').src=`assets/img/lb-${lookbookIndex+1}.jpg`;$('#lookbook-image').alt=looks[lookbookIndex];$('#lookbook-description').textContent=looks[lookbookIndex];$('#lookbook-count').textContent=`0${lookbookIndex+1} / 06`;}
$('#lookbook-open').addEventListener('click',()=>{renderLookbook();openDialog($('#lookbook-dialog'));});
$('#lookbook-prev').addEventListener('click',()=>{lookbookIndex=(lookbookIndex+5)%6;renderLookbook();});
$('#lookbook-next').addEventListener('click',()=>{lookbookIndex=(lookbookIndex+1)%6;renderLookbook();});
$('#lookbook-dialog').addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();lookbookIndex=(lookbookIndex+(event.key==='ArrowRight'?1:5))%6;renderLookbook();}});
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{$$('[data-filter]').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});renderProducts(button.dataset.filter);}));
document.addEventListener('click',event=>{const productButton=event.target.closest('[data-product]');if(productButton)openProduct(productButton.dataset.product);const infoButton=event.target.closest('[data-info]');if(infoButton)showInfo(infoButton.dataset.info);const closeButton=event.target.closest('[data-close]');if(closeButton)closeButton.closest('dialog').close();});
$('#cart-items').addEventListener('click',event=>{
 const button=event.target.closest('[data-cart-action]');if(!button)return;
 const index=Number(button.dataset.index),item=cart[index];if(!item)return;
 const action=button.dataset.cartAction;
 if(action==='remove'||(action==='minus'&&item.quantity===1))cart.splice(index,1);else item.quantity=Math.min(20,item.quantity+(action==='plus'?1:-1));
 saveCart();
 const next=$(`[data-cart-action="${action}"][data-index="${Math.min(index,cart.length-1)}"]`,$('#cart-items'));
 (next||$('#continue-shopping')||$('[data-close]',$('#cart-dialog'))).focus();
});
$$('[data-open-cart]').forEach(button=>button.addEventListener('click',()=>{renderCart();openDialog($('#cart-dialog'));}));
$$('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}));
const menuButton=$('.menu-trigger');
function closeMenu(){$('#mobile-nav').hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Ouvrir le menu');}
menuButton.addEventListener('click',()=>{const expanded=menuButton.getAttribute('aria-expanded')==='true';$('#mobile-nav').hidden=expanded;menuButton.setAttribute('aria-expanded',String(!expanded));menuButton.setAttribute('aria-label',expanded?'Ouvrir le menu':'Fermer le menu');});
$$('#mobile-nav a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
window.matchMedia('(min-width:651px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
$('#year').textContent=new Date().getFullYear();renderProducts();saveCart();
