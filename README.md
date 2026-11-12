<!-- coderabbit-ai-generated:v1 -->

<!-- coderabbit-ai-generated-section:v1:153d9fa4244abad8073f74e793ba890e79868012d2c1adef2449979171513b4c -->

# ONG 1+1 faz a diferença — aplicativo web

Aplicativo informativo em HTML, CSS e JavaScript, sem cadastro ou banco de dados. Os arquivos do projeto ficam na raiz do repositório; mantenha também a pasta `assets` ao copiar o projeto.

<!-- coderabbit-ai-generated:v1 -->

<!-- coderabbit-ai-generated-section:v1:4fed682d6ff0a23959e04ce5b73f3541334a80ac2ce2adfd53c399d373def30f -->

## Painel de administração

Depois da primeira publicação, abra o aplicativo e toque em **Administração** no rodapé. Edite os textos e contatos, escolha fotos JPEG, PNG ou WebP de até 8 MB e informe uma descrição para cada imagem. É possível adicionar e remover atividades da galeria. Clique em **Baixar arquivos atualizados**, extraia o ZIP e envie os arquivos e a pasta `assets` ao repositório no GitHub. Confirme o commit na branch usada pelo Pages e aguarde a publicação. As mudanças só aparecem depois desse envio.

O painel funciona no navegador, sem senha ou banco de dados. Qualquer visitante pode abrir o painel e baixar sua própria cópia; somente quem possui acesso ao repositório pode publicar alterações. As edições não ficam salvas no painel ao fechar a página. Para continuar depois, primeiro publique a versão gerada e abra o painel dessa versão. Ele precisa estar acessível por HTTPS ou localhost e ter conexão para obter os arquivos do aplicativo. O pacote gerado contém os arquivos necessários para o site; mantenha este README e o relatório em seu repositório.

## Publicar no GitHub Pages

<!-- /coderabbit-ai-generated:v1 -->

1. Envie todos os arquivos deste projeto para um repositório no GitHub.
2. No repositório, abra **Settings → Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**, escolha a branch `main` e a pasta `/ (root)` e salve.
4. Aguarde a publicação e abra o endereço informado na página de configuração. O PWA precisa de HTTPS (fornecido pelo GitHub Pages) ou localhost para instalar e funcionar offline.

Para visualizar localmente, execute `python3 -m http.server 8000` na pasta do projeto e abra `http://localhost:8000`. Abrir o arquivo diretamente não ativa o service worker.

<!-- coderabbit-ai-generated:v1 -->

<!-- coderabbit-ai-generated-section:v1:8911f3bed7836316191ca2f11be5c1976bc6268096137924740eef1674d382fa -->

## Atualizar o conteúdo

- Em `index.html`, altere os textos das seções, o nome do presidente quando necessário e os campos `[PREENCHER]` da cantata. Copie o bloco `<article class="event-card">` para acrescentar eventos ou avisos na seção `agenda`.
- Para acrescentar uma foto à galeria, coloque o arquivo na pasta `assets` (por exemplo, `assets/aula.jpg`). No cartão correspondente em `index.html`, substitua todo o bloco `<div class="gallery-placeholder">...</div>` por `<img class="gallery-image" src="assets/aula.jpg" alt="Descrição da foto">`. Use uma descrição que represente a imagem. Edite o título `<h3>` e o texto `<p>` no mesmo cartão para descrever a atividade; copie um `<article class="gallery-card">` completo para acrescentar mais cartões. Fotos já visualizadas com o aplicativo online podem ser abertas offline depois que o service worker estiver ativo.
- Ainda em `index.html`, atualize os endereços dos links e os textos de WhatsApp, Instagram, e-mail e endereço em todas as ocorrências, inclusive no rodapé. O link do mapa usa o endereço como busca.
- `style.css` reúne as cores e os estilos; `script.js` controla o menu e a instalação; `manifest.json` contém o nome e os ícones do app.
- Depois de atualizar arquivos, altere a versão de `CACHE_NAME` em `service-worker.js` (por exemplo, de `v2` para `v3`) para que o navegador substitua os arquivos guardados para uso offline. O conteúdo atualizado pode aparecer após fechar e reabrir o aplicativo.



<!-- /coderabbit-ai-generated:v1 -->## Instalar no celular

Abra o endereço publicado no navegador. Quando aparecer o botão **Instalar aplicativo**, toque nele e confirme. Em outros navegadores, abra o menu e escolha **Adicionar à tela inicial** ou **Instalar aplicativo**. No iPhone, use o botão Compartilhar do Safari e escolha **Adicionar à Tela de Início**. A opção depende do navegador e do dispositivo. Após a primeira visita online, o conteúdo do aplicativo fica disponível offline; links externos precisam de conexão.

## Textos para o relatório

Os textos fornecidos para os campos “Solução escolhida” e “Descreva, brevemente, como a atividade foi desenvolvida” estão em `ajustes-relatorio.txt`, prontos para copiar ao relatório anterior. Substitua também as referências a “website” por “aplicativo web responsivo (PWA)” no relatório original.


<!-- /coderabbit-ai-generated:v1 -->