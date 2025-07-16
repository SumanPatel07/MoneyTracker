# MoneyTracker

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


✅ 1) Push your Angular project code to GitHub
✅ 2) Deploy (host) it on GitHub Pages
🔁 PART 1: Push Your Code to GitHub
We'll assume you already created the GitHub repository and have Git installed.

🧭 Step 1: Open terminal in your Angular project root folder
Example:
cd E:\Projects\MoneyTracker\MoneyTracker

🧼 Step 2: Initialize Git (if not already done)
git init

📁 Step 3: Add all files to Git
git add .

📝 Step 4: Commit your code
git commit -m "Initial commit"

🔗 Step 5: Add your GitHub repo as a remote
Replace <your-username> and <repo-name>:

git remote add origin https://github.com/SumanPatel07/MoneyTracker.git

🚀 Step 6: Push your code
git push -u origin master


🌍 PART 2: Deploy to GitHub Pages
🧩 Step 1: Add deployment tool (only once)
ng add angular-cli-ghpages
Installs angular-cli-ghpages and sets up deployment support.

🛠️ Step 2: Build the Angular app for production
Use this exact command (change repo name as needed):

ng build --configuration production --base-href "https://SumanPatel07.github.io/MoneyTracker/"
This creates the build files at:

dist/money-tracker/

🌐 Step 3: Deploy to GitHub Pages
npx angular-cli-ghpages --dir=dist/money-tracker

🏁 Final Step: GitHub Pages Setup
Go to https://github.com/SumanPatel07/MoneyTracker

Click on Settings → Pages

Under "Branch", select:

Branch: gh-pages

Folder: / (root)

Click Save

✅ Done! Your app will be live at:
🔗 https://SumanPatel07.github.io/MoneyTracker/

🛠️ Optional Automation (Next Time)
Once angular-cli-ghpages is installed, you can just run:

bash
Copy
Edit
ng deploy --base-href="https://SumanPatel07.github.io/MoneyTracker/"
It will build and deploy in one step!