# PortOS v1.0 (Beta) 🖥️

> "It runs on Next.js but dreams of being a Linux distro."

A fully interactive **Terminal Portfolio** that turns your browser into a command-line interface. Built with Next.js, Tailwind CSS, and a love for retro aesthetics.

![PortOS Terminal](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtY2J6eXF6YjJ6YjJ6YjJ6YjJ6YjJ6YjJ6YjJ6YjJ6YjJ6/xT9IgzoKnwFNmISR8I/giphy.gif)
_(Replace this with a real screenshot of your terminal!)_

## 🚀 Features

- **Interactive File System**: Navigate with `cd`, `ls`, and `cat`.
- **Real Email Protocol**: Send me a message directly from the terminal via `contact`.
- **Minigames**:
  - 🐍 `snake`: Slither around when you should be working.
- **Themes**: Switch styles with `theme <name>` (Matrix, Drac, Cyber, Amber).
- **Easter Eggs**: Try `sudo`, `rm -rf /`, or `test` (if you dare).
- **Mobile Friendly**: Responsive design that works on phones (virtual keyboard support).

## 🛠️ Usage

### Commands

| Command    | Description                               |
| :--------- | :---------------------------------------- |
| `help`     | List all available commands               |
| `about`    | Display my graphical profile card         |
| `projects` | List my work (clickable links)            |
| `contact`  | Send me a secure email (Interactive Form) |
| `theme`    | Change color scheme (try `theme matrix`)  |
| `clear`    | Clean the terminal buffer                 |

## 📦 Installation & Setup

1.  **Clone the repo**:

    ```bash
    git clone https://github.com/Gurukrishnaa/cli-portfolio.git
    cd cli-portfolio
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env.local` file for the email feature:

    ```env
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-google-app-password
    ```

4.  **Run Dev Server**:
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000`.

## ☁️ Deployment (Vercel)

1.  Push your code to [GitHub](https://github.com/Gurukrishnaa/cli-portfolio).
2.  Go to [Vercel](https://vercel.com) and "Import Project".
3.  **Important**: Add your Environment Variables (`EMAIL_USER`, `EMAIL_PASS`) in the Vercel Dashboard settings.
4.  Hit **Deploy**.

## 👨‍💻 Credits

Made with ❤️ and ☕ by **Guru Krishnaa**.
