# Portfolio Deployment Instructions

Your portfolio website is built! Here is how to put it online using GitHub Pages.

## 1. Create a Repository on GitHub
1. Go to [GitHub.com](https://github.com) and log in.
2. Click the **+** icon in the top right and select **New repository**.
3. Name the repository `portfolio` (or `username.github.io` if you want it to be your main site).
4. Make sure it is **Public**.
5. **Do not** initialize with README, .gitignore, or License (we already have files locally).
6. Click **Create repository**.

## 2. Push Your Code
Run the following commands in your terminal (VS Code terminal is fine):

```bash
# Link your local folder to the GitHub repo
# Replace 'YOUR_USERNAME' with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git

# Rename the branch to main (if not already)
git branch -M main

# Push your code
git push -u origin main
```

## 3. Activate GitHub Pages
1. Go to your repository **Settings** tab.
2. Click on **Pages** in the left sidebar.
3. Under **Build and deployment** > **Branch**, select `main` and save.
4. GitHub will give you a link (e.g., `https://yourname.github.io/portfolio/`). It might take a minute to appear.

## 4. Editing Content

This site runs on Jekyll — content lives in plain text files, not hand-coded HTML. GitHub Pages builds it automatically on every push; there's no build step to run yourself.

- **Add a project**: create a new file in `_projects/`, e.g. `_projects/my-new-thing.md`. Copy the front matter structure from an existing file (`_projects/ble-mioty-tag.md` is a good example) — title, summary, tech, sections, etc. Delete the file to remove a project. It'll automatically appear on the homepage and Projects page, and get its own page at `/projects/<filename>/`.
- **Add a blog post**: create a new file in `_posts/`, named `YYYY-MM-DD-title.md` (the date in the filename controls its publish date and sort order). Write the front matter (title, category, tags) then the post body as normal Markdown (`## heading` for sections).
- **Edit your bio, status fields, or social links**: edit `_data/profile.yml`.
- **Edit your experience/education timeline**: edit `_data/experience.yml`.
- **Edit your skills list**: edit `_data/skills.yml`.
- **Edit awards, publications, funding, or languages** (shown on the Resume page): edit `_data/achievements.yml`.
- **Images**: place them in `assets/`, then reference them by path (e.g. `assets/project_images/my-photo.png`) in the relevant front matter field.

Commit and push any of these changes to `main` — GitHub Pages rebuilds and redeploys automatically within a minute or two.

### Previewing changes locally before pushing

Requires Ruby (with DevKit on Windows) and Bundler installed once:

```bash
bundle install
bundle exec jekyll serve
```

Then open `http://127.0.0.1:4000/Portfolio/` to preview your changes before pushing.
