'use strict';

const editor = document.querySelector('#editor');
const statusBox = document.querySelector('#status');
const galleryEditor = document.querySelector('#gallery-editor');
let page;
let originalAddressAnswer;
let originalAddress;
const selectedPhotos = new Map();
const maxPhotoSize = 8 * 1024 * 1024;

function message(text) { statusBox.textContent = text; }
function field(container, labelText, value, onInput, multiline = false) {
  const label = document.createElement('label');
  label.textContent = labelText;
  const input = document.createElement(multiline ? 'textarea' : 'input');
  if (multiline) input.rows = 3;
  input.value = value;
  input.addEventListener('input', () => onInput(input.value));
  label.append(input);
  container.append(label);
  return input;
}
function addGroup(name, entries) {
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.textContent = name;
  const fields = document.createElement('div');
  fields.className = 'fields';
  entries.forEach(({selector, label, multiline = false, summaryText = false}) => {
    page.querySelectorAll(selector).forEach((node, index, all) => {
      const original = summaryText ? node.firstChild.textContent.trim() : node.textContent.trim();
      const title = all.length > 1 ? `${label} ${index + 1}` : label;
      field(fields, title, original, (value) => {
        if (summaryText) node.firstChild.textContent = value;
        else node.textContent = value;
        if (selector === '#presidente-nome') {
          page.querySelector('.president-mark').textContent = value.trim().split(/\s+/).slice(0, 2).map(word => word[0] || '').join('').toUpperCase();
        }
      }, multiline);
    });
  });
  details.append(summary, fields);
  document.querySelector('#text-sections').append(details);
}
function makeTextFields() {
  addGroup('Início e apresentação', [
    {selector: '#inicio h1', label: 'Título de boas-vindas'},
    {selector: '#inicio .hero-copy > p', label: 'Mensagem inicial', multiline: true},
    {selector: '#sobre .intro-copy p', label: 'Sobre a ONG', multiline: true},
    {selector: '#presidente-nome', label: 'Nome do presidente'},
    {selector: '#sobre .president-card p:last-child', label: 'Informações sobre o presidente', multiline: true}
  ]);
  addGroup('Atividades', [
    {selector: '#atividades .activity-card h3', label: 'Título da atividade'},
    {selector: '#atividades .activity-card p', label: 'Descrição da atividade', multiline: true},
    {selector: '#atividades .activity-foot > span', label: 'Informação adicional'}
  ]);
  addGroup('Como participar e ajudar', [
    {selector: '#ajudar .help-lead', label: 'Apresentação', multiline: true},
    {selector: '#ajudar .help-list h3', label: 'Título'},
    {selector: '#ajudar .help-list p', label: 'Orientação', multiline: true}
  ]);
  addGroup('Agenda e avisos', [
    {selector: '#agenda .event-content h3', label: 'Nome do evento'},
    {selector: '#agenda .event-content p', label: 'Descrição do evento', multiline: true},
    {selector: '#agenda .event-details span:nth-child(1) strong', label: 'Data'},
    {selector: '#agenda .event-details span:nth-child(2) strong', label: 'Horário'},
    {selector: '#agenda .event-details span:nth-child(3) strong', label: 'Local'}
  ]);
  addGroup('Perguntas frequentes', [
    {selector: '#duvidas details summary', label: 'Pergunta', summaryText: true},
    {selector: '#duvidas details p', label: 'Resposta', multiline: true}
  ]);
}
function addGalleryEditor(card, index) {
  const entry = document.createElement('fieldset');
  entry.className = 'gallery-entry';
  const legend = document.createElement('legend');
  legend.textContent = `Atividade ${index + 1}`;
  entry.append(legend);
  const title = card.querySelector('h3');
  const description = card.querySelector('.gallery-copy p');
  field(entry, 'Título', title.textContent, value => { title.textContent = value; });
  field(entry, 'Descrição da atividade', description.textContent, value => { description.textContent = value; }, true);
  const preview = document.createElement('img');
  preview.className = 'gallery-preview';
  preview.alt = '';
  let existing = card.querySelector('img');
  if (existing) preview.src = existing.getAttribute('src');
  else preview.hidden = true;
  entry.append(preview);
  const photoLabel = document.createElement('label');
  photoLabel.textContent = 'Escolher foto';
  const hint = document.createElement('small');
  hint.textContent = 'JPEG, PNG ou WebP, até 8 MB por foto.';
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpeg,image/png,image/webp';
  photoLabel.append(hint, input);
  entry.append(photoLabel);
  const removePhoto = document.createElement('button');
  removePhoto.type = 'button';
  removePhoto.className = 'remove-card';
  removePhoto.textContent = 'Remover foto';
  removePhoto.addEventListener('click', () => {
    selectedPhotos.delete(card); input.value = ''; preview.hidden = true;
    if (existing) {
      const placeholder = page.createElement('div');
      placeholder.className = 'gallery-placeholder';
      placeholder.innerHTML = '<svg aria-hidden="true"><use href="#i-camera"></use></svg><span>Fotos em breve</span>';
      existing.replaceWith(placeholder); existing = null;
    }
    alt.value = '';
  });
  entry.append(removePhoto);
  const alt = field(entry, 'Descrição da foto para acessibilidade', existing?.alt || '', value => {
    if (existing) existing.alt = value;
  });
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) { selectedPhotos.delete(card); preview.hidden = !existing; if (existing) preview.src = existing.getAttribute('src'); return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > maxPhotoSize) {
      input.value = ''; selectedPhotos.delete(card); preview.hidden = !existing;
      if (existing) preview.src = existing.getAttribute('src');
      message('Escolha uma imagem JPEG, PNG ou WebP de até 8 MB.');
      return;
    }
    selectedPhotos.set(card, file);
    const reader = new FileReader();
    reader.addEventListener('load', () => { preview.src = reader.result; preview.hidden = false; });
    reader.readAsDataURL(file);
    message('');
  });
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'remove-card';
  remove.textContent = 'Remover atividade';
  remove.addEventListener('click', () => { selectedPhotos.delete(card); card.remove(); entry.remove(); });
  entry.append(remove);
  entry.dataset.altField = 'true';
  card._altInput = alt;
  galleryEditor.append(entry);
}
function addGalleryCard() {
  const card = page.createElement('article');
  card.className = 'gallery-card';
  card.innerHTML = '<div class="gallery-placeholder"><svg aria-hidden="true"><use href="#i-camera"></use></svg><span>Fotos em breve</span></div><div class="gallery-copy"><span>ATIVIDADE</span><h3>Nova atividade</h3><p>Descrição da atividade.</p></div>';
  page.querySelector('.gallery-grid').append(card);
  addGalleryEditor(card, galleryEditor.children.length);
}
function makeContactFields() {
  const phone = page.querySelector('.contact-grid a[href^="https://wa.me/"]');
  document.querySelector('#phone').value = new URL(phone.href).pathname.slice(1);
  const instagram = page.querySelector('.contact-grid a[href*="instagram.com"]');
  document.querySelector('#instagram').value = new URL(instagram.href).pathname.split('/').filter(Boolean)[0] || '';
  document.querySelector('#email').value = page.querySelector('.contact-grid a[href^="mailto:"]').getAttribute('href').slice(7);
  const address = page.querySelector('.contact-grid a[href*="google.com/maps"] strong');
  document.querySelector('#address').value = [...address.childNodes].map(node => node.nodeName === 'BR' ? ' ' : node.textContent).join('').replace(/\s+/g, ' ').trim();
  originalAddress = document.querySelector('#address').value;
  originalAddressAnswer = page.querySelector('#duvidas details:nth-child(5) p').textContent;

}
function applyContacts(doc) {
  const phone = document.querySelector('#phone').value.replace(/\D/g, '');
  const instagram = document.querySelector('#instagram').value.trim().replace(/^@/, '');
  const email = document.querySelector('#email').value.trim();
  const address = document.querySelector('#address').value.trim();
  if (!/^\d{10,15}$/.test(phone)) throw new Error('Informe o WhatsApp com DDI e DDD, usando de 10 a 15 números.');
  if (!/^[A-Za-z0-9._]{1,30}$/.test(instagram)) throw new Error('Confira o usuário do Instagram.');
  if (!address) throw new Error('Informe o endereço da ONG.');
  doc.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => { link.href = `https://wa.me/${phone}`; });
  doc.querySelectorAll('a[href*="instagram.com/"]').forEach(link => { link.href = `https://instagram.com/${instagram}`; });
  doc.querySelectorAll('a[href^="mailto:"]').forEach(link => { link.href = `mailto:${email}`; });
  const phoneText = phone.startsWith('55') && phone.length === 13 ? `(${phone.slice(2,4)}) ${phone.slice(4,9)}-${phone.slice(9)}` : `+${phone}`;
  doc.querySelector('.contact-grid a[href^="https://wa.me/"] strong').textContent = phoneText;
  doc.querySelector('.contact-grid a[href*="instagram.com"] strong').textContent = `@${instagram}`;
  doc.querySelector('.contact-grid a[href^="mailto:"] strong').textContent = email;
  if (address !== originalAddress) {
    doc.querySelectorAll('a[href*="google.com/maps"]').forEach(link => { link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`; });
    doc.querySelector('.contact-grid a[href*="google.com/maps"] strong').textContent = address;
    doc.querySelector('.footer-main > p').textContent = address;
    if (doc.querySelector('#duvidas details:nth-child(5) p').textContent === originalAddressAnswer) doc.querySelector('#duvidas details:nth-child(5) p').textContent = address;
  }
}

// ZIP sem compressão: os arquivos permanecem compatíveis com descompactadores comuns.
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function zipFiles(files) {
  const encoder = new TextEncoder();
  const chunks = []; const central = []; let offset = 0; let centralSize = 0;
  for (const [name, bytes] of files) {
    const filename = encoder.encode(name); const checksum = crc32(bytes);
    const local = new Uint8Array(30 + filename.length); const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(6, 0x0800, true); lv.setUint16(12, 33, true);
    lv.setUint32(14, checksum, true); lv.setUint32(18, bytes.length, true); lv.setUint32(22, bytes.length, true); lv.setUint16(26, filename.length, true); local.set(filename, 30);
    const header = new Uint8Array(46 + filename.length); const cv = new DataView(header.buffer);
    cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true); cv.setUint16(8, 0x0800, true); cv.setUint16(14, 33, true);
    cv.setUint32(16, checksum, true); cv.setUint32(20, bytes.length, true); cv.setUint32(24, bytes.length, true); cv.setUint16(28, filename.length, true); cv.setUint32(42, offset, true); header.set(filename, 46);
    chunks.push(local, bytes); central.push(header); centralSize += header.length; offset += local.length + bytes.length;
  }
  const end = new Uint8Array(22); const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true); ev.setUint16(8, files.size, true); ev.setUint16(10, files.size, true); ev.setUint32(12, centralSize, true); ev.setUint32(16, offset, true);
  return new Blob([...chunks, ...central, end], {type: 'application/zip'});
}
async function readFile(path) {
  const response = await fetch(path, {cache: 'no-store'});
  if (!response.ok) throw new Error(`Não foi possível carregar ${path}. Verifique a conexão e tente novamente.`);
  return new Uint8Array(await response.arrayBuffer());
}
async function exportPackage() {
  const doc = page.cloneNode(true);
  applyContacts(doc);
  const files = new Map();
  const sourceCards = [...page.querySelectorAll('.gallery-card')];
  const outputCards = [...doc.querySelectorAll('.gallery-card')];
  for (let i = 0; i < sourceCards.length; i++) {
    const source = sourceCards[i]; const output = outputCards[i]; const file = selectedPhotos.get(source);
    const description = source._altInput.value.trim();
    if ((file || output.querySelector('img')) && !description) throw new Error(`Escreva uma descrição para a foto da atividade ${i + 1}.`);
    if (file) {
      const suffix = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp'}[file.type];
      const path = `assets/galeria-${Date.now()}-${i}.${suffix}`;
      const image = doc.createElement('img'); image.className = 'gallery-image'; image.src = path; image.alt = description;
      output.querySelector('.gallery-placeholder, img').replaceWith(image);
      files.set(path, new Uint8Array(await file.arrayBuffer()));
    } else if (output.querySelector('img')) {
      const image = output.querySelector('img'); image.alt = description;
      const url = new URL(image.getAttribute('src'), location.href);
      const assetsBase = new URL('assets/', location.href);
      if (url.origin !== location.origin || !url.pathname.startsWith(assetsBase.pathname)) throw new Error('A foto existente precisa estar na pasta assets do aplicativo.');
      const relative = 'assets/' + decodeURIComponent(url.pathname.slice(assetsBase.pathname.length));
      if (relative.includes('..') || relative.includes('\\')) throw new Error('Caminho inválido de foto.');
      files.set(relative, await readFile(url.href));
    }
  }
  const required = ['style.css', 'script.js', 'manifest.json', 'admin.html', 'admin.css', 'admin.js', 'assets/logo-ong.jpeg', 'assets/icon-192.png', 'assets/icon-512.png'];
  const contents = await Promise.all(required.map(readFile));
  required.forEach((path, i) => files.set(path, contents[i]));
  const worker = new TextDecoder().decode(await readFile('service-worker.js'));
  if (!/const CACHE_NAME = 'ong-1mais1-[^']+';/.test(worker)) throw new Error('Não foi possível atualizar o cache do aplicativo.');
  files.set('service-worker.js', new TextEncoder().encode(worker.replace(/const CACHE_NAME = 'ong-1mais1-[^']+';/, `const CACHE_NAME = 'ong-1mais1-${Date.now()}';`)));
  files.set('index.html', new TextEncoder().encode('<!doctype html>\n' + doc.documentElement.outerHTML));
  const blob = zipFiles(files); const url = URL.createObjectURL(blob);
  const download = document.createElement('a'); download.href = url; download.download = 'ong-1mais1-atualizado.zip'; download.click();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
document.querySelector('#add-card').addEventListener('click', addGalleryCard);
editor.addEventListener('submit', async event => {
  event.preventDefault();
  const button = document.querySelector('#download'); button.disabled = true; message('Preparando seus arquivos…');
  try { await exportPackage(); message('Pacote pronto! Extraia o ZIP e envie os arquivos ao GitHub conforme as instruções abaixo.'); }
  catch (error) { message(error.message || 'Não foi possível preparar o pacote. Tente novamente.'); }
  finally { button.disabled = false; }
});
(async () => {
  try {
    const response = await fetch('index.html', {cache: 'no-store'});
    if (!response.ok) throw new Error('Não foi possível carregar o aplicativo. Verifique sua conexão.');
    page = new DOMParser().parseFromString(await response.text(), 'text/html');
    makeTextFields(); makeContactFields();
    page.querySelectorAll('.gallery-card').forEach(addGalleryEditor);
    editor.hidden = false; message('');
  } catch (error) { message(error.message || 'Não foi possível abrir o painel. Use um endereço HTTPS ou localhost.'); }
})();
