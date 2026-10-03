# Mercadinho Pontal da Serra — catálogo digital

Modelo completo em HTML, CSS e JavaScript puro, sem instalação de dependências ou etapa de compilação. Nenhuma compra, pagamento, reserva ou login é realizado pelo catálogo.

## Abrir agora

Extraia o ZIP e abra **index.html** no navegador. Busca, filtros, detalhes e lista funcionam nessa abertura. Para testar instalação e modo offline, use uma hospedagem HTTPS ou servidor local. O armazenamento da lista ao abrir diretamente um arquivo depende do navegador.

Se tiver Python instalado, abra um terminal nesta pasta e execute:

```sh
python -m http.server 8080
```

Depois visite `http://localhost:8080`. Encerre o servidor com Ctrl+C.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie **o conteúdo desta pasta** para a raiz do repositório: o arquivo index.html deve ficar na raiz, junto de styles.css, app.js e assets. Inclua também o arquivo .nojekyll.
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**.
5. Escolha a branch **main**, a pasta **/(root)** e salve.
6. Aguarde o GitHub mostrar o endereço publicado. Abra esse endereço no celular.

Os caminhos são relativos: o catálogo funciona tanto na raiz de um domínio quanto em uma pasta de projeto do GitHub Pages.

Fonte: [documentação oficial de publicação do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Domínio próprio

É possível usar a mesma pasta em qualquer hospedagem estática com HTTPS. No GitHub Pages, configure **Custom domain** e os registros DNS indicados para seu domínio; depois habilite **Enforce HTTPS** quando disponível. Não incluímos um domínio de exemplo no arquivo CNAME para evitar uma configuração incorreta.

Siga a [documentação oficial de domínios do GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Instalar no celular

Visite o endereço publicado em HTTPS e toque em **Instalar catálogo**, quando a opção estiver disponível. No iPhone, use Safari → Compartilhar → Adicionar à Tela de Início. O botão **Como instalar** também mostra as instruções.

O pacote contém manifesto, ícones 192/512 px, ícone adaptável e service worker. A instalação depende do suporte do navegador; não foi testada fisicamente em um iPhone ou Android. O funcionamento offline foi verificado em navegador desktop, simulando falta de conexão. Fonte: [guia de instalação de PWAs da MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable).

## O que está incluído

- 27 produtos fictícios, com fotos locais ilustrativas, categorias e códigos.
- Busca instantânea por nome, categoria ou código, sem diferenciar acentos.
- Filtros combináveis por categoria, oferta e disponibilidade.
- Ordenação por destaques, preço e nome.
- Preço anterior riscado, percentual de desconto e preço da oferta.
- Detalhes em janela acessível pelo teclado; Escape fecha a janela.
- Lista “Tem o que eu preciso?”, com pesquisa e resumo de itens disponíveis.
- Lista salva localmente no navegador, sem transmissão para servidor.
- Layout responsivo, estados vazios e mensagens de erro e falta de conexão.
- PWA com arquivos e fotos de demonstração disponíveis offline após carregamento completo.

## Editar produtos e visual

- **products.js**: nomes, códigos, categorias, unidades, preços, estoque, descrições e fotos fictícias. Preços são números em reais, com ponto decimal.
- **data-source.js**: origem dos dados e limite de poucas unidades (padrão: 5).
- **styles.css**: cores, espaçamento e aparência.
- **index.html**: textos, nome do mercado e estrutura.
- **assets/**: fotos e ícones. Todas as imagens usadas já estão no pacote.
- **manifest.webmanifest**: nome e ícones do aplicativo.
- **sw.js**: lista de arquivos offline e versão do cache.

Ao adicionar fotos, atualize também a lista CORE do sw.js se quiser disponibilizá-las offline. Ao publicar alterações, aumente VERSION em sw.js (por exemplo, pontal-v2). A próxima visita conectada atualiza os arquivos; recarregue a página após a atualização.

## Estoque

Estoque acima de 5: **Disponível**. Entre 1 e 5: **Poucas unidades**. Zero: **Indisponível**. Ambos os primeiros status contam como disponíveis na lista. A quantidade exata não aparece para o cliente.

## Integração futura

A TouchPay **não está conectada**. Consulte **INTEGRACAO.md** para o contrato de dados e a separação entre o catálogo e um futuro backend. Não existe chave, senha ou endpoint real no pacote.

## Imagens

A foto do mercado foi recortada da referência fornecida pelo usuário. O ícone 24h é uma marca provisória simples, não uma reprodução exata do logotipo original. Fotos ilustrativas de produtos obtidas do conjunto público de demonstração [DummyJSON](https://dummyjson.com/products/category/groceries), com origem individual em **FONTES-IMAGENS.json**. As embalagens, marcas e porções nas imagens não representam um inventário real: substitua por fotos e dados do mercado antes de usar como catálogo real. O pacote não declara licença comercial de terceiros sobre marcas ou fotografias.

## Verificação realizada

Busca com e sem acento e por código; categorias; filtros combinados; oito ofertas; ordenação; detalhes; inclusão, remoção e persistência da lista; contagem de disponíveis; recarga offline; ausência de erros JavaScript; ausência de rolagem horizontal nas larguras 320 e 390 px. Conferência visual em desktop e celular simulado. Nenhum serviço foi publicado nem domínio configurado.
