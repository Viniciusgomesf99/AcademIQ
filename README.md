# AcademIQ

**AcademIQ** é uma plataforma inovadora para gerenciamento de cursos online, desenvolvida para facilitar a criação, organização e reprodução de conteúdos educativos.

## 🛠️ Funcionalidades

- **Gerenciamento de Cursos**: Crie e organize cursos com pastas temáticas (tópicos e sub-tópicos).
- **Upload de Vídeos**: Suporte integrado para envio de vídeos via API PandaVideos.
- **Alterar Thumbnails**: Personalize thumbnails facilmente.
- **Interface Responsiva**: Design adaptado para diversos dispositivos.
- **Duração Detalhada**: Exibe duração total por tópico e vídeo.

## 🚀 Tecnologias Utilizadas

- **Frontend**:
  - Angular 15
  - Angular Material
  - SCSS
- **Backend/API**:
  - Integração com API PandaVideos
  - Configuração de variáveis de ambiente com `.env`
- **Deploy**:
  - Vercel
- **Outros**:
  - Upload de arquivos e metadados estruturados
  - Gerenciamento de estado com serviços Angular

## 🛠️ Instalação e Execução

### Pré-requisitos

Certifique-se de ter instalado:
- [Node.js](https://nodejs.org)
- [Angular CLI](https://angular.io/cli)

### Passos

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/academiq.git
   cd academiq
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Altere o arquivo `environment.ts` em /src/environments:
     ```env
     PandaApiKey=SUA_CHAVE_API
     PandaApiUrl=https://api-v2.pandavideo.com.br
     ```
   - Substitua `SUA_CHAVE_API` pela sua chave da API PandaVideos.

4. Execute o servidor de desenvolvimento:
   ```bash
   ng serve
   ```

5. Acesse no navegador:
   ```
   http://localhost:4200
   ```

## 🌐 Deploy na Vercel

1. Configure as variáveis de ambiente na Vercel.
2. Realize o build do projeto:
   ```bash
   ng build --configuration production
   ```
3. Faça o upload dos arquivos gerados na pasta `dist/`.

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais informações.

---

**AcademIQ** – Transformando a forma de gerenciar cursos online!
