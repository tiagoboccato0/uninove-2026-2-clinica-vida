import assert from 'node:assert/strict';

const base = process.env.CLINICA_URL || 'http://127.0.0.1:5080';
const text = html => html.replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
const names = html => [...text(html).matchAll(/data-medico-nome="([^"]+)"/g)].map(m => m[1]);
let failures = 0;
async function test(name, action) {
  try { await action(); console.log(`PASS ${name}`); }
  catch (error) { failures++; console.error(`FAIL ${name}: ${error.message}`); }
}
async function get(path) { return fetch(base + path); }
await test('listagem contém seis médicos em ordem alfabética', async () => {
  const response = await get('/Medicos'); assert.equal(response.status, 200);
  assert.deepEqual(names(await response.text()), ['Ana Prado', 'Bruno Lima', 'Caio Nunes', 'Luiza Alves', 'Marta Lisboa', 'Rafael Costa']);
});
await test('filtro de cardiologia retorna somente Ana e Marta e preserva seleção', async () => {
  const response = await get('/Medicos?especialidadeId=1'); assert.equal(response.status, 200);
  const html = await response.text(); assert.deepEqual(names(html), ['Ana Prado', 'Marta Lisboa']);
  assert.match(html, /<option[^>]*value="1"[^>]*selected/);
});
await test('especialidade sem médicos apresenta lista vazia', async () => {
  const response = await get('/Medicos?especialidadeId=5'); assert.equal(response.status, 200);
  const html = await response.text(); assert.deepEqual(names(html), []); assert.match(html, /Nenhum médico encontrado/);
});
await test('especialidade inexistente não vaza todos os médicos', async () => {
  const response = await get('/Medicos?especialidadeId=999'); assert.equal(response.status, 200);
  assert.deepEqual(names(await response.text()), []);
});
for (const value of ['abc', '2147483648']) await test(`filtro malformado ${value} devolve 400`, async () => assert.equal((await get(`/Medicos?especialidadeId=${value}`)).status, 400));
await test('filtro vazio preserva a opção Todas', async () => {
  const response = await get('/Medicos?especialidadeId='); assert.equal(response.status, 200);
  assert.equal(names(await response.text()).length, 6);
});
await test('detalhe exibe nome, CRM e especialidade', async () => {
  const response = await get('/Medicos/Details/1'); assert.equal(response.status, 200);
  const html = text(await response.text()); assert.match(html, /Ana Prado/); assert.match(html, /112233/); assert.match(html, /Cardiologia/);
});
for (const id of [999, 0, -1]) await test(`médico inexistente ${id} devolve 404`, async () => assert.equal((await get(`/Medicos/Details/${id}`)).status, 404));
await test('especialidades exibem contagens incluindo zero e links de filtro', async () => {
  const response = await get('/Especialidades'); assert.equal(response.status, 200);
  const html = await response.text();
  const counts = [...html.matchAll(/data-especialidade-id="(\d+)"\s+data-medicos="(\d+)"/g)].map(m => [Number(m[1]), Number(m[2])]);
  assert.deepEqual(counts, [[1,2],[2,2],[3,1],[4,1],[5,0],[6,0]]);
  assert.match(html, /href="\/Medicos\?especialidadeId=1"/);
});
await test('detalhe de especialidade inexistente devolve 404', async () => assert.equal((await get('/Especialidades/Details/999')).status, 404));
await test('página inicial e CSS são servidos', async () => {
  assert.equal((await get('/')).status, 200);
  const response = await get('/css/site.css'); assert.equal(response.status, 200); assert.match(response.headers.get('content-type'), /text\/css/);
});
if (failures) process.exitCode = 1;
