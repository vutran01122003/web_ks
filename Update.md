# Cập nhật 21/10/2023

- [Fix error the above dynamic import cannot be analyzed by Vite](#pageRender_line-25)
- [Add file .gitignore](#addGitingore)
  <a id="pageRender_line-25"></a>

## PageRender.jsx line 25 - Thuận Nguyễn

### Trước:

- `` import(`../../pages/${pageName}.`) ``

### Sau:

- `` import(`../../pages/${pageName}.jsx`) ``

### Tham khảo: [Link ](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations)

<a id="addGitingore"></a>

## Add file .gitignore

- Thêm file `.gitingore` bỏ qua file node_modules khi `git push`
