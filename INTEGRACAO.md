# Integração futura com TouchPay

## Estado atual

O site usa dados fictícios de products.js. A interface depende apenas do método assíncrono CatalogSource.getProducts(), em data-source.js. O modo API já inclui timeout, validação de resposta, saneamento dos textos exibidos e tratamento de falhas; ainda depende de um backend real e da documentação oficial da TouchPay.

## Arquitetura

TouchPay → backend do mercado → endpoint público de consulta → catálogo.

GitHub Pages serve arquivos estáticos e não executa o backend. Hospede essa parte separadamente. As credenciais da TouchPay ficam exclusivamente no servidor, em variáveis de ambiente. O endpoint público deve expor apenas os dados de catálogo necessários. Não inclua segredos nos arquivos JS nem no repositório.

## Contrato esperado pelo catálogo

O exemplo é um contrato nosso, **não o formato confirmado da API TouchPay**:

```json
{
  "updatedAt": "2026-10-03T12:00:00-03:00",
  "products": [
    {
      "id": "produto-001",
      "code": "001",
      "name": "Água mineral",
      "category": "Bebidas",
      "unit": "500 ml",
      "price": 2.99,
      "oldPrice": null,
      "stock": 12,
      "description": "Água mineral sem gás.",
      "image": "https://seu-dominio.example/imagens/agua.webp"
    }
  ]
}
```

IDs únicos e estáveis preservam a lista do cliente. price e stock devem ser números finitos e não negativos. oldPrice só aparece quando maior que price. updatedAt indica quando a fonte realmente foi atualizada. Nomes e categorias são obrigatórios. URLs de fotos devem ser HTTPS ou caminhos locais da mesma origem. A descrição é tratada como texto, sem HTML.

## Passos para conectar

1. Confirmar com a TouchPay a documentação, autorização de acesso, campos de produto/estoque/preço, unidade monetária, paginação e limites de consulta.
2. Implementar no backend a autenticação e a leitura de todas as páginas. Converter a resposta para o contrato acima, sem expor registros internos ou credenciais.
3. Configurar CORS para o domínio do catálogo se o endpoint estiver em outro domínio. Aplicar controle de frequência e política de atualização no backend.
4. Em CATALOG_CONFIG, alterar mode para 'api' e endpoint para a URL HTTPS real do backend. O limiar de poucas unidades é configurável.
5. Remover dados e fotos fictícios que não forem mais usados. O aviso demonstrativo é ocultado automaticamente somente depois de uma resposta válida em modo API.
6. Testar produtos indisponíveis, preço promocional, IDs duplicados, timeout, falha do servidor, resposta vazia, navegação offline e atualização de dados.

## Atualização e offline

A API é consultada a cada abertura ou recarga. Não há sincronização automática em tempo real, polling ou webhook implementado. O rodapé exibe updatedAt. Defina com o mercado a frequência necessária antes de anunciar estoque em tempo real.

O service worker só armazena arquivos estáticos conhecidos, nunca o endpoint de estoque. Se a consulta falhar em modo API, a tela apresenta erro e permite tentar novamente; não substitui silenciosamente o estoque real por dados fictícios. Se a conexão cair depois de carregar, os dados já exibidos permanecem na memória e uma mensagem avisa que podem estar desatualizados. Uma recarga offline em modo API exige reconexão para obter produtos.

A disponibilidade nunca reserva o item. A lista é local, não é pedido, carrinho ou compra e não envia dados ao mercado.
