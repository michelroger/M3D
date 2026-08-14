# 🚀 Plataforma M3D - GitHub & GitHub Pages

Sua plataforma **M3D** está configurada para o repositório oficial no GitHub e GitHub Pages!

---

## 🔗 Links Oficiais

- **Repositório no GitHub**: [https://github.com/michelroger/m3d](https://github.com/michelroger/m3d)
- **Site ao Vivo no GitHub Pages**: [https://michelroger.github.io/m3d/](https://michelroger.github.io/m3d/)

---

## 🔄 Como Atualizar o Site no Futuro

Sempre que você fizer alterações no código ou adicionar novas peças via Admin e substituir o arquivo `catalog.json`:

```bash
# 1. Adicionar e commitar as alterações
git add .
git commit -m "update: atualização de produtos no catálogo"

# 2. Enviar o código para a branch principal
git push origin main

# 3. Publicar a nova versão no GitHub Pages
npm run deploy
```

---

## 🌐 Configuração do GitHub Pages (Se necessário no painel)

Caso o site precise de confirmação da branch no GitHub:
1. Acesse **[Settings > Pages](https://github.com/michelroger/m3d/settings/pages)** do seu repositório.
2. Certifique-se de que a **Branch** está definida como **`gh-pages`** e a pasta como **`/ (root)`**.
3. Em 1 a 2 minutos a nova versão estará online!
