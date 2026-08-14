# 🚀 Guia de Deploy e Versionamento no GitHub - Mr3D

Este documento orienta como publicar o seu projeto **Mr3D** no seu **GitHub** e ativá-lo no **GitHub Pages** gratuitamente.

---

## 1. 📤 Primeiro Commit no Git Local

No terminal da pasta `c:\Mega\Max3D`, execute os seguintes comandos:

```bash
# 1. Adicionar todos os arquivos ao Git
git add .

# 2. Criar o primeiro commit
git commit -m "feat: versão inicial da plataforma Mr3D Maker"

# 3. Definir a branch principal como main
git branch -M main
```

---

## 2. 🔗 Conectar ao seu Repositório no GitHub

1. Vá até o [GitHub](https://github.com/new) e crie um novo repositório com o nome **mr3d** (ou o nome que preferir).
2. Deixe o repositório como **Público** (necessário para o GitHub Pages gratuito).
3. No terminal da sua máquina, execute:

```bash
# Adicionar o repositório remoto (substitua 'SEU_USUARIO' pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/mr3d.git

# Enviar os arquivos para o GitHub
git push -u origin main
```

---

## 3. 🌐 Ativar a Publicação no GitHub Pages

Existem duas formas fáceis de publicar o site:

### Opção A: Deploy Automático via npm (Recomendado)
Já deixamos tudo pronto no `package.json`. No terminal, basta rodar:

```bash
npm run deploy
```

Este comando irá compilar o projeto e enviar a pasta `dist` automaticamente para a branch `gh-pages` do seu repositório.

### Opção B: Ativação no Painel do GitHub
1. Abra o seu repositório no GitHub (`https://github.com/SEU_USUARIO/mr3d`).
2. Acesse **Settings** > **Pages** no menu esquerdo.
3. Em **Build and deployment**:
   - **Source**: Selecione `Deploy from a branch`.
   - **Branch**: Selecione `gh-pages` e a pasta `/ (root)`.
4. Clique em **Save**. Em 1 a 2 minutos o seu site estará no ar no link:
   `https://SEU_USUARIO.github.io/mr3d/`

---

## 🔒 Segurança e Dados no GitHub Pages

- O seu site no GitHub Pages roda no navegador de forma estática.
- **A senha do Admin** está protegida por Hash criptográfico **SHA-256**.
- **A Calculadora de Custos** (custo por kg de filamento, tarifa de energia, depreciação e margem de lucro) é uma ferramenta privada do Maker e **nunca fica visível para os visitantes**.
- Quando você editar peças no Painel Admin, pode clicar na aba **Exportar / GitHub Sync** para baixar o novo `catalog.json` atualizado.
