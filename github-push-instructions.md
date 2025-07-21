# Push to GitHub Instructions

Since we need authentication, you have two options:

## Option 1: Use GitHub CLI (Easiest)
```bash
# Install GitHub CLI if you don't have it
brew install gh

# Login to GitHub
gh auth login

# Then push
git push -u origin main
```

## Option 2: Use Personal Access Token
1. Go to: https://github.com/settings/tokens/new
2. Create a token with "repo" permissions
3. Copy the token
4. Run this command and paste your token when asked for password:
```bash
git push -u origin main
# Username: raydawg88
# Password: [paste your token]
```

## Option 3: SSH Key (One-time setup)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "ray.hernandez@gmail.com"

# Copy the key
pbcopy < ~/.ssh/id_ed25519.pub

# Add to GitHub: https://github.com/settings/ssh/new
# Then change remote to SSH:
git remote set-url origin git@github.com:raydawg88/nova-tools.git
git push -u origin main
```

## After Pushing

Once the code is pushed, we need to enable GitHub Pages:

1. Go to: https://github.com/raydawg88/nova-tools/settings/pages
2. Under "Source", select "Deploy from a branch"
3. Under "Branch", select "main"
4. Under "Folder", select "/ (root)"
5. Click "Save"

Your site will be live at: https://raydawg88.github.io/nova-tools/

Just let me know which option you want to use and I'll help you through it!