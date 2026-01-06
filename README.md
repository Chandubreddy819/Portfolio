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

## 4. Customizing Your Content
- **Images**: Place your images in the `assets/` folder.
- **Edit HTML**: Open `index.html` to change the text (About Me, Projects, etc.).
- **Edit Projects**: Update the "Featured Projects" section in `index.html` with your actual work.
