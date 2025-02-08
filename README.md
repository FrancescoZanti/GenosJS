# Sticker Generator

This project is a simple sticker generator that creates A6 stickers containing unique QR codes based on a list of URLs provided by the user. Each sticker features a logo at the top and the corresponding QR code below.

## Project Structure

```
sticker-generator
├── src
│   ├── index.html       # Main HTML template for the sticker generator
│   ├── main.js          # JavaScript code for generating QR codes
│   └── styles.css       # CSS styles for the sticker layout
├── assets
│   └── logo.jpg         # Logo image displayed on each sticker
├── package.json         # Configuration file for npm
└── README.md            # Documentation for the project
```

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd sticker-generator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Open the project:**
   Open `src/index.html` in your web browser to view the sticker generator.

## Usage

- Provide a list of URLs in the designated input area.
- Click the button to generate stickers.
- Each sticker will display the logo at the top and a unique QR code below it.

## Customization

- To change the logo, replace the `assets/logo.jpg` file with your desired image.
- Modify the layout and styles in `src/styles.css` to fit your design preferences.
- Update the QR code generation logic in `src/main.js` as needed.

## License

This project is licensed under the MIT License. Feel free to modify and distribute as per your requirements.